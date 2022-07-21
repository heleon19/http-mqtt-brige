FROM node:16.13.0-slim

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "index.js"]