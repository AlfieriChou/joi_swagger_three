FROM docker.io/node:8.15.0-alpine

RUN mkdir /app/joi_swagger_three
WORKDIR /app/joi_swagger_three
ADD . /app/joi_swagger_three

RUN cd /app/joi_swagger_three && npm install

EXPOSE 4000