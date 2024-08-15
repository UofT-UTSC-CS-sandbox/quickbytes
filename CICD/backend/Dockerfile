# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy the local files to the working directory
COPY . /app

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Define the command to run the backend application
CMD ["node", "server.js"]
