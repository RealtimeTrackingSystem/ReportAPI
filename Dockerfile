FROM node:alpine
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
COPY ./firebase-service-account.json ./
CMD ["npm", "run", "start"]