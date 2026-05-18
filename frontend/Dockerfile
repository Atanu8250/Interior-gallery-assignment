# Multi-stage Dockerfile for Next.js frontend
# Stage 1 (Builder): Build the Next.js application
# Stage 2 (Runtime): Run the optimized Next.js app

# ============================================================================
# STAGE 1: BUILDER
# ============================================================================
# Use Node.js LTS as base image for building
FROM node:20-alpine AS builder

# Set working directory in the container
WORKDIR /app

# Copy package management files
# These are copied first to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies needed for Next.js build)
RUN npm ci

# Copy the entire Next.js project source code
COPY . .

# Build the Next.js application
# This generates:
# - .next/ folder (optimized production bundle)
# - public/ folder (static assets)
# - node_modules/ folder (already present)
RUN npm cache clean --force && npm run build

# ============================================================================
# STAGE 2: RUNTIME
# ============================================================================
# Use a smaller Node.js image for running the Next.js app
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json (needed by Next.js to identify dependencies)
COPY package.json package-lock.json* ./

# Install only production dependencies
# Next.js includes a lightweight server that only needs production packages
RUN npm ci --only=production

# Copy the built .next folder from the builder stage
# This contains the optimized production build
COPY --from=builder /app/.next ./.next

# Copy the public folder (static assets like images, fonts, etc.)
COPY --from=builder /app/public ./public

# Copy other necessary Next.js files
# next.config.ts: Next.js configuration
# tsconfig.json: TypeScript configuration (if TypeScript is used)
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/tsconfig.json ./

# Expose the port Next.js will run on
# By default, Next.js production server runs on port 3000
EXPOSE 3000

# Health check: Verify the frontend is running and responding
# Interval: check every 30 seconds
# Timeout: wait 10 seconds for response  
# Start period: wait 60 seconds before first check (Next.js takes time to optimize on first startup)
# Retries: consider unhealthy after 3 failed checks
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Set environment to production
# This tells Next.js and Node.js to optimize for production performance
ENV NODE_ENV=production

# Start the Next.js production server
# Binds to 0.0.0.0 so it's accessible from outside the container (within the Docker network)
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
