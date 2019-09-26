FROM node:10 AS builder

WORKDIR /builder
COPY . .

RUN npm install && \
    tsc && cp package.json build/


FROM node:10-slim

WORKDIR /app
COPY --from=builder --chown=node:node /builder/build .

RUN chown node:node /app

USER node

CMD ["node", "/app/http-server.js"]