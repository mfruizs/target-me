# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm ci --omit=dev

# Copy the rest of the application code to the container
COPY . /usr/src/app

# Expose the port your application listens on
EXPOSE 3000

# Define the command to start your application
CMD ["node", "server.js"]