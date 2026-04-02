FROM node:22 AS build
WORKDIR /home/node/app
COPY . .
RUN npm i
RUN npm run build

FROM nginx
COPY --from=build /home/node/app/dist/Kiosk/browser /usr/share/nginx/html