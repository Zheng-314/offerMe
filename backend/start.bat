@echo off
echo Starting backend...
cd /d "%~dp0"
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
pause
