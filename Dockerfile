FROM nginx:stable-alpine3.17-slim

### set timezome
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./public /usr/share/nginx/html
COPY ./docker-script/site.conf /etc/nginx/conf.d/site.conf
