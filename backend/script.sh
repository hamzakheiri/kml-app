#!/bin/bash

# Check if node_modules directory exists
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing dependencies..."
  npm install
else
  echo "node_modules already exists. Skipping installation."
fi

chmod 777 -R /app

# Run the React app
echo "Starting the React app..."
npm run start:dev
