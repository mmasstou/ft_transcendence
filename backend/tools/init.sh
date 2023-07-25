#!/bin/bash


sleep 12
echo "  ++> Waiting for postgres..."
npx prisma migrate dev --name init 
echo "  ++> PostgreSQL started"
# npx prisma generate
# npx ts-node script.ts



# tail -f

exec "$@"
