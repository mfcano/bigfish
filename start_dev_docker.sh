#!/bin/bash
set -e

echo "🐳 Building Docker Image..."
docker build -t bigfish-app .

echo "🚀 Starting Container on http://localhost:8080"
echo "🔴 Press Ctrl+C to stop."

# Run container
# --rm: Remove container when it exits
# -p 8080:8080: Map port 8080
# --name bigfish-container: Name it
# -t: Allocate pseudo-TTY (nice for logs)
docker run --rm -p 8080:8080 --name bigfish-container -t bigfish-app

