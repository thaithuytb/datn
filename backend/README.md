### Setup phần backend
### Các yêu cầu cơ bản:
```
node, docker-compose, yarn.
```
1. git clone https://github.com/thaithuytb/datn
```
$ cd backend
```
2. Tải các phụ thuộc
``` 
$ yarn 
```
3. Tạo file env - (Cấu hình mẫu)
```
NODE_ENV=development
PORT=7000
MYSQL_DATABASE=datn
MYSQL_USER=user
MYSQL_PASSWORD=root
MYSQL_ROOT_PASSWORD=root
DB_PORT=6999
DATABASE_URL="mysql://root:root@localhost:6999/datn?connection_limit=10&pool_timeout=0&charset=utf8mb4_general_ci&characterSet=utf8mb4"
MQTT_URL=mqtt://broker.hivemq.com:1883
JWT_SECRET=haithai
CACHE_PORT=6998
REDIS_HOST=localhost
```
4. Chạy docker - (để tạo nơi lưu trữ database - mysql)
```
$ docker compose up -d --build
```
5. Khởi tạo database
```
$ yarn prisma:migrate:dev
$ yarn prisma:db:pull
$ yarn prisma:init
```
