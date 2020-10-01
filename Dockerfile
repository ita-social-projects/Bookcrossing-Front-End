FROM node:14.5-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g @angular/cli@9.0.6
RUN npm install
COPY . .
RUN ng build

FROM nginx:1.19
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/BookCrossingFrontEnd/ /srv/myapp
