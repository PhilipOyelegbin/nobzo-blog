#! /bin/bash

set -e

docker compose up -d

cd backend
pnpm run dev