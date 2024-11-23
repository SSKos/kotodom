# Используем образ Node.js версии 20
FROM node:20

# Задаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Добавляем CORS перед запуском приложения (если требуется)
RUN npm install cors

# Копируем оставшиеся файлы проекта
COPY . .

# Открываем порт 5001
EXPOSE 5001

# Запускаем приложение
CMD ["npm", "run", "dev"]