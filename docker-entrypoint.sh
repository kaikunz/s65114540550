#!/bin/sh

npm run build

npx prisma migrate deploy

npm run create_admin

exec "$@"