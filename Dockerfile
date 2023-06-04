# Stage 1: Build the app and run tests
FROM node:18.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]