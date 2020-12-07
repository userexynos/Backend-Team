FROM node:latest

WORKDIR /usr/src/app

COPY . .

CMD ["node", "./bin/www"]