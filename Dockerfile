FROM eclipse-temurin:17-jdk-alpine

CMD ["java", "-jar", "/opt/ssdc-rm-response-operations.jar"]

RUN addgroup --gid 1000 response-operations && \
    adduser --system --uid 1000 response-operations response-operations
USER response-operations

COPY target/ssdc-rm-response-operations*.jar /opt/ssdc-rm-response-operations.jar
