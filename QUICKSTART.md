# 🚀 QUICK START GUIDE# 🚀 QUICK START GUIDE



Panduan cepat untuk menjalankan SPK Kajek - Sistem Pendukung Keputusan Pemilihan VPS Cloud.## 📦 Installation (One-time)



## 📋 Prerequisites```bash

# 1. Install dependencies

Pastikan sudah terinstall:pip install -r requirements.txt

- **Node.js** 18+ dan npm```

- **Python** 3.8+

- **pip** (Python package manager)## 🎯 Run Dashboard



## ⚡ Installation (One-time Setup)### Option 1: Easy Script (Recommended)

```bash

### 1. Clone Repository./run_dashboard.sh

```bash```

git clone https://github.com/Fahri-Hilm/DSS-SPK_KAJEK.git

cd DSS-SPK_KAJEK### Option 2: Direct Command

``````bash

streamlit run dashboard_new.py

### 2. Setup Backend (FastAPI)```

```bash

cd backend### Option 3: Custom Port

```bash

# Create virtual environmentstreamlit run dashboard_new.py --server.port 8080

python -m venv venv```



# Activate virtual environment## 🌐 Access Dashboard

source venv/bin/activate  # Linux/Mac

# atauOpen browser and go to:

venv\Scripts\activate     # Windows```

http://localhost:8501

# Install dependencies```

pip install -r requirements.txt

```## 🎨 What You'll See



### 3. Setup Frontend (React + Vite)### 1. Hero Section

```bash- Big title with gradient

cd frontend- Subtitle with info

npm install

```### 2. Winner Card (Premium)

- 🏆 Best recommendation

## 🎯 Run Application- Gold badge

- 4 stats (CPU, RAM, Disk I/O, Harga)

### Option 1: Using Start Script (Recommended)- TOPSIS Score

```bash

./start.sh### 3. Sidebar (Left)

```- ⚙️ Adjust weights

- 4 sliders (CPU, RAM, Disk I/O, Harga)

### Option 2: Manual Start (2 Terminals)- Real-time validation

- Dataset info

**Terminal 1 - Backend:**

```bash### 4. Main Content (5 Tabs)

cd backend

source venv/bin/activate#### Tab 1: 📊 Ranking & Visualisasi

uvicorn main:app --reload --port 8000- Top 10 bar chart

```- Heatmap top 10

- Radar chart top 5

**Terminal 2 - Frontend:**- Scatter plot (harga vs score)

```bash- Pie chart (bobot)

cd frontend

npm run dev#### Tab 2: 🧮 Perhitungan TOPSIS

```- Step-by-step calculation

- All matrices

### Option 3: Custom Ports- Ideal solutions

```bash- Distances & scores

# Backend dengan port custom

uvicorn main:app --reload --port 9000#### Tab 3: 📋 Parameter Level

- Level guidelines (1-5)

# Frontend dengan port custom- Distribution charts

npm run dev -- --port 3000

```#### Tab 4: ✏️ Edit Data

- Edit existing alternatives

## 🌐 Access Application- Add new alternatives

- Preview & actions

| Service | URL |

|---------|-----|#### Tab 5: 📁 Data Lengkap

| **Frontend** | http://localhost:5173 |- Full data table

| **Backend API** | http://localhost:8000 |- Export to CSV

| **API Documentation** | http://localhost:8000/docs |- Summary metrics

| **ReDoc** | http://localhost:8000/redoc |

## 💡 Quick Tips

## 🔐 Login Credentials

1. **Adjust Weights**: Use sidebar sliders

Default admin account:2. **Explore Charts**: Hover for details

- **Username**: `admin`3. **Edit Data**: Go to Tab 4

- **Password**: `admin123`4. **Export Results**: Download CSV in Tab 5

5. **Reset Data**: Button in Tab 4

## 🎨 What You'll See

## 🎨 Features to Try

### 1. Login Page

- Modern glassmorphism login form### Interactive Charts

- JWT-based authentication- Hover on any chart point

- Zoom in/out (scroll)

### 2. Dashboard (Home)- Pan (click & drag)

- Statistics overview- Download chart (camera icon)

- Top vendors preview

- Interactive hero section### Weight Adjustment

- Scrollytelling guide- Change CPU weight → See ranking change

- Try different combinations

### 3. Sidebar Navigation- Total must = 1.0

- 🏠 Dashboard

- 📈 Analysis (TOPSIS)### Data Management

- 🧮 Calculation Details- Edit any alternative

- 📋 Data Management- Add new cloud provider

- 📜 History- Reset to original data

- ⚙️ Settings

- 📖 Documentation## 🐛 Troubleshooting



### 4. Analysis Page### Port Already in Use

- Weight sliders (CPU, RAM, Disk I/O, Harga)```bash

