#/bin/sh

hugo --minify

docker rm -f blog

docker build -t blog .

docker run --name blog -p 8032:80 -d blog