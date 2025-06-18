#! /bin/bash

docker compose down --rmi all --volumes --remove-orphans
docker container prune -f && docker volume prune -f && docker image prune -f && docker builder prune -f
docker compose --env-file client/.env up
