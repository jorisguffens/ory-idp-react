FROM node:14-alpine as node

WORKDIR /tmp/node

COPY package.json ./

RUN npm install

COPY config-overrides/ ./config-overrides
COPY public/ ./public
COPY src/ ./src

ARG BYTEBIN

ENV REACT_APP_BYTEBIN=$BYTEBIN

RUN npm run build

FROM httpd:alpine

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

RUN { \
  echo 'IncludeOptional conf.d/*.conf'; \
} >> /usr/local/apache2/conf/httpd.conf \
  && mkdir /usr/local/apache2/conf.d

COPY vhost.conf /usr/local/apache2/conf.d/vhost.conf

WORKDIR /var/www

COPY --from=node /tmp/node/build ./
