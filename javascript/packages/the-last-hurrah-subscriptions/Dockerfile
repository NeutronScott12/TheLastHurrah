FROM node:16-alpine3.11

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./dist .
COPY .env.production .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN yarn install --only=production

CMD node main.js
