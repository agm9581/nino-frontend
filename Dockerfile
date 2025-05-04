# syntax = docker/dockerfile:1

# Adjust NODE_VERSION to 22
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Set the working directory for the app
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Step 1: Build stage (for building app and installing dependencies)
FROM base AS build

# Install necessary dependencies to build native modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    node-gyp \
    pkg-config \
    python3 \
    curl

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install node modules (including dev dependencies)
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Copy the entire application code to the container
COPY . .

# Build the Angular app (if it's an Angular project, you may want to use ng build)
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --omit=dev

# Step 2: Final stage for the application image (smaller image for production)
FROM base

# Install production dependencies (without dev dependencies)
COPY --from=build /app /app

# Expose the port your application runs on (you may adjust it if needed)
EXPOSE 3000

# Start the application (this assumes you have a start script in your package.json)
CMD [ "npm", "run", "start" ]
