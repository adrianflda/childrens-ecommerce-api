# Children's e-commerce API
# NodeJS App written in Typescript, using Express and Mongoose, deployed via Docker


### Local machine setup
- install NodeJS on your local machine (https://nodejs.org/en/)
- install docker-compose on your machine (https://docs.docker.com/compose/install/)

### Local project setup
- clone or download this repo
- open terminal (powershell etc.) in the project folder
- create .env file with these keys:
```
API_VERSION=v1
NODE_ENV=development

MONGO_URL=mongodb://127.0.0.1:27017/ecommerce

JWT_KEY=ecommerce-secret-jwt-key
JWT_DURATION=30m

SESSION_KEY=session-secret
```
- run `npm install`
- if you get any tsc error you might need to install typescript globally (`npm i -g typescript`)
- run `docker-compose up`, this will create 2 containers mongo (port 27017), api (port 3000)

### Project details
- navigate to `localhost:3000/` for home
- navigate to POST `localhost:3000/api/v1/auth/login` for login user: admin; password: admin
- navigate to POST `localhost:3000/api/v1/auth/signup` for signup
- navigate to `localhost:3000/api/v1/user` for user update roles as admin
- navigate to `localhost:3000/api/v1/product` for product CRUD
- navigate to `localhost:3000/api/v1/saleOrder` for sale
- postman collection is at `./postman` folder
- Endpoint that returns search results by sending any of the product features, one or more (allow pagination based on 10 results). If no feature is sent, the result should be the paginated list of articles.
(GET `localhost:3000/api/v1/product/list`)
- Endpoint that returns only the number of search results by sending any of the product features.(GET `localhost:3000/api/v1/product/list`)
- Endpoint that allows you to "sell" an item. This functionality must remove one (1) item from stock. You cannot sell more than one (1) type of item at a time and you cannot sell more than one (1) item of the same type at a time.(POST `localhost:3000/api/v1/saleOrder`)
- Endpoint that allows you to show the list of sold items. (GET `localhost:3000/api/v1/saleOrder/sales`)
- Endpoint that allows you to show the total profit. (GET `localhost:3000/api/v1/saleOrder/sales`)
- Endpoint that allows you to show the items that are out of stock in the warehouse. (GET `localhost:3000/api/v1/product/list`)