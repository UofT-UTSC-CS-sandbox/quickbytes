# Stage 1: Install dependencies and run tests
FROM node:22 AS test

# Set the working directory
WORKDIR /app

# Copy the local files to the working directory
COPY . /app

# Install dependencies
RUN npm install

# Run tests
RUN npm test

# Stage 2: Build the application
FROM node:22 AS build

# Set the working directory
WORKDIR /app

# Copy the local files to the working directory
COPY . /app

# Install dependencies (if not cached from the previous stage)
RUN npm install

# Build the frontend application
RUN npm run build

# Stage 3: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Define the command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]
