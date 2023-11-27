# Use a Node.js base image
FROM node:14.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Vue.js application
# RUN npm run build

# Expose the port that the Vue.js app runs on
EXPOSE 8080

# Run the Vue.js application
CMD [ "npm", "run", "serve" ]
