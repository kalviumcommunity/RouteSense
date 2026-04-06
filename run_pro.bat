@echo off
echo =======================================================
echo 🚀 RouteSense Pro: System Startup Initialized 🚀
echo =======================================================
echo.

:: Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js not found. Please install Node.js!
    pause
    exit /b
)

:: Start Backend (Express + Socket.io) in new window
echo [SYSTEM] Launching Real-Time Intelligence Backend...
start cmd /k "npm run server"

:: Start Frontend (React + Vite)
echo [SYSTEM] Compiling High-Fidelity Dashboard Interface...
echo [SYSTEM] You will be redirected to the dashboard shortly.
echo.
npm run dev

pause
