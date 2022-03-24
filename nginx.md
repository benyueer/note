### 安装

#### mac

brew install nginx

应用程序会安装到 `/usr/local/Cellar/nginx` , 

配置会安装到 `/usr/local/etc/nginx`

#### windows

下载后解压，应用是 `nginx.exe` ，配置在 `config` 目录下

### 概念

* 代理

  nginx是一个代理服务器，会将客户端的请求发送到服务端，服务端不会知道是哪个客户端发起的请求，只会执行操作（代表客户端访问服务器）

    - 正向代理
      通过代理访问服务器，服务器会返回给客户端

    - 反向代理
      接收客户端的请求，在发送到服务端，nginx会

* 负载均衡
  将请求分发到不同的服务器上，让不同的服务器承担不同的负载

* 动静分离
  为了加快网站的解析速度，将动态资源和静态资源分开部署，由不同的服务器进行解析

### 命令

* 启动
 `nginx -c /usr/local/etc/nginx/nginx.conf`

 `nginx`

* 停止
 `nginx -s stop`

* 重启
 `nginx -s reload`

### 配置

```
... #全局块
events { #events块
...
}

http #http块
{
    ... #http全局块

    server #server块
    { 
        ... #server全局块
        location [PATTERN] #location块
        {
            ...
        }
        location [PATTERN] 
        {
            ...
        }
     }

    server
    {
        ...
    }

    ... #http全局块
}
```

* 全局块
  从配置文件开始到events块之间的内容，主要会设置一些影响nginx整体运行的配置指令
  通常包括配置运行Nginx服务器的用户（组）、允许生成的worker process数、Nginx进程PID存放路径、日志的存放路径和类型以及配置文件引入等。

    ```
    # 指定可以运行nginx服务的用户和用户组，只能在全局块配置
    # user [user] [group]
    # 将user指令注释掉，或者配置成nobody的话所有用户都可以运行
    # user nobody nobody;
    # user指令在Windows上不生效，如果你制定具体用户和用户组会报小面警告
    # nginx: [warn] "user" is not supported, ignored in D:\software\nginx-1.18.0/conf/nginx.conf:2

    # 指定工作线程数，可以制定具体的进程数，也可使用自动模式，这个指令只能在全局块配置
    # worker_processes number | auto；
    # 列子：指定4个工作线程，这种情况下会生成一个master进程和4个worker进程
    # worker_processes 4;

    # 指定pid文件存放的路径，这个指令只能在全局块配置
    # pid logs/nginx.pid;

    # 指定错误日志的路径和日志级别，此指令可以在全局块、http块、server块以及location块中配置。(在不同的块配置有啥区别？？)
    # 其中debug级别的日志需要编译时使用--with-debug开启debug开关
    # error_log [path] [debug | info | notice | warn | error | crit | alert | emerg] 
    # error_log  logs/error.log  notice;
    # error_log  logs/error.log  info;
    ```

