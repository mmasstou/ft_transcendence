#!/bin/bash

npx prisma migrate dev --name init

npx ts-node script.ts

npm run start:dev

exec "$@"

