FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY . ./
RUN yarn && yarn build


FROM nginx:1.27.2-alpine-slim

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 4000

CMD ["/bin/sh", "-c", "nginx -g \"daemon off;\""]