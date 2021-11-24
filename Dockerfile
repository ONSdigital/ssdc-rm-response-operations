FROM openjdk:17-slim
CMD ["/usr/local/openjdk-17/bin/java", "-jar", "/opt/ssdc-rm-response-operations.jar"]

RUN groupadd --gid 999 response-operations && \
    useradd --create-home --system --uid 999 --gid response-operations response-operations

RUN apt-get update && \
apt-get -yq install curl && \
apt-get -yq clean && \
rm -rf /var/lib/apt/lists/*

USER response-operations

ARG JAR_FILE=ssdc-rm-response-operations*.jar
COPY target/$JAR_FILE /opt/ssdc-rm-response-operations.jar
