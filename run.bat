@echo off
echo Starting RouteSense Application...
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed or not in the system PATH.
    echo Please install Python from https://www.python.org/downloads/
    pause
    exit /b
)

:: Check for virtual environment, create if missing
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate the virtual environment
call venv\Scripts\activate.bat

:: Install the requirements
echo Installing requirements...
pip install -r requirements.txt

:: Run the application
echo.
echo =======================================================
echo.
echo RouteSense AI Engine Starting...
echo You can view the application by opening the URL below.
echo.
echo =======================================================
python app.py

pause
