import argparse
import hashlib
import json

import jwt
import requests
import urllib3
from urllib3.exceptions import InsecureRequestWarning

# suppress InsecureRequestWarning from requests
urllib3.disable_warnings(InsecureRequestWarning)

api_urls = {
    "qa": "https://api.qa.getlost.gg",
    "prod": "https://api.getlost.gg",
}
api: str | None = None

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


def put_level(*, jwt, level_id, wasm):
    payload = json.dumps(
        {
            "name": "Test Level",
            "description": "This is a test level.",
        }
    )
    path = f"/v1/levels/{level_id}"
    api_url = f"{api}{path}"
    resp = requests.put(
        api_url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {jwt}",
        },
        files={
            "wasm": ("main.wasm", wasm, "application/wasm"),
        },
    )
    print(f"Status: {resp.status_code}")
    print(resp.json())


def build_wasm():
    path = "/main.wasm"
    qs_dict = {"target": "release"}
    qs = "&".join(f"{k}={v}" for k, v in qs_dict.items())
    url = f"{WASM_SERVER_BASE_URL}{path}?{qs}"
    resp = requests.get(url, verify=False)
    return resp.content


def main():
    parser = argparse.ArgumentParser(description="Create a new level in the game.")
    parser.add_argument(
        "--env",
        default="qa",
        choices=["qa", "prod"],
        help="Environment to deploy to (default: qa)",
    )
    parser.add_argument(
        "--jwt",
        required=True,
        help="JWT token for authentication",
    )
    args = parser.parse_args()

    global api
    api = api_urls.get(args.env)

    repo = get_repo(args.jwt)
    if not repo:
        print("Could not extract repository from JWT.")
        exit(1)

    level_id = hashlib.sha256(repo.encode("utf-8")).hexdigest()
    wasm = build_wasm()
    put_level(
        jwt=args.jwt,
        level_id=level_id,
        wasm=wasm,
    )


if __name__ == "__main__":
    main()
