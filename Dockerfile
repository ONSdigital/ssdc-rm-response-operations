FROM eclipse-temurin:17-jdk-alpine

CMD ["/opt/java/openjdk/bin/java", "-jar", "/opt/ssdc-rm-response-operations.jar"]

RUN addgroup --gid 1000 response-operations && \
    adduser --system --uid 1000 response-operations response-operations
USER response-operations

ARG JAR_FILE=ssdc-rm-response-operations*.jar

COPY target/$JAR_FILE /opt/ssdc-rm-response-operations.jar
