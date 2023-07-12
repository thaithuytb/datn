FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn run build	

RUN npx prisma generate

RUN npx prisma:init

EXPOSE 7000

CMD [ "yarn", "run", "start:prod" ]



