FROM node:18

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY . .

ENV PORT=3000

EXPOSE $PORT

CMD ["yarn", "start:prod"]