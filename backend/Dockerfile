FROM node:buster

WORKDIR /app

COPY ./package.json ./
RUN npm cache clean --force
RUN npm install -g prisma


RUN npm i

COPY . .

EXPOSE 80
RUN chmod 0777 /app/tools/init.sh
ENTRYPOINT [ "sh", "/app/tools/init.sh" ]
CMD [ "" ]