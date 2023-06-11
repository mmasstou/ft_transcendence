FROM node:buster

WORKDIR /frontend

COPY ./package.json ./


RUN npm i

COPY . ./

# Expose the port on which your Next.js application listens
EXPOSE 3000

# Start the Next.js application in dev mode
CMD ["npm", "run", "dev"]