FROM node:18

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY . .

EXPOSE 80

CMD ["yarn", "start"]
