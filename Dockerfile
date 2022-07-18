# Build

FROM node:18-alpine3.15 as builder

RUN mkdir -p /root/app
WORKDIR /root/app

COPY package.json yarn.lock /root/app/
RUN yarn install
COPY . /root/app/
RUN yarn generate

# Release

FROM nginx:alpine

COPY --from=builder /root/app/out/ /usr/share/nginx/html/
