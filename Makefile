
TAP_ROOT=tap_root
GAME_SERVICE_DIR=service/mystery/cmd
VERSION=0.0.1

### Initialization

.PHONY: initialize-tap-directories
initialize-tap-directories:
	mkdir -p $(TAP_ROOT)
	mkdir -p $(TAP_ROOT)/all_traffic
	mkdir -p $(TAP_ROOT)/error_traffic


### Game server
.PHONY: start-game-server
start-game-server:
	go run $(GAME_SERVICE_DIR)/main.go --port 9912

# alternatively, run from docker:
# most container ports will work, use 9919 to distinguish, expose locally on 9912
.PHONY: run-docker-game-server
run-docker-game-server:
	docker run -p 9912:9919 mitchdraft/mystery-game:0.0.1 --port 9919

### Envoy options

.PHONY: start-envoy-all-traffic
start-envoy-all-traffic:
	envoy -c config/envoy_config_tap_any.yaml

.PHONY: start-envoy-error-traffic
start-envoy-error-traffic:
	envoy -c config/envoy_config_tap_500_code_responses.yaml

### Nginx fileserver helper

.PHONY: start-nginx
start-nginx:
	./nginx_start.sh

.PHONY: stop-nginx
stop-nginx:
	./nginx_stop.sh

### Query examples

# this query will produce a 200 response because it does not correctly identify the "crime"
.PHONY: guess-incorrectly
guess-incorrectly:
	curl 'localhost:9911/guess' -X POST -d '{"guess": {"guest": "innocent guest","room":"b","object":"c"}}' -H "Content-Type: application/json"

# this query will produce a 500 as it correctly identifies the "crime"
.PHONY: guess-correctly
guess-correctly:
	curl "localhost:9911/guess" -X POST -d '{"guess": {"guest": "a","room":"b","object":"c"}}' -H "Content-Type: application/json"



### build

.PHONY: build-mystery-game-server
build-mystery-game-server:
	CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -o exec/mystery-game-linux-amd64 $(GAME_SERVICE_DIR)/main.go

.PHONY: docker-push
docker-push:
	docker build -t mitchdraft/mystery-game:$(VERSION) -f $(GAME_SERVICE_DIR)/Dockerfile .
	docker push mitchdraft/mystery-game:$(VERSION)

.PHONY: docker-push-envoy
docker-push-envoy:
	docker build -t mitchdraft/mystery-tap-err:$(VERSION) -f config/Dockerfile .
	# docker push mitchdraft/mystery-game:$(VERSION)

