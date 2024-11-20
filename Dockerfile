# ------------------------
# Step 1: Build react app
# ------------------------

# Use node:latest as the builder image
FROM node:20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install app dependencies
COPY package.json .
COPY .env ./

RUN yarn

# Copy other project files and build
COPY . ./
RUN yarn build

# --------------------------------------
# Step 2: Set up nginx to serve the app
# --------------------------------------
# Use nginx:latest as the base image
FROM nginx:latest

# # Overwriting nginx config with our own config file
# RUN rm -rf /etc/nginx/conf.d/default.conf
# COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# # Copy over the build created in the Step 1
COPY --from=builder /app/dist /usr/share/nginx/html

# # Set the working directory
WORKDIR /usr/share/nginx/html

# Expose port 3000
EXPOSE 4000

# # Start nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]