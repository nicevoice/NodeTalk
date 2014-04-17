## NodeTalk
Just another forum.

A Node-based BBS by NodeJS, use MongoDB and Markdown.

## Install

    apt-get install mongodb

    git clone https://github.com/jybox/NodeTalk.git
    cd NodeTalk

    npm install
    npm install pm2 -g
    make

    pm2 start --name NodeTalk app.js

Then you can visit `http://127.0.0.1:3000`, or setup a proxy on 80:

    server {
        listen 80;
        server_name nt.jybox.net;

        location / {
            proxy_set_header Host $host;
            proxy_redirect off;
            proxy_pass http://127.0.0.1:3000;
        }
    }
