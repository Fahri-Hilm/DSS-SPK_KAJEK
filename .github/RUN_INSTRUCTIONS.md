# SPK Kajek - Project Run Instructions

## Quick Reference

### 🚀 How to Run
```bash
./start.sh
```

### 📍 Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 🔐 Login
- **Username**: admin
- **Password**: admin123

### 🛠️ Manual Run (if start.sh fails)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 📦 First Time Setup
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Frontend
cd frontend && npm install
```
