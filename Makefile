.PHONY: build help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: package.json ## install dependencies
	@if [ "$(CI)" != "true" ]; then \
		echo "Full install..."; \
		yarn; \
	fi
	@if [ "$(CI)" = "true" ]; then \
		echo "Frozen install..."; \
		yarn --frozen-lockfile; \
	fi

run: ## run the demo
	@yarn run-demo

run-prod: ## run the demo in prod
	@yarn run-demo-prod

build-demo: ## compile the demo to static js
	@yarn build-demo

build-ra-appwrite:
	@echo "Transpiling ra-appwrite files...";
	@cd ./packages/ra-appwrite && yarn build

build: build-ra-appwrite

lint: ## lint the code and check coding conventions
	@echo "Running linter..."
	@yarn lint

prettier: ## prettify the source code using prettier
	@echo "Running prettier..."
	@yarn prettier

test: build test-unit lint ## launch all tests

test-unit: ## launch unit tests
	@echo "Running unit tests...";
	@yarn test-unit;

test-unit-watch: ## launch unit tests and watch for changes
	@echo "Running unit tests..."; 
	@yarn test-unit --watch;
