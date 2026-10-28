# Weather app frontend

Static HTML, CSS, and JavaScript frontend for `internal-tools/weather/api`.
When run with the provided Compose file, the browser requests the same-origin
`/api/{city}` path and Nginx forwards it to the `api` service over the Docker
network. This keeps the backend container address out of browser requests.

## Run locally

Start the full stack from `internal-tools/weather`:

```sh
docker compose up --build
```

Open `http://127.0.0.1:8081`. The API remains available directly on
`http://127.0.0.1:8000` for local debugging. The frontend accepts an optional
browser-reachable API base URL using `?api=https://weather-api.example.com`.

To serve the frontend separately from Compose, configure the web server to
proxy `/api/` to the API service, or pass a browser-reachable API URL in the
`api` query parameter. A Docker-only hostname such as `api` cannot be resolved
by a visitor's browser.
