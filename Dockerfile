FROM node:18-slim

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ .

# Build TypeScript
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"] 