FROM node:22 AS build
WORKDIR /home/node/app
COPY . .
RUN npm i
RUN npm install -g @angular/cli
RUN ng build --configuration production

FROM nginx
COPY --from=build /home/node/app/dist/kulonut-fe/browser /usr/share/nginx/html