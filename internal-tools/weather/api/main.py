from datetime import datetime, timedelta
import os
from typing import Any

import requests
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
REQUEST_TIMEOUT_SECONDS = 10
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))

CITIES_PRESET = {
    "sao-manuel": (-22.73111, -48.57056),
    "barretos": (-20.55722, -48.56778),
    "botucatu": (-22.88583, -48.445),
}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["Accept"],
)


@app.get("/{city}")
def get_weather(city: str) -> dict[str, Any]:
    """Return hourly temperature and rainfall forecast for today and tomorrow."""
    if city not in CITIES_PRESET:
        raise HTTPException(status_code=404, detail=f"Unsupported city: {city}")

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
    except requests.RequestException as error:
        raise HTTPException(
            status_code=502, detail=f"Open-Meteo request failed: {error}"
        ) from error
    except (ValueError, KeyError, IndexError, TypeError) as error:
        raise HTTPException(
            status_code=502, detail="Open-Meteo returned an invalid forecast"
        ) from error

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

    return {
        "today": make_day(forecast[today.isoformat()]),
        "tomorrow": make_day(forecast[tomorrow.isoformat()]),
    }


def make_day(hourly_points: list[dict[str, Any]]) -> dict[str, Any]:
    """Add daily averages and extremes for each hourly weather variable."""
    variables = {
        "temperature_c": "temperature_c",
        "precipitation_probability_percent": "precipitation_probability_percent",
        "precipitation_mm": "precipitation_mm",
    }
    summary = {}
    for name, field in variables.items():
        values = [point[field] for point in hourly_points if point[field] is not None]
        summary[name] = {
            "average": round(sum(values) / len(values), 2) if values else None,
            "max": max(values) if values else None,
            "min": min(values) if values else None,
        }
    return {"hourly": hourly_points, "summary": summary}


if __name__ == "__main__":
    uvicorn.run(app, host=HOST, port=PORT)
