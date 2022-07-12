FROM node:16-alpine3.11

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./dist .
COPY .env.production .
COPY ./environment/.env .
COPY ./prisma .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 50050:50050

RUN yarn install --only=production
RUN yarn prisma generate

CMD [ "node", "src/main.js" ]
