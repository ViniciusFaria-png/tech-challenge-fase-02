FROM node:lts

WORKDIR /usr/src

COPY .env .env

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]