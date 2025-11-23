# Stage 1: Build Frontend
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package.json ./
# Remove package-lock.json if it was copied (though we only copied package.json above to be safe)
# We purposely don't copy package-lock.json to avoid cross-platform optional dependency issues (rollup)
RUN npm install
COPY client/ ./
# Set VITE_API_BASE to empty string so requests are relative (e.g. /mvps)
ENV VITE_API_BASE=""
RUN npm run build

# Stage 2: Final Image
FROM python:3.11-slim
WORKDIR /app

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
COPY server/ /app/server/

# Copy Nginx Configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Built Frontend Assets
COPY --from=client-build /app/client/dist /usr/share/nginx/html

# Create Start Script
# We dynamically find the firebase credentials file if it exists
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'export SERVICE_ACCOUNT_FILE=$(find /app/server -name "*firebase-adminsdk*.json" | head -n 1)' >> /app/start.sh && \
    echo 'if [ -z "$SERVICE_ACCOUNT_FILE" ]; then' >> /app/start.sh && \
    echo '  echo "Warning: No firebase credentials found. Backend may fail to initialize if not on GCP."' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '  echo "Found credentials: $SERVICE_ACCOUNT_FILE"' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Starting Backend (Functions Framework)..."' >> /app/start.sh && \
    echo 'functions-framework --target=api --source=server/main.py --port=8000 &' >> /app/start.sh && \
    echo 'echo "Starting Nginx..."' >> /app/start.sh && \
    echo 'nginx -g "daemon off;"' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port 8080 (Google Cloud Run default)
EXPOSE 8080

CMD ["/app/start.sh"]

