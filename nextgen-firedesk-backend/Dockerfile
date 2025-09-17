# ================================
# Backend Dockerfile
# ================================

# 1. Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy source code and build (ignore build errors if no build script)
COPY . .
RUN npm run build || true

# 2. Runtime stage
FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# install curl
RUN apk add --no-cache curl

# Copy package files and install production deps only
COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --production

# Copy rest of built source code from builder stage
COPY --from=builder /usr/src/app ./

# Expose backend port
EXPOSE 5000

# Run app via package.json "start" script (runs `node server.js`)
CMD ["npm", "start"]
