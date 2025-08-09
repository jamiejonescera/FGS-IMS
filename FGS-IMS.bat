@echo off
title 📦 FGS-IMS Logistics Management System
color 0A
cls

echo.
echo ████████╗ ██████╗ ███████╗      ██╗ ███╗   ███╗ ███████╗
echo ██╔════╝██╔════╝ ██╔════╝      ██║ ████╗ ████║ ██╔════╝
echo █████╗  ██║  ███╗███████╗█████╗██║ ██╔████╔██║ ███████╗
echo ██╔══╝  ██║   ██║╚════██║╚════╝██║ ██║╚██╔╝██║ ╚════██║
echo ██║     ╚██████╔╝███████║      ██║ ██║ ╚═╝ ██║ ███████║
echo ╚═╝      ╚═════╝ ╚══════╝      ╚═╝ ╚═╝     ╚═╝ ╚══════╝
echo.
echo              🚀 Starting Logistics Management System...
echo.

:: Navigate to your project directory
cd /d "D:\Projects\Flordegrace-main"

:: Check if project exists
if not exist "backend\app.py" (
    echo ❌ Error: Project not found at D:\Projects\Flordegrace-main
    echo    Please update the path in this batch file
    pause
    exit
)

:: Check if virtual environment exists
if not exist "backend\venv\Scripts\activate.bat" (
    echo ❌ Error: Virtual environment not found
    echo    Please ensure venv is set up in backend folder
    pause
    exit
)

:: Start Flask Backend
echo 🔧 Starting Backend Server...
start "🔧 Flask Backend Server" cmd /k "cd /d D:\Projects\Flordegrace-main\backend && venv\Scripts\activate && echo ✅ Virtual environment activated && python app.py"

:: Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

:: Start React Frontend
echo 🎨 Starting Frontend...
start "🎨 React Frontend" cmd /k "cd /d D:\Projects\Flordegrace-main\frontend && echo ✅ Starting React development server... && npm run dev"

:: Wait for frontend to start
echo ⏳ Waiting for frontend to start...
timeout /t 10 /nobreak > nul

:: Open browser
echo 🌐 Opening application in browser...
timeout /t 3 /nobreak > nul
start http://localhost:3002

:: Show success message
echo.
echo ========================================
echo ✅ FGS-IMS Application Started!
echo ========================================
echo 🔧 Backend:  http://localhost:5000
echo 🎨 Frontend: http://localhost:3002
echo 🌐 Opening:  http://localhost:3002
echo ========================================
echo.
echo 💡 Tips:
echo    - The application is now running
echo    - Close this window to keep apps running
echo    - Use Ctrl+C in server windows to stop
echo ========================================
echo.
echo Press any key to close this launcher...
pause > nul