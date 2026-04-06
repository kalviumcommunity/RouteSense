@echo off
setlocal

echo =======================================================
echo     RouteSense Pro: Full-Stack Application Support
echo =======================================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install it to run the Frontend.
    pause
    exit /b
)

:: Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed. Please install it to run the Backend.
    pause
    exit /b
)

:: Install Frontend Dependencies if node_modules is missing
if not exist "node_modules" (
    echo [INFO] Installing Frontend Dependencies...
    call npm install
)

:: Install Backend Dependencies
if not exist "venv" (
    echo [INFO] Creating Python Virtual Environment...
    python -m venv venv
)

echo [INFO] Activating VENV and installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo =======================================================
echo [SUCCESS] Everything is set up correctly. 
echo.
echo Starting Backend (Flask) on Port 5000...
echo Starting Frontend (Vite) on Port 5173...
echo.
echo YOU MUST VISIT: http://localhost:5173 
echo =======================================================
echo.

:: Start the Backend in a new window
start "RouteSense Backend" cmd /c "call venv\Scripts\activate.bat && python app.py"

:: Start the Frontend in the current window
npm run dev

pause
