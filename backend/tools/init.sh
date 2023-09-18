#!/bin/bash

sleep 5

npx prisma db push


npx prisma pull --schema=../prisma/schema.prisma

sleep 5

# npx ts-node script.ts

npm run start:dev

# tail -f

exec "$@"