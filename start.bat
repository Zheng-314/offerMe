@echo off
echo Starting backend...
start cmd /k "cd backend && start.bat"
timeout /t 5 /nobreak
echo Starting frontend...
npm run dev
pause
