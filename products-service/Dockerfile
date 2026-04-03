FROM node:18

WORKDIR /app

COPY package*.json ./
COPY clean-db.js ./
RUN npm install

COPY . .

# Генерация Prisma-клиента при сборке контейнера
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
