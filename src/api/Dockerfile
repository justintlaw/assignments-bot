FROM node:16-alpine3.16
ENV NODE_ENV=production
ENV MONGO_DB_PORT=27017
ENV MONGO_DB_HOST=172.28.5.254
ENV PORT=3000
WORKDIR /app
COPY . .
RUN npm install --production
CMD [ "node", "server.js" ]
