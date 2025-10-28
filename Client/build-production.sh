#!/bin/bash

# Build script for PhotoPark Client
# This script sets the correct API base URL for production

echo "Building PhotoPark Client for production..."

# Set environment variable for production API
export VITE_API_BASE_URL=https://api.photoparkk.com/api

# Build the application
npm run build

echo "Build completed! The application is ready for deployment."
echo "API Base URL set to: $VITE_API_BASE_URL"
