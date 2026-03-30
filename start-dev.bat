@echo off
echo Stopping any existing Node processes on port 3002...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Next.js dev server...
echo.
echo Access at: http://localhost:3002
echo.
npm run dev
