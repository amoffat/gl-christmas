import argparse
import json
import subprocess
import tarfile
import tempfile
from pathlib import Path
from typing import Any

import jwt
import requests
import urllib3
from urllib3.exceptions import InsecureRequestWarning

# suppress InsecureRequestWarning from requests
urllib3.disable_warnings(InsecureRequestWarning)

internal_dir = Path(__file__).resolve().parent.parent.parent
api_urls = {
    "local": "http://getlost-api:3000",
    "qa": "https://api.qa.getlost.gg",
    "prod": "https://api.getlost.gg",
}
api: str | None = None

# This is where we will fetch the WASM binary from. We rely on our
# assemblyscript vite plugin to do the compilation and serve the WASM file.
WASM_SERVER_BASE_URL = "https://localhost:5173"


def put_level(*, jwt: str, level_id: str, assets):
    # Step 1: Request presigned upload URL
    path = f"/v1/levels/{level_id}/upload-url"
    api_url = f"{api}{path}"

    resp = requests.post(
        api_url,
        headers={
            "Authorization": f"Bearer {jwt}",
        },
    )
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        raise requests.HTTPError(
            f"{e}\nResponse body: {resp.text}", response=resp
        ) from e

    data = resp.json()
    upload_url = data["url"]
    fields = data["fields"]

    assets.seek(0)
    files = {
        "file": ("assets.tar.gz", assets, "application/gzip"),
    }
    multipart_data = fields.copy()
    resp2 = requests.post(
        upload_url,
        data=multipart_data,
        files=files,
    )
    try:
        resp2.raise_for_status()
    except requests.HTTPError as e:
        raise requests.HTTPError(
            f"{e}\nResponse body: {resp2.text}", response=resp2
        ) from e


def collect_wasm(*, tar: tarfile.TarFile, metadata: Any):
    """Compile WASM using the TypeScript CLI and add main.wasm to the provided tarfile handle."""
    import tempfile

    temp_dir = tempfile.TemporaryDirectory()
    out_dir = Path(temp_dir.name)
    script_dir = (internal_dir / "scripts").resolve()
    compile_script = script_dir / "compile-wasm.ts"
    # Use npx tsx to run the script, passing the output directory
    result = subprocess.run(
        [
            "npx",
            "tsx",
            str(compile_script),
            "--release",
            "--outDir",
            str(out_dir),
            "--metadata",
            json.dumps(metadata),
        ],
        cwd=str(script_dir),
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr)
        raise RuntimeError("WASM compilation failed")

    # Add the output WASM file to the tarfile
    wasm_path = out_dir / "main.wasm"
    tar.add(wasm_path, arcname="main.wasm")
    temp_dir.cleanup()


def collect_art(level_dir: Path, tar: tarfile.TarFile):
    """Add all files in LEVEL_DIR to the provided tarfile handle using pathlib.Path."""
    for file_path in level_dir.rglob("*"):
        if file_path.is_file():
            arcname = f"level/{file_path.relative_to(level_dir)}"
            tar.add(str(file_path), arcname=arcname)


def main():
    parser = argparse.ArgumentParser(description="Create a new level in the game.")
    parser.add_argument(
        "--env",
        default="qa",
        choices=["qa", "prod", "local"],
        help="Environment to deploy to (default: qa)",
    )
    parser.add_argument(
        "--jwt",
        required=True,
        help="JWT token for authentication",
    )
    parser.add_argument(
        "--level",
        required=True,
        help="Directory containing the level files to be uploaded",
    )
    args = parser.parse_args()

    global api
    api = api_urls.get(args.env)

    if args.env == "local":
        level_id = "123456"
        commit = "abc"
        repo = "amoffat/local-repo"
    else:
        claims = jwt.decode(args.jwt, options={"verify_signature": False})
        level_id = claims["repository_id"]
        repo = claims["repository"]
        commit = claims["sha"]

    # Create a single tar.gz file for both wasm and art
    with tempfile.NamedTemporaryFile(delete=False, suffix=".tar.gz") as temp_gz:
        with tarfile.open(temp_gz.name, "w:gz") as tar:
            collect_wasm(
                tar=tar,
                repo=repo,
                metadata={
                    "levelId": level_id,
                    "repo": repo,
                    "commit": commit,
                },
            )
            collect_art(Path(args.level).resolve(), tar)

        assets = open(temp_gz.name, "rb")

    put_level(
        jwt=args.jwt,
        level_id=level_id,
        assets=assets,
    )


if __name__ == "__main__":
    main()