* events块
  events块涉及的指令主要影响Nginx服务器与用户的网络连接。常用到的设置包括是否开启对多worker process下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型处理连接请求，每个worker process可以同时支持的最大连接数等。
  这一部分的指令对Nginx服务器的性能影响较大，在实际配置中应该根据实际情况灵活调整。

  ```
    # 当某一时刻只有一个网络连接到来时，多个睡眠进程会被同时叫醒，但只有一个进程可获得连接。如果每次唤醒的进程数目太多，会影响一部分系统性能。在Nginx服务器的多进程下，就有可能出现这样的问题。
    # `开启的时候，将会对多个Nginx进程接收连接进行序列化，防止多个进程对连接的争抢
    # 默认是开启状态，只能在events块中进行配置
    # accept_mutex on | off;

    # 如果multi_accept被禁止了，nginx一个工作进程只能同时接受一个新的连接。否则，一个工作进程可以同时接受所有的新连接。 
    # 如果nginx使用kqueue连接方法，那么这条指令会被忽略，因为这个方法会报告在等待被接受的新连接的数量。
    # 默认是off状态，只能在event块配置
    # multi_accept on | off;

    # 指定使用哪种网络IO模型，method可选择的内容有：select、poll、kqueue、epoll、rtsig、/dev/poll以及eventport，一般操作系统不是支持上面所有模型的。
    # 只能在events块中进行配置
    # use method
    # use epoll

    # 设置允许每一个worker process同时开启的最大连接数，当每个工作进程接受的连接数超过这个值时将不再接收连接
    # 当所有的工作进程都接收满时，连接进入logback，logback满后连接被拒绝
    # 只能在events块中进行配置
    # 注意：这个值不能超过超过系统支持打开的最大文件数，也不能超过单个进程支持打开的最大文件数，具体可以参考这篇文章：https://cloud.tencent.com/developer/article/1114773
    # worker_connections  1024;
  ```

* http块
  http块是Nginx服务器配置中的重要部分，代理、缓存和日志定义等绝大多数的功能和第三方模块的配置都可以放在这个模块中。
  前面已经提到，http块中可以包含自己的全局块，也可以包含server块，server块中又可以进一步包含location块，在本书中我们使用“http全局块”来表示http中自己的全局块，即http块中不包含在server块中的部分。
  可以在http全局块中配置的指令包括文件引入、MIME-Type定义、日志自定义、是否使用sendfile传输文件、连接超时时间、单连接请求数上限等。
  ```
  # 常用的浏览器中，可以显示的内容有HTML、XML、GIF及Flash等种类繁多的文本、媒体等资源，浏览器为区分这些资源，需要使用MIME Type。换言之，MIME Type是网络资源的媒体类型。Nginx服务器作为Web服务器，必须能够识别前端请求的资源类型。

  # include指令，用于包含其他的配置文件，可以放在配置文件的任何地方，但是要注意你包含进来的配置文件一定符合配置规范，比如说你include进来的配置是worker_processes指令的配置，而你将这个指令包含到了http块中，着肯定是不行的，上面已经介绍过worker_processes指令只能在全局块中。
  # 下面的指令将mime.types包含进来，mime.types和ngin.cfg同级目录，不同级的话需要指定具体路径
  # include  mime.types;

  # 配置默认类型，如果不加此指令，默认值为text/plain。
  # 此指令还可以在http块、server块或者location块中进行配置。
  # default_type  application/octet-stream;

  # access_log配置，此指令可以在http块、server块或者location块中进行设置
  # 在全局块中，我们介绍过errer_log指令，其用于配置Nginx进程运行时的日志存放和级别，此处所指的日志与常规的不同，它是指记录Nginx服务器提供服务过程应答前端请求的日志
  # access_log path [format [buffer=size]]
  # 如果你要关闭access_log,你可以使用下面的命令
  # access_log off;

  # log_format指令，用于定义日志格式，此指令只能在http块中进行配置
  # log_format  main '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';
  # 定义了上面的日志格式后，可以以下面的形式使用日志
  # access_log  logs/access.log  main;

  # 开启关闭sendfile方式传输文件，可以在http块、server块或者location块中进行配置
  # sendfile  on | off;

  # 设置sendfile最大数据量,此指令可以在http块、server块或location块中配置
  # sendfile_max_chunk size;
  # 其中，size值如果大于0，Nginx进程的每个worker process每次调用sendfile()传输的数据量最大不能超过这个值(这里是128k，所以每次不能超过128k)；如果设置为0，则无限制。默认值为0。
  # sendfile_max_chunk 128k;

  # 配置连接超时时间,此指令可以在http块、server块或location块中配置。
  # 与用户建立会话连接后，Nginx服务器可以保持这些连接打开一段时间
  # timeout，服务器端对连接的保持时间。默认值为75s;header_timeout，可选项，在应答报文头部的Keep-Alive域设置超时时间：“Keep-Alive:timeout= header_timeout”。报文中的这个指令可以被Mozilla或者Konqueror识别。
  # keepalive_timeout timeout [header_timeout]
  # 下面配置的含义是，在服务器端保持连接的时间设置为120 s，发给用户端的应答报文头部中Keep-Alive域的超时时间设置为100 s。
  # keepalive_timeout 120s 100s

  # 配置单连接请求数上限，此指令可以在http块、server块或location块中配置。
  # Nginx服务器端和用户端建立会话连接后，用户端通过此连接发送请求。指令keepalive_requests用于限制用户通过某一连接向Nginx服务器发送请求的次数。默认是100
  # keepalive_requests number;
  ```

* serve块
  server块和“虚拟主机”的概念有密切联系。

  虚拟主机，又称虚拟服务器、主机空间或是网页空间，它是一种技术。该技术是为了节省互联网服务器硬件成本而出现的。这里的“主机”或“空间”是由实体的服务器延伸而来，硬件系统可以基于服务器群，或者单个服务器等。虚拟主机技术主要应用于HTTP、FTP及EMAIL等多项服务，将一台服务器的某项或者全部服务内容逻辑划分为多个服务单位，对外表现为多个服务器，从而充分利用服务器硬件资源。从用户角度来看，一台虚拟主机和一台独立的硬件主机是完全一样的。

  在使用Nginx服务器提供Web服务时，利用虚拟主机的技术就可以避免为每一个要运行的网站提供单独的Nginx服务器，也无需为每个网站对应运行一组Nginx进程。虚拟主机技术使得Nginx服务器可以在同一台服务器上只运行一组Nginx进程，就可以运行多个网站。

  在前面提到过，每一个http块都可以包含多个server块，而每个server块就相当于一台虚拟主机，它内部可有多台主机联合提供服务，一起对外提供在逻辑上关系密切的一组服务（或网站）。

  和http块相同，server块也可以包含自己的全局块，同时可以包含多个location块。在server全局块中，最常见的两个配置项是本虚拟主机的监听配置和本虚拟主机的名称或IP配置。

  ```
    # 常用的浏览器中，可以显示的内容有HTML、XML、GIF及Flash等种类繁多的文本、媒体等资源，浏览器为区分这些资源，需要使用MIME Type。换言之，MIME Type是网络资源的媒体类型。Nginx服务器作为Web服务器，必须能够识别前端请求的资源类型。

    # include指令，用于包含其他的配置文件，可以放在配置文件的任何地方，但是要注意你包含进来的配置文件一定符合配置规范，比如说你include进来的配置是worker_processes指令的配置，而你将这个指令包含到了http块中，着肯定是不行的，上面已经介绍过worker_processes指令只能在全局块中。
    # 下面的指令将mime.types包含进来，mime.types和ngin.cfg同级目录，不同级的话需要指定具体路径
    # include  mime.types;

    # 配置默认类型，如果不加此指令，默认值为text/plain。
    # 此指令还可以在http块、server块或者location块中进行配置。
    # default_type  application/octet-stream;

    # access_log配置，此指令可以在http块、server块或者location块中进行设置
    # 在全局块中，我们介绍过errer_log指令，其用于配置Nginx进程运行时的日志存放和级别，此处所指的日志与常规的不同，它是指记录Nginx服务器提供服务过程应答前端请求的日志
    # access_log path [format [buffer=size]]
    # 如果你要关闭access_log,你可以使用下面的命令
    # access_log off;

    # log_format指令，用于定义日志格式，此指令只能在http块中进行配置
    # log_format  main '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';
    # 定义了上面的日志格式后，可以以下面的形式使用日志
    # access_log  logs/access.log  main;

    # 开启关闭sendfile方式传输文件，可以在http块、server块或者location块中进行配置
    # sendfile  on | off;

    # 设置sendfile最大数据量,此指令可以在http块、server块或location块中配置
    # sendfile_max_chunk size;
    # 其中，size值如果大于0，Nginx进程的每个worker process每次调用sendfile()传输的数据量最大不能超过这个值(这里是128k，所以每次不能超过128k)；如果设置为0，则无限制。默认值为0。
    # sendfile_max_chunk 128k;

    # 配置连接超时时间,此指令可以在http块、server块或location块中配置。
    # 与用户建立会话连接后，Nginx服务器可以保持这些连接打开一段时间
    # timeout，服务器端对连接的保持时间。默认值为75s;header_timeout，可选项，在应答报文头部的Keep-Alive域设置超时时间：“Keep-Alive:timeout= header_timeout”。报文中的这个指令可以被Mozilla或者Konqueror识别。
    # keepalive_timeout timeout [header_timeout]
    # 下面配置的含义是，在服务器端保持连接的时间设置为120 s，发给用户端的应答报文头部中Keep-Alive域的超时时间设置为100 s。
    # keepalive_timeout 120s 100s

    # 配置单连接请求数上限，此指令可以在http块、server块或location块中配置。
    # Nginx服务器端和用户端建立会话连接后，用户端通过此连接发送请求。指令keepalive_requests用于限制用户通过某一连接向Nginx服务器发送请求的次数。默认是100
    # keepalive_requests number;

  ```


  * listen指令
    server块中最重要的指令就是listen指令，这个指令有三种配置语法。这个指令默认的配置值是：listen \*:80 | \*:8000；*只能在server块中配置这个指令*。
    ```
    //第一种
    listen address[:port] [default_server] [ssl] [http2 | spdy] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on|off] [reuseport] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];

    //第二种
    listen port [default_server] [ssl] [http2 | spdy] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on|off] [reuseport] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];

    //第三种（可以不用重点关注）
    listen unix:path [default_server] [ssl] [http2 | spdy] [proxy_protocol] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [so_keepalive=on|off|[keepidle]:[keepintvl]:[keepcnt]];

    ```
    listen指令的配置非常灵活，可以单独制定ip，单独指定端口或者同时指定ip和端口。
    ```
    listen 127.0.0.1:8000;  #只监听来自127.0.0.1这个IP，请求8000端口的请求
    listen 127.0.0.1; #只监听来自127.0.0.1这个IP，请求80端口的请求（不指定端口，默认80）
    listen 8000; #监听来自所有IP，请求8000端口的请求
    listen *:8000; #和上面效果一样
    listen localhost:8000; #和第一种效果一致
    ```


### 实例

#### 反向代理
```
server {
    listen 80;
    server_name www.example.com;
    loaction / {

    }
    location 
}
```


```
########### 每个指令必须有分号结束。#################

