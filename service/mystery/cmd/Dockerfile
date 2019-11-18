FROM alpine

RUN apk upgrade --update-cache \
    && apk add ca-certificates \
    && rm -rf /var/cache/apk/*

COPY exec/mystery-game-linux-amd64 /usr/local/bin/mystery-game

ENTRYPOINT ["/usr/local/bin/mystery-game"]
