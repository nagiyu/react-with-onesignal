#! /bin/bash

docker compose down --rmi all --volumes --remove-orphans

rm -Rf client/.next
rm -Rf client/node_modules
rm client/public/sw.js
rm client/public/sw.js.map
rm client/public/worker-*.js
rm client/public/worker-*.js.map
rm client/public/workbox-*.js
rm client/public/workbox-*.js.map

docker container prune -f && docker volume prune -f && docker image prune -f && docker builder prune -f
docker compose --env-file client/.env up
