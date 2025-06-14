# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variable
ENV NODE_ENV production

# Run the Next.js application
CMD ["node", "server.js"]
