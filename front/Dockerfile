FROM node:buster

WORKDIR /frontend

RUN npm install -f  next --save
COPY ./package.json .


RUN npm i -f

COPY . .

# Expose the port on which your Next.js application listens
EXPOSE 8080

RUN chmod +x /frontend/tools/init.sh

ENTRYPOINT [ "sh" , "/frontend/tools/init.sh" ]
# Start the Next.js application in dev mode
CMD [""]