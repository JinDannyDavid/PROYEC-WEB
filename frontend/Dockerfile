# ===========================================
# JASS Palian Frontend - Multi-stage Dockerfile
# ===========================================

# -------------------------------------------
# STAGE 1: Base / Dependencies
# -------------------------------------------
FROM node:20-alpine AS base

# Set environment variables
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    npm_config_cache=/tmp/.npm

# Install system dependencies for native modules
RUN apk add --no-cache \
    libc6-compat \
    curl \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Set work directory
WORKDIR /app

# -------------------------------------------
# STAGE 2: Dependencies
# -------------------------------------------
FROM base AS deps

# Copy package files
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm ci --prefer-offline --no-audit --no-fund && \
    npm cache clean --force


# -------------------------------------------
# STAGE 3: Builder
# -------------------------------------------
FROM deps AS builder

# Copy source code
COPY . .

# Build the application
RUN npm run build


# -------------------------------------------
# STAGE 4: Production Runner
# -------------------------------------------
FROM base AS production

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Create necessary directories
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next/cache

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -q --spider http://localhost:3000 || exit 1

# Start the application
CMD ["node", "server.js"]


# -------------------------------------------
# STAGE 5: Development
# -------------------------------------------
FROM base AS development

# Set development environment
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy source code
COPY . .

# Change ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]