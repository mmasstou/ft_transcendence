FROM node:buster

WORKDIR /app

COPY ./package.json ./


RUN npm i

COPY . .


ENTRYPOINT [ "sh", "tools/init.sh" ]
# ENTRYPOINT [ "npm run start:dev" ]
# CMD [ "npm run start:dev" ]