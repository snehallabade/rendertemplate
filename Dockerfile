# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build:client && npm run build:server

# Create necessary directories and verify the build output
RUN mkdir -p /app/dist/public && \
    mkdir -p /app/public && \
    echo "=== Client Build Output (dist/public/) ===" && \
    ls -la dist/public && \
    echo "=== Server Build Output (dist/server/) ===" && \
    ls -la dist/server && \
    echo "=== Build Verification ===" && \
    if [ -f dist/public/index.html ]; then echo "✓ Client build found"; else echo "✗ Client build missing" && exit 1; fi && \
    if [ -f dist/server/index.mjs ]; then echo "✓ Server build found"; else echo "✗ Server build missing" && exit 1; fi

# Stage 2: Production environment
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV RENDER=true
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV DIRECT_URL=${DIRECT_URL}
ENV SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
