# Base image for building the app
FROM node:20-alpine AS builder

ARG GOOGLE_CLOUD_PROJECT
ENV GOOGLE_CLOUD_PROJECT=$GOOGLE_CLOUD_PROJECT



# Set working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci
# Copy Prisma files and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app's source code
COPY . .

# Build the Next.js app
RUN npm run build

# Base image for running the app
FROM node:20-alpine AS runner

# Set working directory inside the container
WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the Next.js default port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
