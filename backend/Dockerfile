# Stage 1: Build Java Spring Boot Application with Maven Wrapper
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copy Maven Wrapper and pom.xml
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Download dependencies (cached layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code and build final jar
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime Container
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy compiled jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 4000

# Run Spring Boot Application
ENTRYPOINT ["java", "-jar", "app.jar"]
