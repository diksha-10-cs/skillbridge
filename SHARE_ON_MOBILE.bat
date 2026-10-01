@echo off
title SkillBridge - Mobile Sharing & Public Tunnel
color 0A
cls
echo ================================================================
echo        SKILLBRIDGE - SHARE ON MOBILE (WITHOUT GITHUB)
echo ================================================================
echo.
echo NOTE: Make sure your app is already running via RUN_PROJECT.bat!
echo.
echo Choose how you want to share with your mentor:
echo [1] Instant Public Web Link (Pinggy - Works anywhere on any phone)
echo [2] Instant Public Web Link (Localtunnel - npx localtunnel)
echo [3] Same Wi-Fi / Hotspot Network IP Guide
echo.
set /p choice="Enter choice (1, 2, or 3): "

if "%choice%"=="1" (
    echo.
    echo [*] Starting secure tunnel for port 5173 via Pinggy...
    echo [*] Open the 'https://....a.pinggy.link' URL on your mobile phone!
    echo [*] (Press Ctrl+C to stop sharing when done)
    echo.
    ssh -p 443 -R0:localhost:5173 a.pinggy.io
) else if "%choice%"=="2" (
    echo.
    echo [*] Your Localtunnel password (IP) is:
    curl -s https://loca.lt/mytunnelpassword
    echo.
    echo [*] Starting Localtunnel on port 5173...
    echo [*] (Press Ctrl+C to stop sharing when done)
    echo.
    npx localtunnel --port 5173
) else (
    echo.
    echo ================================================================
    echo        SAME WI-FI / MOBILE HOTSPOT INSTRUCTIONS
    echo ================================================================
    echo 1. Connect your laptop to your phone's Wi-Fi hotspot (or same Wi-Fi router).
    echo 2. Run RUN_PROJECT.bat in this folder.
    echo 3. Look at the terminal window. Vite will display:
    echo        - Local:   http://localhost:5173/
    echo        - Network: http://192.168.X.X:5173/
    echo 4. Open that 'Network' link in your phone's browser (Chrome/Safari).
    echo    The complete website with live database and backend will load!
    echo.
    pause
)
