from datetime import datetime, timedelta

import requests
from fastapi import FastAPI, HTTPException


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
REQUEST_TIMEOUT_SECONDS = 10

CITIES_PRESET = {
    "sao-manuel": (-22.73111, -48.57056),
    "barretos": (-20.55722, -48.56778),
    "botucatu": (-22.88583, -48.445),
}

app = FastAPI()


@app.get("/{city}")
def get_weather(city: str) -> dict[str, list[dict[str, str | float | int | None]]]:
    """Return hourly temperature and rainfall forecast for today and tomorrow."""
    if city not in CITIES_PRESET:
        raise HTTPException(status_code=404, detail="City not found")

    latitude, longitude = CITIES_PRESET[city]
    try:
        response = requests.get(
            OPEN_METEO_URL,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "hourly": "temperature_2m,precipitation_probability,precipitation",
                "forecast_days": 2,
                "timezone": "auto",
            },
            timeout=REQUEST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        hourly = response.json()["hourly"]
    except (requests.RequestException, ValueError, KeyError) as error:
        raise HTTPException(status_code=502, detail="Could not fetch weather forecast") from error

    today = datetime.fromisoformat(hourly["time"][0]).date()
    tomorrow = today + timedelta(days=1)
    forecast = {today.isoformat(): [], tomorrow.isoformat(): []}

    for index, timestamp in enumerate(hourly["time"]):
        day = timestamp[:10]
        if day in forecast:
            forecast[day].append(
                {
                    "time": timestamp,
                    "temperature_c": hourly["temperature_2m"][index],
                    "precipitation_probability_percent": hourly[
                        "precipitation_probability"
                    ][index],
                    "precipitation_mm": hourly["precipitation"][index],
                }
            )

    return {"today": forecast[today.isoformat()], "tomorrow": forecast[tomorrow.isoformat()]}
