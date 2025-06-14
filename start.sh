#! /bin/bash

docker compose down --rmi all --volumes --remove-orphans
docker volume prune -f && docker image prune -f && docker builder prune -f
docker compose up
