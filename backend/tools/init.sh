#!/bin/bash

sleep 5

npx prisma migrate dev --name init


npx prisma generate --schema=../prisma/schema.prisma

sleep 5

# npx ts-node script.ts

npm run start:dev

# tail -f

exec "$@"
