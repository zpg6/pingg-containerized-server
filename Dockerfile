FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=9000 \
    REDIS_URL=redis

EXPOSE 9000

CMD ["npm","start"]

