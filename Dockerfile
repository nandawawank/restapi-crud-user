FROM node:14 as base
WORKDIR /usr/src/restapi-crud-user
COPY package*.json ./
RUN npm install

FROM node:14-alpine
WORKDIR /usr/src/restapi-crud-user

COPY --from=base /usr/src/restapi-crud-user ./
COPY . .

EXPOSE 3001

CMD npm start