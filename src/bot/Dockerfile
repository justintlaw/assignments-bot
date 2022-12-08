FROM node:16-alpine3.16
ENV NODE_ENV=production
ENV API_PORT=3000
WORKDIR /app
COPY . .
RUN npm install --production
CMD [ "node", "client.js" ]