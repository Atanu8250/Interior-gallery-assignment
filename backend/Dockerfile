# Multi-stage Dockerfile for backend
# Stage 1 (Builder): Compile TypeScript to JavaScript
# Stage 2 (Runtime): Run the compiled app with minimal dependencies

# ============================================================================
# STAGE 1: BUILDER
# ============================================================================
# Use Node.js LTS (long-term support) as the base image for building
FROM node:20-alpine AS builder

# Set working directory inside the container
# All subsequent commands run inside this directory (/app)
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
# This layer is cached and only rebuilt if package files change
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies needed for TypeScript compilation)
# Using npm ci (clean install) instead of npm install for reproducible builds in Docker
RUN npm ci

# Copy the entire source code into the container
# This happens after dependencies because source code changes more often
COPY . .

# Compile TypeScript to JavaScript
# Creates a 'dist' folder with compiled .js files
RUN npm run build

# ============================================================================
# STAGE 2: RUNTIME
# ============================================================================
# Use a smaller Node.js image for running the app
# We only need the runtime, not the build tools
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json from builder stage (needed to identify entry point and dependencies)
COPY package.json package-lock.json* ./

# Install only production dependencies (excludes devDependencies like ts-node, typescript)
# This keeps the final image size small
RUN npm ci --only=production

# Copy the compiled code from builder stage
# The source TypeScript files are NOT included, only the dist/ folder
COPY --from=builder /app/dist ./dist

# Copy seed directory (seed script needs to be available)
COPY --from=builder /app/dist/seed ./src/seed

# Expose the port that the backend runs on (default 5000)
# This tells Docker that the container listens on this port
# Format: PORT_NUMBER/PROTOCOL
EXPOSE 5000

# Health check: Test if the backend is running and responding
# This helps Docker and docker-compose know if the container is healthy
# Interval: check every 30 seconds
# Timeout: wait 10 seconds for response
# Start period: wait 40 seconds before first check (give app time to start)
# Retries: consider unhealthy after 3 failed checks
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Set environment to production (this tells Express/Node to optimize for production)
ENV NODE_ENV=production

# Define the default command to run when the container starts
# This will execute: node dist/server.js
CMD ["node", "dist/server.js"]
