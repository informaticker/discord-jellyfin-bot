FROM node:16.13.1-alpine3.12
RUN apk add ffmpeg

COPY . /app
WORKDIR /app

CMD ["yarn", "start:prod"]
