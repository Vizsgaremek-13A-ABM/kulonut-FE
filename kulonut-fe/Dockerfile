FROM node:22 AS build
WORKDIR /home/node/app
COPY . .
RUN npm i
RUN npm install -g @angular/cli
RUN ng build --configuration production

FROM httpd:2.4
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
COPY --from=build /home/node/app/dist/kulonut-fe/browser /usr/local/apache2/htdocs/
COPY ./httpd-spa.conf /usr/local/apache2/conf/extra/httpd-spa.conf
RUN echo "Include conf/extra/httpd-spa.conf" >> /usr/local/apache2/conf/httpd.conf
EXPOSE 80