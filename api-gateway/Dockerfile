# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the application will run on
# EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:dev"]