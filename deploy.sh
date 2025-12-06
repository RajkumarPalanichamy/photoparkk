#!/bin/bash

# PhotoParkk Deployment Script
# This script deploys both frontend and backend on VPS

set -e  # Exit on error

BASE_DIR="/var/www/photoparkk"
CLIENT_DIR="$BASE_DIR/Client"
SERVER_DIR="$BASE_DIR/Server"

echo "🚀 Starting PhotoParkk deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if directories exist
if [ ! -d "$CLIENT_DIR" ]; then
    print_error "Client directory not found: $CLIENT_DIR"
    exit 1
fi

if [ ! -d "$SERVER_DIR" ]; then
    print_error "Server directory not found: $SERVER_DIR"
    exit 1
fi

# ============================================
# FRONTEND DEPLOYMENT
# ============================================
echo "📦 Deploying Frontend..."
cd "$CLIENT_DIR"

# Install dependencies
print_warning "Installing frontend dependencies..."
npm install

# Clean previous build
print_warning "Cleaning previous build..."
rm -rf dist node_modules/.vite

# Build for production
print_warning "Building frontend for production..."
export VITE_API_BASE_URL=https://api.photoparkk.com/api
npm run build

if [ -d "dist" ]; then
    print_success "Frontend build completed successfully!"
else
    print_error "Frontend build failed - dist directory not found"
    exit 1
fi

echo ""

# ============================================
# BACKEND DEPLOYMENT
# ============================================
echo "🔄 Deploying Backend..."
cd "$SERVER_DIR"

# Install dependencies
print_warning "Installing backend dependencies..."
npm install

# Restart PM2 process
print_warning "Restarting backend server..."

# Try to restart existing PM2 process
if pm2 list | grep -q "photoparkk-server"; then
    pm2 restart photoparkk-server
    print_success "Backend server restarted via PM2"
elif pm2 list | grep -q "server.js"; then
    # Find the process name
    PM2_NAME=$(pm2 list | grep "server.js" | awk '{print $4}' | head -1)
    pm2 restart "$PM2_NAME"
    print_success "Backend server restarted via PM2"
else
    # Start new PM2 process
    print_warning "No existing PM2 process found. Starting new one..."
    pm2 start server.js --name photoparkk-server
    pm2 save
    print_success "Backend server started via PM2"
fi

# Show PM2 status
echo ""
pm2 status

echo ""

# ============================================
# NGINX RESTART
# ============================================
echo "🌐 Restarting Nginx..."

# Test Nginx configuration first
if sudo nginx -t 2>/dev/null; then
    sudo systemctl restart nginx
    print_success "Nginx restarted successfully"
else
    print_error "Nginx configuration test failed!"
    echo "Run 'sudo nginx -t' to see the error"
fi

echo ""
echo "============================================"
print_success "🎉 Deployment completed successfully!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Check PM2 logs: pm2 logs photoparkk-server"
echo "2. Check Nginx status: sudo systemctl status nginx"
echo "3. Test your website in a browser"

