FROM node:18-slim

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies and rebuild sqlite3
RUN npm install
RUN npm rebuild sqlite3

# Copy backend source code
COPY backend/ .

# Build TypeScript
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"] 