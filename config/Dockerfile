FROM envoyproxy/envoy-alpine:v1.12.1

RUN apk upgrade --update-cache \
    && apk add ca-certificates \
    && rm -rf /var/cache/apk/*

COPY config/envoy_config_tap_500_code_responses.yaml /usr/local/config/envoy_config_tap_500_code_responses.yaml

ENTRYPOINT ["/usr/local/bin/envoy", "-c", "/usr/local/config/envoy_config_tap_500_code_responses.yaml"]