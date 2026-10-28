# Weather app frontend

Static HTML, CSS, and JavaScript frontend for `internal-tools/weather-api`.

## Run locally

Start the API using the instructions in `../weather-api/README.md`, then serve
this directory with any static file server. For example:

```sh
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080`. The frontend requests
`http://127.0.0.1:8000/{city}` by default. To use a different API base URL,
append `?api=https://weather-api.example.com` to the frontend URL.

## Run in an Nginx container

Build and start the frontend from this directory:

```sh
docker build -t weather-app-frontend .
docker run --rm -p 8080:80 \
  -e API_HOST=127.0.0.1 \
  -e API_PORT=8000 \
  weather-app-frontend
```

Open `http://127.0.0.1:8080`. To connect to an API at a different address,
set `API_HOST` and `API_PORT` when starting the container. `API_HOST` must be
an address the user's browser can reach. The default is `127.0.0.1:8000`. You
can also override the container settings per page by appending a browser-
reachable URL as the `api` query parameter, for example:
`http://127.0.0.1:8080/?api=https://weather-api.example.com`.

The API allows cross-origin browser requests. For a remotely hosted frontend,
set `?api=` to an API address reachable by the browser; the default
`127.0.0.1` address refers to the device running the browser.
