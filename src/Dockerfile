FROM node:16-alpine3.16
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install --production
CMD [ "node", "server.js" ]
