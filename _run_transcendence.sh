#!/bin/bash

# This script is used to run transcendence on a given input file.

echo "Starting transcendence..."
docker compose up --build -d
echo "Waiting for the database to start..."
cd ~/Desktop/Projects/ft_transcendence/front && npm run dev
