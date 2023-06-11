FROM node:buster

WORKDIR /backend

COPY ./package.json ./


RUN npm i

COPY . ./


ENTRYPOINT [ "sh", "tools/init.sh" ]

CMD [ "npm", "run dev" ]