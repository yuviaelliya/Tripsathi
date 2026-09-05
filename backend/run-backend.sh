#!/usr/bin/env bash
# TripSathi Java Spring Boot 3 Engine Launcher (Linux/macOS)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "========================================================"
echo "  TripSathi Java Spring Boot 3 Engine Launcher"
echo "========================================================"

# Check if user requested H2 mode via argument e.g. ./run-backend.sh --h2
if [ "$1" == "--h2" ]; then
    echo "Running with H2 In-Memory Database profile..."
    if [ -f "$DIR/mvnw" ]; then
        chmod +x "$DIR/mvnw"
        "$DIR/mvnw" spring-boot:run -Dspring-boot.run.profiles=h2
    else
        mvn spring-boot:run -Dspring-boot.run.profiles=h2
    fi
else
    echo "Running with MySQL Database (Default)..."
    if [ -f "$DIR/mvnw" ]; then
        chmod +x "$DIR/mvnw"
        "$DIR/mvnw" spring-boot:run
    else
        mvn spring-boot:run
    fi
fi
