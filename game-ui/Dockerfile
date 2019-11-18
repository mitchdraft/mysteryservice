FROM nginx:1.13.9-alpine

# Replace existing NGINX configuration
# RUN rm -rf /etc/nginx/conf.d
COPY ./served.conf /etc/nginx
COPY ./mime.types /etc/nginx/mime.types

COPY ./build /usr/share/nginx/html

EXPOSE 19123
CMD ["nginx", "-g", "daemon off;"]