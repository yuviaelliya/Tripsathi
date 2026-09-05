@echo off
setlocal
set "DIR=%~dp0"
cd /d "%DIR%"

echo ========================================================
echo   TripSathi Java Spring Boot 3 Engine Launcher (Windows)
echo ========================================================

if exist "%DIR%mvnw.cmd" (
    call "%DIR%mvnw.cmd" spring-boot:run
) else (
    call mvn spring-boot:run
)
endlocal