- Run TOPSIS calculationstreamlit run dashboard_new.py --server.port 8502

- Top 10 recommendations```

- Bar & Radar charts

### Module Not Found

### 5. Calculation Page```bash

- Step-by-step TOPSIS processpip install -r requirements.txt --upgrade

- All matrices displayed```

- Ideal solutions

- Distance calculations### Browser Not Opening

- Final rankingManually open: `http://localhost:8501`



### 6. Data Page### Data Not Updating

- Full vendor data tableClick "Reset ke Data Awal" in Tab 4

- Add new vendor

- Edit/Delete existing## 📱 Mobile Access

- Export to CSV

If running on server:

### 7. History Page```bash

- Past calculationsstreamlit run dashboard_new.py --server.address 0.0.0.0

- Trend analysis```

- Compare results

Access from mobile:

### 8. Settings Page```

- Profile managementhttp://YOUR_IP:8501

- Change password```



## 💡 Quick Tips## ⌨️ Keyboard Shortcuts



### Weight Adjustment- `Ctrl + C` - Stop dashboard

1. Go to **Analysis** page- `R` - Rerun app

2. Use sliders to adjust weights- `C` - Clear cache

3. Total must equal **100%**- `?` - Show shortcuts

4. Click **"Jalankan Analisa"** to calculate

## 🎯 First Time Checklist

### View Calculation Details

1. Run analysis first- [ ] Install dependencies

2. Go to **Calculation** page- [ ] Run dashboard

3. See step-by-step TOPSIS process- [ ] Open in browser

- [ ] Explore all 5 tabs

### Add New Vendor- [ ] Try adjusting weights

1. Go to **Data** page- [ ] Edit some data

2. Click **"Tambah Vendor"**- [ ] Export CSV

3. Fill in all fields- [ ] Check mobile view

4. Click **"Simpan"**

## 🏆 Pro Mode

### Export Results

1. Run analysis### Custom Theme

2. Click **"Export PDF"** buttonEdit `.streamlit/config.toml`:

3. PDF will be downloaded```toml

[theme]

### View HistoryprimaryColor = "#667eea"

1. Go to **History** pagebackgroundColor = "#0f172a"

2. See all past calculationssecondaryBackgroundColor = "#1e293b"

3. Click any entry to view detailstextColor = "#f8fafc"

font = "sans serif"

## 🛠️ Troubleshooting```



### Backend tidak jalan### Performance Boost

```bash```bash

# Pastikan virtual environment aktifstreamlit run dashboard_new.py --server.runOnSave true --server.maxUploadSize 200

source backend/venv/bin/activate```



# Cek port 8000 tidak digunakan## 📚 Documentation

lsof -i :8000

- **Full Docs**: `DASHBOARD_README.md`

# Kill process jika perlu- **Comparison**: `COMPARISON.md`

kill -9 <PID>- **Summary**: `SUMMARY.md`

```- **Main README**: `README.md`



### Frontend tidak jalan## 🆘 Need Help?

```bash

# Pastikan dependencies terinstall1. Check documentation files

cd frontend && npm install2. Read error messages

3. Check console output

# Cek port 5173 tidak digunakan4. Verify data file exists

lsof -i :5173

```## 🎉 Enjoy!



### CORS ErrorYou're all set! Explore the dashboard and have fun with the data visualization! 🚀

- Pastikan backend berjalan di port 8000

- Cek `main.py` CORS settings---



### Login gagal**Happy Analyzing! 📊✨**

- Cek `backend/users.json` exists
- Default: admin/admin123

## 📁 Project Files

```
SPK-Kajek/
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── services/   # API Client
│   │   └── context/    # React Context
│   └── package.json
├── backend/            # FastAPI Server
│   ├── main.py         # API Endpoints
│   ├── topsis_service.py
│   └── requirements.txt
├── start.sh            # Startup Script
└── README.md
```

## 🔗 Useful Links

- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

Happy analyzing! 🎉
