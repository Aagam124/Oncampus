#!/usr/bin/env bash
set -e

echo "Building frontend client..."
cd client
npm install --include=dev
npm run build
cd ..

echo "Installing server dependencies..."
cd server
npm install --include=dev
cd ..

echo "Build completed successfully!"
