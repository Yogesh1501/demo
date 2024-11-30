# Use the official lightweight Node.js image
FROM node:20.17.0

# Set the working directory
WORKDIR /Frontend/myapp

# Copy package.json and install dependencies
COPY Frontend/myapp/package*.json ./
RUN npm install

# Copy the rest of the application files
COPY Frontend/myapp/ .

# Build the app for production
RUN npm run build

# Expose the port for the app
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
