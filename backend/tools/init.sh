#!/bin/bash

npx prisma generate --schema=../prisma/schema.prisma

npx prisma migrate dev --name init


npx ts-node script.ts

npm run start:dev

exec "$@"

