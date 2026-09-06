import requests


class FakeResponse:

    def json(self):
        raise requests.exceptions.JSONDecodeError(
            "Invalid JSON",
            "invalid response",
            0
        )


try:
    response = FakeResponse()
    data = response.json()

except requests.exceptions.JSONDecodeError as e:
    print(f"Invalid JSON handled successfully: {e}")
