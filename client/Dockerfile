# Build stage
FROM node:20-alpine AS builder

# .envの内容をARGとして追加
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ARG VAPID_CONTACT_EMAIL
ARG VAPID_PRIVATE_KEY
ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

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

# ARGを再定義
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY
ARG VAPID_CONTACT_EMAIL
ARG VAPID_PRIVATE_KEY
ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

# ARGからENVへ
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY}
ENV VAPID_CONTACT_EMAIL=${VAPID_CONTACT_EMAIL}
ENV VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}
ENV AWS_REGION=${AWS_REGION}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

ENV AWS_LWA_PORT=3000

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
