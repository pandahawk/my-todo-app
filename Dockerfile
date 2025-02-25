# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the entrypoint script FIRST and
#  build the NestJS app for production
RUN chmod +x /app/entrypoint.sh \
&& npm run build

# Expose the port that your app listens on
EXPOSE 3000

RUN apk add --no-cache bash

ENTRYPOINT ["/app/entrypoint.sh"] 

# # Run the app
# CMD ["npm", "run", "start:prod"]


