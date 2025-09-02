# Dockerfile
FROM node:14.21.3 AS myreactapp

WORKDIR /app
COPY . .
RUN export NODE_OPTIONS=--max_old_space_size=16384
RUN npm install --legacy-peer-deps

#Register Syncfusion Key
ARG SYNCFUSION_LICENSE=ORg4AjUWIQA/Gnt2VVhkQlFacltJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkRhXH9fdX1UQWJVUEc=
RUN npx syncfusion-license activate
#RUN npm install
RUN npm run build
FROM httpd:2.4

COPY --from=myreactapp /app/build/ /var/www/html/

# Generate private key and CSR
RUN openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr -subj "/O=IBM/CN=localhost"

# Generate self-signed certificate
RUN openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt


RUN cp server.crt /usr/local/apache2/conf/server.crt
RUN cp server.key /usr/local/apache2/conf/server.key

COPY httpd.conf.txt /usr/local/apache2/conf/httpd.conf
COPY httpd-ssl.conf.txt /usr/local/apache2/conf/extra/httpd-ssl.conf

WORKDIR /var/www/html
#copy htaccess to container
COPY .htaccess /var/www/html/

#COPY dev.conf /etc/apache2/sites-enabled/dev.conf

RUN apt-get update && apt-get install -y libapache2-mod-php
RUN a2enmod ssl
RUN a2enmod headers
RUN a2enmod rewrite
RUN service apache2 restart
RUN service cups-browsed stop || true && apt-get remove -y cups-browsed
RUN chmod -R 755 /var/www/html/

#expose port
EXPOSE 8444
