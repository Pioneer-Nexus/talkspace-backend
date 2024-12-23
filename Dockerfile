FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm i --omit=dev
RUN npm install --os=linux --libc=musl --cpu=x64 sharp
RUN npm rebuild bcrypt --build-from-source

COPY . .

RUN npm run build

FROM node:22-alpine

COPY --from=build /app /

EXPOSE 9000

CMD ["node", "dist/main.js"]