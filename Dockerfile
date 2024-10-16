# Use the official Node.js image as the base image
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# # Use a lightweight web server to serve the static files
# FROM nginx:alpine

# # Copy the build output to Nginx's public folder
# COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 3000

# Install the serve dependencies
RUN npm install -g serve

# Start a simple web server to serve the built React.js files on port 3001
CMD ["serve", "-s", "build"]
# Command to run Nginx
# CMD ["nginx", "-g", "daemon off;"]
