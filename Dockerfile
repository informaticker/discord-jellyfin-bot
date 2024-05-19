FROM node:17.3.0-alpine3.12
RUN apk add ffmpeg

COPY . /app
WORKDIR /app

CMD ["yarn", "start:prod"]
