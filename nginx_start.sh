#!/bin/bash
# from https://bneijt.nl/blog/post/running-nginx-for-local-development/
set -x
RELD="`dirname "$0"`"
ABSD="`realpath "$RELD"`"
echo $RELD
echo $ABSD
pwd
exit

sed "s,ROOT,$ABSD," < nginx.conf.template > nginx.conf

exec nginx -c "$ABSD"/nginx.conf
