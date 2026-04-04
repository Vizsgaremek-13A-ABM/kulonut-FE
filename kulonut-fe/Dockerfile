FROM node:22 AS build
WORKDIR /home/node/app
COPY . .
RUN npm i
RUN npm install -g @angular/cli
RUN ng build --configuration production

FROM httpd:2.4
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY --from=build /home/node/app/dist/kulonut-fe/browser /usr/local/apache2/htdocs/
EXPOSE 80
