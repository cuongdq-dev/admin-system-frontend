# Sử dụng node:20-bullseye-slim làm base image cho builder
FROM node:20-bullseye-slim AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép mã nguồn vào container
COPY . ./

# Cài đặt pnpm và cài đặt dependencies
RUN npm install -g pnpm && pnpm install

# Xây dựng ứng dụng
RUN pnpm build


# Sử dụng NGINX để phục vụ ứng dụng
FROM nginx:1.27.2-alpine-slim

# Sao chép cấu hình NGINX
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Sao chép build từ container builder vào thư mục của NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Thiết lập thư mục làm việc của NGINX
WORKDIR /usr/share/nginx/html

# Mở cổng 4000 để phục vụ ứng dụng
EXPOSE 4000

# Khởi động NGINX trong chế độ không daemon
CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]
