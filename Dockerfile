# Stage 1: Build the application
FROM node:20-bullseye-slim AS builder

WORKDIR /app
RUN apk add --no-cache git && git pull || true


# Copy only the package.json and yarn.lock first to leverage Docker's cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Copy the rest of the application
COPY . ./

# Build the application
RUN yarn build

# Stage 2: Set up Nginx
FROM nginx:1.27.2-alpine-slim

# Copy the Nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Set working directory in the final image
WORKDIR /usr/share/nginx/html

# Expose port 4000
EXPOSE 4000

# Run Nginx in the foreground
CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]