#配置用户或者组，默认为nobody nobody。
#user administrator administrators; 
#允许生成的进程数，默认为1
#worker_processes 2; 
#指定nginx进程运行文件存放地址
#pid /nginx/pid/nginx.pid; 
#制定错误日志路径，级别。这个设置可以放入全局块，http块，server块，级别依次为：debug|info|notice|warn|error|crit|alert|emerg
error_log log/error.log debug; 

#工作模式及连接数上限
events {
#设置网路连接序列化，防止惊群现象发生，默认为on
   accept_mutex on; 
#设置一个进程是否同时接受多个网络连接，默认为off
   multi_accept on; 
#事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
#use epoll; 
#单个work进程允许的最大连接数，默认为512
   worker_connections 1024; 
}

#http服务器
http {
#文件扩展名与文件类型映射表。设定mime类型(邮件支持类型),类型由mime.types文件定义
#include /usr/local/etc/nginx/conf/mime.types;
   include mime.types; 
#默认文件类型，默认为text/plain
   default_type application/octet-stream; 

#取消服务访问日志
#access_log off;     
#自定义日志格式
   log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; 
#设置访问日志路径和格式。"log/"该路径为nginx日志的相对路径，mac下是/usr/local/var/log/。combined为日志格式的默认值
   access_log log/access.log myFormat; 
   rewrite_log on;

#允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。（sendfile系统调用不需要将数据拷贝或者映射到应用程序地址空间中去）
   sendfile on; 
#每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
   sendfile_max_chunk 100k; 

#连接超时时间，默认为75s，可以在http，server，location块。
   keepalive_timeout 65; 

#gzip压缩开关
#gzip on;

   tcp_nodelay on;

#设定实际的服务器列表
   upstream mysvr1 {   
     server 127.0.0.1:7878;
     server 192.168.10.121:3333 backup; #热备(其它所有的非backup机器down或者忙的时候，请求backup机器))
   }
   upstream mysvr2 {
#weigth参数表示权值，权值越高被分配到的几率越大
     server 192.168.1.11:80 weight=5;
     server 192.168.1.12:80 weight=1;
     server 192.168.1.13:80 weight=6;
   }
   upstream https-svr {
#每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题
     ip_hash;
     server 192.168.1.11:90;
     server 192.168.1.12:90;
   }

#error_page 404 https://www.baidu.com; #错误页

#HTTP服务器

# 静态资源一般放在nginx所在主机
   server {
       listen 80; #监听HTTP端口
       server_name 127.0.0.1; #监听地址  
       keepalive_requests 120; #单连接请求上限次数
       set $doc_root_dir "/Users/doing/IdeaProjects/edu-front-2.0"; #设置server里全局变量
       #index index.html;  #定义首页索引文件的名称
       location ~*^.+$ { #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
          root $doc_root_dir; #静态资源根目录
          proxy_pass http://mysvr1; #请求转向“mysvr1”定义的服务器列表
          #deny 127.0.0.1; #拒绝的ip
          #allow 172.18.5.54; #允许的ip           
       } 
   }

#http
   server {
       listen 80;
       server_name www.helloworld.com; #监听基于域名的虚拟主机。可有多个，可以使用正则表达式和通配符
       charset utf-8; #编码格式
       set $static_root_dir "/Users/doing/static";
       location /app1 { #反向代理的路径（和upstream绑定），location后面设置映射的路径 
           proxy_pass http://zp_server1;
       } 
       location /app2 {  
           proxy_pass http://zp_server2;
       } 
       location ~ ^/(images|javascript|js|css|flash|media|static)/ {  #静态文件，nginx自己处理
           root $static_root_dir;
           expires 30d; #静态资源过时间30天
       }
       location ~ /\.ht {  #禁止访问 .htxxx 文件
           deny all;
       }
       location = /do_not_delete.html { #直接简单粗暴的返回状态码及内容文本
           return 200 "hello.";
       }

# 指定某些路径使用https访问(使用正则表达式匹配路径+重写uri路径)
       location ~* /http* { #路径匹配规则：如localhost/http、localhost/httpsss等等
#rewrite只能对域名后边的除去传递的参数外的字符串起作用，例如www.c.com/proxy/html/api/msg?method=1&para=2只能对/proxy/html/api/msg重写。
#rewrite 规则 定向路径 重写类型;
#rewrite后面的参数是一个简单的正则。$1代表正则中的第一个()。
#$host是nginx内置全局变量，代表请求的主机名
#重写规则permanent表示返回301永久重定向
           rewrite ^/(.*)$ https://$host/$1 permanent;
       }

#错误处理页面（可选择性配置）
#error_page 404 /404.html;
#error_page 500 502 503 504 /50x.html;

#以下是一些反向代理的配置(可选择性配置)
#proxy_redirect off;
#proxy_set_header Host $host; #proxy_set_header用于设置发送到后端服务器的request的请求头
#proxy_set_header X-Real-IP $remote_addr;
#proxy_set_header X-Forwarded-For $remote_addr; #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
#proxy_connect_timeout 90; #nginx跟后端服务器连接超时时间(代理连接超时)
#proxy_send_timeout 90; #后端服务器数据回传时间(代理发送超时)
#proxy_read_timeout 90; #连接成功后，后端服务器响应时间(代理接收超时)
#proxy_buffer_size 4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
#proxy_buffers 4 32k; #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
#proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
#proxy_temp_file_write_size 64k; #设定缓存文件夹大小，大于这个值，将从upstream服务器传

#client_max_body_size 10m; #允许客户端请求的最大单文件字节数
#client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数


   }

#https
#(1)HTTPS的固定端口号是443，不同于HTTP的80端口；
#(2)SSL标准需要引入安全证书，所以在 nginx.conf 中你需要指定证书和它对应的 key
   server {
     listen 443;
     server_name  www.hellohttps1.com www.hellohttps2.com;
     set $geek_web_root "/Users/doing/IdeaProjects/backend-geek-web";
     ssl_certificate      /usr/local/etc/nginx/ssl-key/ssl.crt; #ssl证书文件位置(常见证书文件格式为：crt/pem)
     ssl_certificate_key  /usr/local/etc/nginx/ssl-key/ssl.key; #ssl证书key位置
     location /passport {
       send_timeout 90;
       proxy_connect_timeout 50;
       proxy_send_timeout 90;
       proxy_read_timeout 90;
       proxy_pass http://https-svr;
     }
     location ~ ^/(res|lib)/ {
        root $geek_web_root; 
        expires 7d;
#add_header用于为后端服务器返回的response添加请求头，这里通过add_header实现CROS跨域请求服务器
        add_header Access-Control-Allow-Origin *; 
     }
#ssl配置参数（选择性配置）
     ssl_session_cache shared:SSL:1m;
     ssl_session_timeout 5m;
   }

#配置访问控制：每个IP一秒钟只处理一个请求，超出的请求会被delayed
#语法：limit_req_zone  $session_variable  zone=name:size  rate=rate (为session会话状态分配一个大小为size的内存存储区，限制了每秒（分、小时）只接受rate个IP的频率)
   limit_req_zone  $binary_remote_addr zone=req_one:10m   rate=1r/s nodelay;
   location /pay {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real_IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#访问控制：limit_req zone=name [burst=number] [nodelay];
        limit_req zone=req_one burst=5; #burst=5表示超出的请求(被delayed)如果超过5个，那些请求会被终止（默认返回503）
        proxy_pass http://mysvr1;
   }

#可以把子配置文件放到/usr/local/etc/nginx/servers/路径下，通过include引入
   include /usr/local/etc/nginx/servers/*.conf;

} 

```







#### 动静分离
location里配置一个匹配静态资源的正则

#### 负载均衡
策略
1. 轮询
   这是默认的策略，把每个请求逐一分配到不同的server，如果分配到的server不可用，则分配到下一个，直到可用
   ```
    upstream test.cc {
      server 192.168.8.143 max_fails=3 fail_timeout=15;
      server 192.168.8.144 backup;
      server www.123.com max_conns=100;
    }

   ```
  - max_fails: 默认为1，某台服务器允许连接失败的最大次数，达到这个次数后，在fail_timeout时间内新的请求不会分配到该服务器，如果设置为0，则表示该服务器不可用
  - backup： 备份机，所有的服务挂了才会启用
  - max_conns: 最大连接数，超过这个数量，新的连接不会分配给该服务器，默认为0，表示不限制

2. 最少连接
   把请求分配到连接数最少的server
   ```
    upstream test.cc {
        least_conn;
        server 192.168.8.143;
        server 192.168.8.144;
    }
   ```
3. 权重
   weight默认值为1，值越大则代表被访问的几率越大，如下配置，144的访问数量是143的2倍
   ```
   upstream test.cc {
        server 192.168.8.143 weight=1;
        server 192.168.8.144 weight=2;
    }
   ```
4. ip_hash
   根据访问客户端ip的hash值分配，这样同一客户端的请求都会被分配到同一个server上，如果牵扯到session的问题，用这个是最好的选择
   ```
   upstream test.cc {
        ip_hash;
        server 192.168.8.143;
        server 192.168.8.144;
    }
   ```



#### 配置HTTPS
1. 安装nginx SSL模块
   `nginx -V`查看`configure arguments`中是否存在`--with-http_ssl_module`
2. 上传SSL证书到服务器
3. 配置nginx config
   在server块中配置：
   - ssl_certificate： 证书的pem文件路径
   - ssl_certificate_key：证书的key文件路径
4. 重启nginx

#### 配置WebSocket
#### 内置全局变量
```
$args ：这个变量等于请求行中的参数，同$query_string
$content_length ： 请求头中的Content-length字段。
$content_type ： 请求头中的Content-Type字段。
$document_root ： 当前请求在root指令中指定的值。
$host ： 请求主机头字段，否则为服务器名称。
$http_user_agent ： 客户端agent信息
$http_cookie ： 客户端cookie信息
$limit_rate ： 这个变量可以限制连接速率。
$request_method ： 客户端请求的动作，通常为GET或POST。
$remote_addr ： 客户端的IP地址。
$remote_port ： 客户端的端口。
$remote_user ： 已经经过Auth Basic Module验证的用户名。
$request_filename ： 当前请求的文件路径，由root或alias指令与URI请求生成。
$scheme ： HTTP方法（如http，https）。
$server_protocol ： 请求使用的协议，通常是HTTP/1.0或HTTP/1.1。
$server_addr ： 服务器地址，在完成一次系统调用后可以确定这个值。
$server_name ： 服务器名称。
$server_port ： 请求到达服务器的端口号。
$request_uri ： 包含请求参数的原始URI，不包含主机名，如：”/foo/bar.php?arg=baz”。
$uri ： 不带请求参数的当前URI，$uri不包含主机名，如”/foo/bar.html”。
$document_uri ： 与$uri相同。
```

[nginx变量](https://juejin.cn/post/6844904097812840461)
[参考](https://juejin.cn/post/7072616582110773262)