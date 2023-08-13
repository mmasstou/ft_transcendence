FROM node:buster

WORKDIR /frontend

RUN npm install -g next
COPY ./package*.json .


RUN npm i

COPY . .

# Expose the port on which your Next.js application listens
EXPOSE 8080

ENTRYPOINT [ "sh" , "/frontend/tools/init.sh" ]
# Start the Next.js application in dev mode
CMD ["npm", "run", "dev"]