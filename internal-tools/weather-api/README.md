# Weather API

Small FastAPI service that returns hourly temperature, rain probability, and
rainfall for today and tomorrow in the supported cities. Forecast data comes
from Open-Meteo.

## Run locally

From this directory, create and activate a virtual environment, install the
requirements, and start the API:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API listens at `http://127.0.0.1:8000`.

## Request and response

Send a `GET` request to `/sao-manuel`, `/barretos`, or `/botucatu`. The JSON
response contains `today` and `tomorrow` arrays. Each hourly item includes its
local timestamp, temperature in Celsius, precipitation probability in percent,
and precipitation amount in millimeters.
