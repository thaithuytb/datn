FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn add dotenv
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.15.2-alpine
COPY --from=builder /app/build /var/www
COPY --from=builder /app/nginx/default.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
