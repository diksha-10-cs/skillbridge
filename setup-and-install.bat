@echo off
title SkillBridge Setup & Installer
echo ========================================================
echo        SKILLBRIDGE DEPENDENCY INSTALLER
echo ========================================================
echo.
echo Installing root, backend, and frontend packages...
echo.
call npm install
cd backend
call npm install
cd ../frontend
call npm install
cd ..
echo.
echo ========================================================
echo        ALL DEPENDENCIES INSTALLED SUCCESSFULLY!
echo ========================================================
echo You can now run start-app.bat to launch SkillBridge.
echo.
pause
