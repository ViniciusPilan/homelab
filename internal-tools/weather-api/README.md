# Weather API

A small local Python API that retrieves temperature and precipitation forecasts from
[Open-Meteo](https://open-meteo.com/en/docs).

`GET /weather` returns each hourly temperature, precipitation probability, and
precipitation amount for the current local day. For the following day it
returns Open-Meteo's daily mean temperature, maximum precipitation probability,
and precipitation total. Supply either a city preset or coordinates; timezone
defaults to `auto` and is resolved from the coordinates. City names are
case-insensitive and accept accents, spaces, hyphens, and an optional `, SP`
or `-SP` suffix.

Available city presets are Sao Manuel, Barretos, and Botucatu, all in Sao Paulo
state. `GET /cities` returns their IDs and coordinates.

## Run locally

```sh
cd internal-tools/weather-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## API inputs

The base URL while running locally is `http://127.0.0.1:8000`.

### Get a forecast by preset city

Send a `GET` request to `/weather` with one `city` query parameter. For the
full Sao Manuel example below, the exact request is:

```sh
curl --fail --silent --show-error 'http://127.0.0.1:8000/weather?city=Sao%20Manuel'
```

Accepted city values are `Sao Manuel` (or `sao-manuel`), `Barretos` (or
`barretos`), and `Botucatu` (or `botucatu`). Names are case-insensitive;
spaces, hyphens, accents, and an optional `SP` suffix are accepted. The
response includes a `city` field with the preset's display name.

To retrieve the supported preset IDs and coordinates, send `GET /cities`:

```sh
curl --fail --silent --show-error 'http://127.0.0.1:8000/cities'
```

Alternatively, omit `city` and provide both `latitude` and `longitude`, for
example `/weather?latitude=-23.55&longitude=-46.63`. The optional `timezone`
parameter defaults to `auto` and can be set to a timezone name such as
`America/Sao_Paulo`. Use either a city or a coordinate pair in each request.

The forecast response contains `today.date`, `today.hourly` (an array of
`time`, `temperature_c`, `precipitation_probability_percent`, and
`precipitation_mm` values), `tomorrow.date`, `tomorrow.average_temperature`,
`tomorrow.maximum_precipitation_probability_percent`, and
`tomorrow.precipitation_sum_mm`. Probability is a percentage. Precipitation
amounts use the unit given by `precipitation_unit` (millimeters by default).
Tomorrow's probability is the provider's daily maximum, and its amount is the
full-day sum. `temperature_unit` gives the temperature unit, and the top-level
latitude, longitude, timezone, and city identify the forecast location. Dates
and forecast values change as Open-Meteo updates its data.

The interactive API documentation is available at `http://127.0.0.1:8000/docs`.
The API allows cross-origin GET requests so a separately hosted browser frontend
can retrieve the public forecast and city list.

Example full response:

```json
{
  "latitude": -22.741652,
  "longitude": -48.60562,
  "timezone": "America/Sao_Paulo",
  "temperature_unit": "°C",
  "precipitation_unit": "mm",
  "today": {
    "date": "2026-10-24",
    "hourly": [
      {"time": "2026-10-24T00:00", "temperature_c": 17.7, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T01:00", "temperature_c": 17.7, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T02:00", "temperature_c": 17.7, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T03:00", "temperature_c": 17.3, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T04:00", "temperature_c": 17.3, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T05:00", "temperature_c": 17.3, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T06:00", "temperature_c": 17.4, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T07:00", "temperature_c": 18.5, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T08:00", "temperature_c": 20.5, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T09:00", "temperature_c": 21.7, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T10:00", "temperature_c": 22.6, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T11:00", "temperature_c": 22.4, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T12:00", "temperature_c": 23.0, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T13:00", "temperature_c": 25.1, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T14:00", "temperature_c": 26.3, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T15:00", "temperature_c": 27.3, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T16:00", "temperature_c": 27.2, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T17:00", "temperature_c": 26.0, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T18:00", "temperature_c": 24.8, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T19:00", "temperature_c": 23.5, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T20:00", "temperature_c": 21.9, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T21:00", "temperature_c": 20.6, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T22:00", "temperature_c": 20.8, "precipitation_probability_percent": 0, "precipitation_mm": 0.0},
      {"time": "2026-10-24T23:00", "temperature_c": 20.8, "precipitation_probability_percent": 0, "precipitation_mm": 0.0}
    ]
  },
  "tomorrow": {
    "date": "2026-10-25",
    "average_temperature": 20.5,
    "maximum_precipitation_probability_percent": 20,
    "precipitation_sum_mm": 0.4
  },
  "city": "Sao Manuel, SP"
}
```

The hourly and daily values are forecasts from Open-Meteo. The `temperature_2m_mean`
field is the provider's daily mean aggregation.
