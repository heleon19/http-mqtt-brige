FROM node:18-slim

COPY . .

RUN npm install

EXPOSE 5000

CMD ["node", "index.js"]