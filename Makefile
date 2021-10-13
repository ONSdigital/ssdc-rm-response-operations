test:
	mvn clean verify jacoco:report

build:
	./build.sh

build_no_test:
    ./build_no_test.sh

test-ui:
	cd ui && npm install && npm test -- --watchAll=false

run-dev-api: build
	docker run -e spring_profiles_active=docker --network=ssdcrmdockerdev_default --link ons-postgres:postgres -p 7777:7777 eu.gcr.io/ssdc-rm-ci/rm/ssdc-rm-response-operations:latest

run-dev-ui:
	cd ui && npm install && npm start

format-check-mvn:
	mvn fmt:check

format-check-ui:
	$(MAKE) -C ui format-check

format-check: format-check-mvn format-check-ui

format-mvn:
	mvn fmt:format

format-ui:
	$(MAKE) -C ui format

format: format-mvn format-ui
