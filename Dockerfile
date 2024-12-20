# Base image
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

COPY start.sh .

RUN chmod +x start.sh

EXPOSE 9000

CMD ["./start.sh"]