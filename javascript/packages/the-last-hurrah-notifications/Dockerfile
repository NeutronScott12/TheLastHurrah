FROM node:16-alpine3.11 as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY ./dist .
COPY .env.production .
COPY /environment/.env .
COPY ./prisma .

RUN yarn install --production
RUN yarn prisma generate

RUN npm prune --production

# FROM node:16-alpine3.11

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# COPY .env.production .
# COPY /environment/.env .

# COPY --from=builder /usr/src/app/dist .
# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 50054:50054

CMD [ "node", "main.js" ]
