FROM nginx:alpine

ENV API_HOST=127.0.0.1 \
    API_PORT=8000

COPY index.html styles.css app.js config.js.template /usr/share/nginx/html/

CMD ["/bin/sh", "-c", "envsubst '${API_HOST} ${API_PORT}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js && exec nginx -g 'daemon off;'"]

EXPOSE 80
