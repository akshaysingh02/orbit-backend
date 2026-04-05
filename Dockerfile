FROM node:24-alpine

WORKDIR /orbit-backend

COPY package.json .

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD [ "node","server.js" ]