#!/bin/bash


sleep 5
npx prisma migrate dev --name init --skip-generate

npx prisma generate
npx ts-node script.ts

exec "$@"

