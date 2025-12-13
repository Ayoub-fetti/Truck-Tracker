FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps


COPY . .

ENV NODE_ENV=development

EXPOSE 5000

CMD npm run seed && npm start