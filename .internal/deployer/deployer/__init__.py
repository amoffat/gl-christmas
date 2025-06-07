import argparse
import hashlib
import lzma
import os
import tarfile
import tempfile
from typing import IO

import jwt
import requests
import urllib3
from urllib3.exceptions import InsecureRequestWarning

# suppress InsecureRequestWarning from requests
urllib3.disable_warnings(InsecureRequestWarning)

api_urls = {
    "local": "http://getlost-api:3000",
    "qa": "https://api.qa.getlost.gg",
    "prod": "https://api.getlost.gg",
}
api: str | None = None

# This is where we will fetch the WASM binary from. We rely on our
# assemblyscript vite plugin to do the compilation and serve the WASM file.
WASM_SERVER_BASE_URL = "https://localhost:5173"


def get_repo(jwt_token):
    """Extract the user/repo-name from the JWT token."""
    try:
        # Decode without verifying signature (we just want the claims)
        payload = jwt.decode(jwt_token, options={"verify_signature": False})
        return payload.get("repository")
    except Exception as e:
        print(f"Failed to extract repository from JWT: {e}")
        return None


def put_level(*, jwt: str, level_id: str, wasm, art):
    path = f"/v1/levels/{level_id}"
    api_url = f"{api}{path}"

    wasm.seek(0)
    art.seek(0)

    resp = requests.put(
        api_url,
        headers={
            "Authorization": f"Bearer {jwt}",
        },
        files={
            "wasm": ("main.wasm", wasm, "application/wasm"),
            "art": ("art.tar.xz", art, "application/x-xz"),
        },
    )
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")


def build_wasm() -> IO[bytes]:
    path = "/main.wasm"
    qs_dict = {"target": "release"}
    qs = "&".join(f"{k}={v}" for k, v in qs_dict.items())
    url = f"{WASM_SERVER_BASE_URL}{path}?{qs}"
    resp = requests.get(url, verify=False, stream=True)
    resp.raise_for_status()
    temp_wasm = tempfile.NamedTemporaryFile(delete=False, suffix=".wasm")
    for chunk in resp.iter_content(chunk_size=8192):
        temp_wasm.write(chunk)
    temp_wasm.flush()
    temp_wasm.seek(0)
    # Open a new file object for reading, so it can be used as a file in requests
    wasm_file = open(temp_wasm.name, "rb")
    return wasm_file


def collect_art(level_dir: str) -> IO[bytes]:
    """Create a tar.xz archive of all files in LEVEL_DIR and return a file-like object."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".tar.xz") as temp_xz:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".tar") as temp_tar:
            # Create tar archive
            with tarfile.open(temp_tar.name, "w") as tar:
                for root, dirs, files in os.walk(level_dir):
                    for file in files:
                        full_path = os.path.join(root, file)
                        arcname = os.path.relpath(full_path, level_dir)
                        tar.add(full_path, arcname=arcname)
            # Compress with xz
            temp_tar.seek(0)
            with open(temp_tar.name, "rb") as f_in, lzma.open(temp_xz, "wb") as f_out:
                f_out.write(f_in.read())
        os.unlink(temp_tar.name)
        temp_xz.flush()
        temp_xz.seek(0)
        # Open a new file object for reading, so it can be used as a file in requests
        art_file = open(temp_xz.name, "rb")
        return art_file


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

    wasm = build_wasm()
    art = collect_art(args.level)

    if args.env == "local":
        repo = "amoffat/gl-level"
    else:
        repo = get_repo(args.jwt)
        if not repo:
            print("Could not extract repository from JWT.")
            exit(1)

    level_id = hashlib.sha256(repo.encode("utf-8")).hexdigest()

    put_level(
        jwt=args.jwt,
        level_id=level_id,
        wasm=wasm,
        art=art,
    )


if __name__ == "__main__":
    main()
