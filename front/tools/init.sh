#!/bin/bash

sleep 5
npm run build
sleep 5
npm run start

exec "$@"


