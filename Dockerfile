FROM node:lts-alpine as builder
# env set

WORKDIR /tmp/

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org
 
RUN npm run build
 
FROM nginx:alpine

COPY --from=remove_exif /tmp/dist/anshan-li-front/ /var/www/

RUN rm -rf /etc/nginx/conf.d/*

COPY --from=build /app/misc/app.conf /etc/nginx/conf.d/app.conf
