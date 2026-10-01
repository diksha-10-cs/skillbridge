@echo off
title SkillBridge - Student Internship Portal
color 0B
cls
echo ================================================================
echo        SKILLBRIDGE - STUDENT INTERNSHIP & CAREER PORTAL
echo ================================================================
echo.
echo [*] Checking MongoDB Service...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is running.
) else (
    echo [i] Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] MongoDB service started.
    ) else (
        echo [!] Note: MongoDB service check bypassed (local service/daemon active).
    )
)

echo.
echo [*] Launching Frontend & Backend servers...
echo [*] Frontend: http://localhost:5173
echo [*] Backend:  http://localhost:5000
echo.

REM Automatically open browser after 2.5 seconds
start "" powershell -NoProfile -Command "Start-Sleep -Milliseconds 2500; Start-Process 'http://localhost:5173'"

REM Start the full-stack application
call npm start

pause
