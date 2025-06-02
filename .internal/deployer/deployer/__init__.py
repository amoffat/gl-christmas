import argparse
import hashlib
import json

import jwt
import requests

api = "https://api.qa.getlost.gg"


def get_repo(jwt_token):
    try:
        # Decode without verifying signature (we just want the claims)
        payload = jwt.decode(jwt_token, options={"verify_signature": False})
        return payload.get("repository")
    except Exception as e:
        print(f"Failed to extract repository from JWT: {e}")
        return None


def put_level(*, jwt, level_id):
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
    )
    print(f"Status: {resp.status_code}")
    print(resp.text)


def main():
    parser = argparse.ArgumentParser(description="Create a new level in the game.")
    parser.add_argument(
        "--jwt",
        required=True,
        help="JWT token for authentication",
    )
    args = parser.parse_args()
    repo = get_repo(args.jwt)
    if not repo:
        print("Could not extract repository from JWT.")
        exit(1)
    level_id = hashlib.sha256(repo.encode("utf-8")).hexdigest()
    put_level(jwt=args.jwt, level_id=level_id)


if __name__ == "__main__":
    main()
