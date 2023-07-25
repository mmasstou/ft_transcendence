#!/bin/bash


sleep 10
npx prisma migrate dev --name init 

# npx prisma generate
# npx ts-node script.ts

npm run start:dev

# tail -f

exec "$@"
