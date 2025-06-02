import argparse
import json

import requests

api_url = "https://api.qa.getlost.gg/v1/levels"


def main():
    parser = argparse.ArgumentParser(description="Create a new level in the game.")
    parser.add_argument(
        "--jwt",
        required=True,
        help="JWT token for authentication",
    )
    args = parser.parse_args()
    jwt = args.jwt

    payload = json.dumps(
        {
            "name": "Test Level",
            "description": "This is a test level.",
        }
    )
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


if __name__ == "__main__":
    main()
