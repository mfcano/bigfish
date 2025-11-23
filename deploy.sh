#!/bin/bash
set -e

echo "🚀 Starting deployment process..."

# Build Client
echo "📦 Building Client..."
cd client

# Install dependencies if missing or forced
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
else 
    echo "ℹ️  Dependencies found. Running install to ensure they are up to date..."
    npm install
fi

echo "🛠️  Building project..."
npm run build
cd ..

# Prepare Server for Firebase Functions Deployment
# Firebase CLI *strictly requires* a virtual environment for Python functions.
# We will create a temporary one just for deployment purposes.
echo "🐍 Preparing Python Virtual Environment for Deployment..."
cd server
if [ ! -d "venv" ]; then
    echo "   Creating temporary venv..."
    python3 -m venv venv
fi

# We must install requirements into this venv for Firebase to be happy locally
echo "   Installing requirements into deployment venv..."
source venv/bin/activate
pip install -r requirements.txt
deactivate
cd ..

# Deploy to Firebase (Hosting + Functions)
echo "🔥 Deploying to Firebase..."
# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "firebase-tools could not be found. Please install it with 'npm install -g firebase-tools'"
    exit 1
fi

# Deploy Hosting, Firestore, AND Functions
firebase deploy

# Optional: Cleanup venv if you really don't want it lingering (commented out for speed on re-deploy)
# rm -rf server/venv

echo "✅ Deployment complete!"
