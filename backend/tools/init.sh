#!/bin/bash

npx prisma generate --schema=../prisma/schema.prisma

npx prisma migrate dev --name init

sleep 5

npx ts-node script.ts

npm run start:dev

# tail -f

exec "$@"
