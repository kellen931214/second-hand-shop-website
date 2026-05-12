#!/bin/sh
set -e

cd /var/www/html

if [ ! -f .env ]; then
    cp .env.example .env
fi

if [ ! -f database/database.sqlite ]; then
    touch database/database.sqlite
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force --no-interaction
fi

php artisan migrate --force --no-interaction

if [ "${RUN_SEED:-false}" = "true" ]; then
    php artisan migrate --seed
fi

exec "$@"
