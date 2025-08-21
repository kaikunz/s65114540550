FROM node:22

WORKDIR /chickeam


COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]

COPY --chmod=755 ./docker-entrypoint.sh /docker-entrypoint.sh


ENTRYPOINT ["/docker-entrypoint.sh"]
