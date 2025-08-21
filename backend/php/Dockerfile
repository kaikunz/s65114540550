FROM php:8.1-fpm

COPY php.ini /usr/local/etc/php/php.ini

RUN docker-php-ext-install pdo pdo_mysql
RUN apt-get update && apt-get install -y curl && apt-get install -y supervisor && apt-get install -y ffmpeg

COPY supervisor.conf /etc/supervisor/conf.d/worker.conf

COPY . /var/www/html

CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
