#!/usr/bin/env bash
set -e
echo "[OprekPDF] Setting up Python backend..."
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo ""
echo "[OprekPDF] Setup complete!"
echo "Run: uvicorn app.main:app --reload --port 8000"
