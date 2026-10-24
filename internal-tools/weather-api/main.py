"""Small JSON API for today's hourly and tomorrow's daily weather."""

from datetime import date
import unicodedata

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
CITY_PRESETS = {
    "sao-manuel": {
        "name": "Sao Manuel",
        "state": "SP",
        "latitude": -22.73111,
        "longitude": -48.57056,
    },
    "barretos": {
        "name": "Barretos",
        "state": "SP",
        "latitude": -20.55722,
        "longitude": -48.56778,
    },
    "botucatu": {
        "name": "Botucatu",
        "state": "SP",
        "latitude": -22.88583,
        "longitude": -48.445,
    },
}

app = FastAPI(title="Weather API", description="Temperature and precipitation forecasts from Open-Meteo")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def normalize_city(city: str) -> str:
    """Normalize city names and slugs, accepting an optional -SP suffix."""
    normalized = unicodedata.normalize("NFKD", city.strip().casefold())
    normalized = normalized.encode("ascii", "ignore").decode("ascii")
    normalized = "-".join(normalized.replace(",", " ").split())
    return normalized.removesuffix("-sp")


@app.get("/cities")
async def get_cities() -> dict:
    """List the cities available by name in the weather endpoint."""
    return {
        "cities": [
            {"id": city_id, **city}
            for city_id, city in CITY_PRESETS.items()
        ]
    }


@app.get("/weather")
async def get_weather(
    city: str | None = None,
    latitude: float | None = Query(default=None, ge=-90, le=90),
    longitude: float | None = Query(default=None, ge=-180, le=180),
    timezone: str = "auto",
) -> dict:
    """Return today's hourly forecast and tomorrow's daily summary by city or coordinates."""
    city_name = None
    if city is not None:
        if latitude is not None or longitude is not None:
            raise HTTPException(status_code=400, detail="Use either city or coordinates, not both")
        city_id = normalize_city(city)
        preset = CITY_PRESETS.get(city_id)
        if preset is None:
            available = ", ".join(CITY_PRESETS)
            raise HTTPException(
                status_code=404,
                detail=f"Unknown city. Available city ids: {available}",
            )
        latitude = preset["latitude"]
        longitude = preset["longitude"]
        city_name = f"{preset['name']}, {preset['state']}"
    elif latitude is None or longitude is None:
        raise HTTPException(
            status_code=400,
            detail="Provide a city name or both latitude and longitude",
        )

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": "temperature_2m,precipitation_probability,precipitation",
        "daily": "temperature_2m_mean,precipitation_probability_max,precipitation_sum",
        "forecast_days": 2,
        "timezone": timezone,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            forecast = response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail="Could not retrieve forecast from Open-Meteo") from exc

    try:
        today = date.fromisoformat(forecast["daily"]["time"][0])
        tomorrow = date.fromisoformat(forecast["daily"]["time"][1])
        hourly_times = forecast["hourly"]["time"]
        hourly_temperatures = forecast["hourly"]["temperature_2m"]
        hourly_rain_probabilities = forecast["hourly"]["precipitation_probability"]
        hourly_precipitation = forecast["hourly"]["precipitation"]
        tomorrow_mean = forecast["daily"]["temperature_2m_mean"][1]
        tomorrow_rain_probability = forecast["daily"]["precipitation_probability_max"][1]
        tomorrow_precipitation = forecast["daily"]["precipitation_sum"][1]
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Open-Meteo returned an incomplete forecast") from exc

    hourly = []
    for time, temperature, rain_probability, precipitation in zip(
        hourly_times,
        hourly_temperatures,
        hourly_rain_probabilities,
        hourly_precipitation,
    ):
        if time.startswith(today.isoformat()):
            hourly.append({
                "time": time,
                "temperature_c": temperature,
                "precipitation_probability_percent": rain_probability,
                "precipitation_mm": precipitation,
            })

    result = {
        "latitude": forecast.get("latitude", latitude),
        "longitude": forecast.get("longitude", longitude),
        "timezone": forecast.get("timezone", timezone),
        "temperature_unit": forecast.get("hourly_units", {}).get("temperature_2m", "°C"),
        "precipitation_unit": forecast.get("hourly_units", {}).get("precipitation", "mm"),
        "today": {"date": today.isoformat(), "hourly": hourly},
        "tomorrow": {
            "date": tomorrow.isoformat(),
            "average_temperature": tomorrow_mean,
            "maximum_precipitation_probability_percent": tomorrow_rain_probability,
            "precipitation_sum_mm": tomorrow_precipitation,
        },
    }
    if city_name is not None:
        result["city"] = city_name
    return result
