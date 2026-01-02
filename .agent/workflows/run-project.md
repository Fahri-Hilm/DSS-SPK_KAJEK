---
description: Menjalankan dashboard SPK-Kajek (backend + frontend)
---

# Menjalankan Project SPK-Kajek

Project ini memiliki 2 komponen yang harus dijalankan bersamaan:

## 1. Jalankan Backend (FastAPI)

// turbo
```bash
cd /home/fj/Desktop/PROJECT/SPK-Kajek/backend && source venv/bin/activate && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di: http://localhost:8000/

## 2. Jalankan Frontend (Vite + React)

// turbo
```bash
cd /home/fj/Desktop/PROJECT/SPK-Kajek/frontend && npm run dev
```

Frontend akan berjalan di: http://localhost:5173/

## Catatan Penting

- Backend harus dijalankan terlebih dahulu sebelum frontend agar API tersedia
- Virtual environment Python sudah ada di `backend/venv/`
- Jika dependencies belum terinstall, jalankan:
  - Backend: `cd backend && source venv/bin/activate && pip install -r requirements.txt`
  - Frontend: `cd frontend && npm install`
