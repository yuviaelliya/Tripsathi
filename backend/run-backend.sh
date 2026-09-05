#!/usr/bin/env bash
# TripSathi Java Spring Boot 3 Engine Launcher (Linux/macOS)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "========================================================"
echo "  TripSathi Java Spring Boot 3 Engine Launcher (Linux/macOS)"
echo "========================================================"

if [ -f "$DIR/mvnw" ]; then
    chmod +x "$DIR/mvnw"
    "$DIR/mvnw" spring-boot:run
else
    mvn spring-boot:run
fi
