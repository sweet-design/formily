FROM centos
RUN yum install -y autoconf automake make wget net-tools zlib zlib-devel make gcc openssl-devel pcre pcre-devel tar
RUN wget http://nginx.org/download/nginx-1.18.0.tar.gz
RUN tar -zxvf nginx-1.18.0.tar.gz
WORKDIR nginx-1.18.0
RUN ./configure --prefix=/usr/local/nginx && make && make install
WORKDIR /usr/local/nginx
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

FROM nginx:alpine
RUN mkdir /app
COPY ./dist /app
COPY nginx.conf /etc/nginx/nginx.conf
