FROM node:buster

WORKDIR /frontend

RUN npm install -g next
COPY ./package.json /frontend


RUN npm i

COPY . /frontend

# Expose the port on which your Next.js application listens
EXPOSE 3000

# Start the Next.js application in dev mode
CMD ["npm", "run", "dev"]