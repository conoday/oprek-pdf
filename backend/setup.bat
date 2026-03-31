@echo off
echo [OprekPDF] Setting up Python backend...
python -m venv .venv
call .venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
echo.
echo [OprekPDF] Setup complete!
echo Run: uvicorn app.main:app --reload --port 8000
