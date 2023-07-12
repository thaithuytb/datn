FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
COPY prisma ./prisma/
COPY tsconfig.build.json ./
COPY tsconfig.json ./
RUN yarn add dotenv
RUN yarn install
COPY . .
RUN yarn build

FROM node:18-alpine
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json /app/yarn.lock ./
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/.env ./.env
EXPOSE 7000
RUN yarn prisma:generate
CMD ["yarn", "start:migrate:prod"]
