FROM node:20-slim

WORKDIR /app

# Копируем папки с проектами
COPY client/ ./client
COPY server/ ./server

# Устанавливаем зависимости для client
WORKDIR /app/client
RUN npm install

# Устанавливаем зависимости для server
WORKDIR /app/server
RUN npm install

# Возвращаемся в рабочую папку и копируем root package.json, если есть
WORKDIR /app

# Если есть общий package.json, копируем его
COPY package.json package.json
RUN npm install

# Экспонируем порты
EXPOSE 4000
EXPOSE 8000

# Запуск команд для обоих приложений, например:
# Можно запускать оба сервера с помощью pm2, или же запускать их отдельно.
# Ниже пример запуска client и server одновременно с помощью & 
CMD ["npm", "start"]