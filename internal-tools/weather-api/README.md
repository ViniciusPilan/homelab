# Weather API

Small FastAPI service that returns hourly temperature, rain probability, and
rainfall for today and tomorrow in the supported cities. Forecast data comes
from Open-Meteo. Runtime dependencies are FastAPI, Requests, and Uvicorn; their
versions are pinned in `requirements.txt`.

## Run locally

From this directory, create and activate a virtual environment, install the
requirements, and start the API:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

The API listens at `http://127.0.0.1:8000`.

## Request and response

Send a `GET` request to `/sao-manuel`, `/barretos`, or `/botucatu`. The JSON
response contains `today` and `tomorrow` objects. Each has an `hourly` array
with the local timestamp, temperature in Celsius, precipitation probability in
percent, and precipitation amount in millimeters. Each also has a `summary`
with average, maximum, and minimum values for all three variables.

For example:

```sh
curl http://127.0.0.1:8000/botucatu
```

The response has this shape:

```json
{
  "today": {
    "hourly": [
      {
        "time": "2026-10-27T00:00",
        "temperature_c": 18.5,
        "precipitation_probability_percent": 10,
        "precipitation_mm": 0.0
      }
    ],
    "summary": {
      "temperature_c": {"average": 18.5, "max": 18.5, "min": 18.5},
      "precipitation_probability_percent": {"average": 10.0, "max": 10, "min": 10},
      "precipitation_mm": {"average": 0.0, "max": 0.0, "min": 0.0}
    }
  },
  "tomorrow": {
    "hourly": [],
    "summary": {
      "temperature_c": {"average": null, "max": null, "min": null},
      "precipitation_probability_percent": {"average": null, "max": null, "min": null},
      "precipitation_mm": {"average": null, "max": null, "min": null}
    }
  }
}
```
