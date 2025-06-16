#! /bin/bash

docker compose down --rmi all --volumes --remove-orphans

rm -rf client/.next
rm client/public/sw.js
rm client/public/sw.js.map
rm client/public/workbox-*.js
rm client/public/workbox-*.js.map

docker container prune -f && docker volume prune -f && docker image prune -f && docker builder prune -f
docker compose up
