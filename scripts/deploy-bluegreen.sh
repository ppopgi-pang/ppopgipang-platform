#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
UPSTREAM_FILE="$ROOT_DIR/docker/nginx/upstream.conf"
ACTIVE_FILE="$ROOT_DIR/deploy/active_backend"

mkdir -p "$ROOT_DIR/deploy"

if [[ -f "$ACTIVE_FILE" ]]; then
  ACTIVE=$(cat "$ACTIVE_FILE")
else
  ACTIVE="blue"
fi

if [[ "$ACTIVE" == "blue" ]]; then
  NEW="green"
else
  NEW="blue"
fi

echo "Active: $ACTIVE"
echo "Deploying: $NEW"

if [[ -n "${BACKEND_IMAGE:-}" ]]; then
  if [[ -z "${BACKEND_TAG:-}" ]]; then
    echo "BACKEND_TAG is required when BACKEND_IMAGE is set"
    exit 1
  fi

  docker pull "${BACKEND_IMAGE}:${BACKEND_TAG}"
  docker tag "${BACKEND_IMAGE}:${BACKEND_TAG}" "ppopgipang-backend:${NEW}"
else
  docker build -f "$ROOT_DIR/docker/backend.Dockerfile" -t "ppopgipang-backend:${NEW}" "$ROOT_DIR"
fi

docker compose -f "$COMPOSE_FILE" up -d --no-deps --force-recreate "backend-${NEW}"

READY=""
for _ in {1..30}; do
  if docker compose -f "$COMPOSE_FILE" exec -T "backend-${NEW}" node -e "const net=require('net');const s=net.createConnection(3000);s.on('connect',()=>process.exit(0));s.on('error',()=>process.exit(1));"; then
    READY="yes"
    break
  fi
  sleep 2
done

if [[ "$READY" != "yes" ]]; then
  echo "backend-${NEW} did not become ready"
  exit 1
fi

cat > "$UPSTREAM_FILE" <<EOF2
upstream backend {
  server backend-${NEW}:3000;
}
EOF2

docker compose -f "$COMPOSE_FILE" exec -T nginx nginx -s reload

echo "$NEW" > "$ACTIVE_FILE"

docker compose -f "$COMPOSE_FILE" stop "backend-${ACTIVE}"

echo "Switched to: $NEW"
