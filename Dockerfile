# Dockerfile para o backend Node.js
FROM node:20-alpine
WORKDIR /app/APP
COPY ./APP ./
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
