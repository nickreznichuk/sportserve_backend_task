FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY . /app
EXPOSE 3001

CMD ["node", "dist/server.js"]
