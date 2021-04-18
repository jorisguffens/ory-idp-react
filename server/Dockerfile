FROM composer as vendor

WORKDIR /tmp/composer

COPY composer.json ./

RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

FROM php:7.2-apache

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && sync
RUN install-php-extensions pdo_mysql intl redis zip

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
 && sed -E -i -e 's/max_execution_time = 30/max_execution_time = 120/' $PHP_INI_DIR/php.ini \
 && sed -E -i -e 's/memory_limit = 128M/memory_limit = 512M/' $PHP_INI_DIR/php.ini \
 && sed -E -i -e 's/post_max_size = 8M/post_max_size = 50M/' $PHP_INI_DIR/php.ini \
 && sed -E -i -e 's/upload_max_filesize = 2M/upload_max_filesize = 50M/' $PHP_INI_DIR/php.ini \
 && sed -E -i -e 's/variables_order = "GPCS"/variables_order = "GPCES"/' $PHP_INI_DIR/php.ini

WORKDIR /var/www

# backend
COPY app/ ./app
COPY config/ ./config
COPY public/ ./public

COPY --from=vendor /tmp/composer/vendor/ ./vendor

# apache
RUN a2enmod rewrite remoteip
COPY vhost.conf /etc/apache2/sites-available/000-default.conf
COPY remoteip.conf /etc/apache2/conf-available/remoteip.conf
