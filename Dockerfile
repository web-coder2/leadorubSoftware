# Dockerfile для бэкенда (Node.js/Express)
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем проект (если есть сборка)
# RUN npm run build

# Открываем порт 8000
EXPOSE 8000

# Запускаем сервер
CMD ["npm", "dev"]