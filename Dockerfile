FROM nginx:alpine
EXPOSE 80
COPY /deploy /usr/share/nginx/html
