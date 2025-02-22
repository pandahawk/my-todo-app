# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS app for production
RUN npm run build

# Expose the port that your app listens on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:prod"]