# Use the official Node.js 20 image
FROM node:21:alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN chown -R node:node /usr/src/app/node_modules

COPY . .
EXPOSE 3002

# Command to run the application
CMD ["npm", "run", "start:prod"]
