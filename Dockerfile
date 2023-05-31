FROM node:18.16.0

RUN apt-get update

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

RUN npm run test
