# Weather App Frontend

A standalone, dependency-free browser frontend for the Weather API in
`../weather-api`. The dashboard shows today's hourly temperature forecast and
tomorrow's average for the API's supported cities.

## Test locally with Python's HTTP server

The API and frontend run in separate terminals. From the repository root,
start the API in the first terminal:

```sh
cd internal-tools/weather-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

In a second terminal, serve this frontend directory with Python's built-in
HTTP module:

```sh
cd internal-tools/weather-app-frontend
python -m http.server 8080
```

Open <http://127.0.0.1:8080/> in your browser. The API address is set in
`config.js`, which defaults to `http://127.0.0.1:8000`. Change it to the API's
origin when hosting the frontend elsewhere.

The frontend requests `GET /cities` to populate the city selector and
`GET /weather?city=<id>` to load each forecast. No build step or extra package
is required.
