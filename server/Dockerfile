#server/Dockerfile

FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только package.json и yarn.lock для установки зависимостей
COPY ./server/package.json ./server/yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем оставшиеся файлы сервера
COPY ./server .

# Определяем порт
EXPOSE 5001

# Запускаем сервер
CMD ["yarn", "run", "dev"]
# Или "start", в зависимости от ваших скриптов