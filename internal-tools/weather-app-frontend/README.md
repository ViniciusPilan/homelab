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

The API allows cross-origin browser requests. For a remotely hosted frontend,
set `?api=` to an API address reachable by the browser; the default
`127.0.0.1` address refers to the device running the browser.
