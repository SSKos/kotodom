FROM node:20 AS build

WORKDIR /app

# Копия файлов для установки зависимостей
COPY client/package.json client/yarn.lock ./

# Установка зависимостей, включая @vue/cli-service и @vue/cli-plugin-babel
RUN apt-get update && apt-get install -y npm && yarn install
RUN yarn add @vue/cli-service @vue/cli-plugin-babel -D

# Копируем остальные файлы и собираем приложение
COPY client .
RUN yarn build

FROM node:20 AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Установка необходимых зависимостей для запуска в production
RUN apt-get update && apt-get install -y npm && yarn install

EXPOSE 8080

CMD ["npx", "vue-cli-service", "serve", "--host", "0.0.0.0"]