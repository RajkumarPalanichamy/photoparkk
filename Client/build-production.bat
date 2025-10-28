@echo off
REM Build script for PhotoPark Client (Windows)
REM This script sets the correct API base URL for production

echo Building PhotoPark Client for production...

REM Set environment variable for production API
set VITE_API_BASE_URL=https://api.photoparkk.com/api

REM Build the application
npm run build

echo Build completed! The application is ready for deployment.
echo API Base URL set to: %VITE_API_BASE_URL%
pause
