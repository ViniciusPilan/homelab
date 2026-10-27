"""
This script get the html content from a set of endpoints.

how to run:
$ python3 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
$ python3 main.py

requirements:
- requests lib must be intalled
- internet connection

"""


import requests


ENDPOINTS = {
    "google": "https://www.google.com",
    "youtube": "https://www.youtube.com"
}


def get_content_from_html_page(target_endpoint):
    """
    This function will reach a endpoint and get the html content.
    """

    response = requests.get(target_endpoint)

    if response:
        print(response.text)
    else:
        print(f"Error when trying to get content from {target_endpoint}")


def main():
    for endpoint in ENDPOINTS.values():
        get_content_from_html_page(target_endpoint=endpoint)


if __name__ == "__main__":
    main()
