FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN npx prisma generate

EXPOSE 7000

CMD ["yarn","start:dev"]



