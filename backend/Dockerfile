FROM node:buster

WORKDIR /app

COPY ./package.json ./

RUN npm install -g prisma


RUN npm i

COPY . .


ENTRYPOINT [ "sh", "/app/tools/init.sh" ]
# ENTRYPOINT [ "npm run start:dev" ]
CMD [ "npx prisma studio" ]