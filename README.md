# 🚀 SPK Pemilihan Server Cloud Terbaik PT Kajek Indonesia

Sistem Pendukung Keputusan (SPK) untuk memilih server cloud VPS terbaik menggunakan metode **TOPSIS** (Technique for Order Preference by Similarity to Ideal Solution).

## 📊 Dashboard Modern

Dashboard interaktif dengan **Glassmorphism Design** yang modern dan profesional.

### ✨ Fitur Dashboard:
- 🎨 **Modern UI/UX** - Glassmorphism + Gradient design
- 📊 **Interactive Charts** - 6+ jenis visualisasi dengan Plotly
- ⚙️ **Dynamic Weights** - Adjust bobot kriteria real-time
- ✏️ **Data Management** - Edit & tambah alternatif
- 📱 **Responsive** - Optimal di semua device
- 📥 **Export** - Download hasil ke CSV

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Dashboard
```bash
./run_dashboard.sh
```
atau
```bash
streamlit run dashboard.py
```

### 3. Akses Dashboard
Buka browser: **http://localhost:8501**

## 📋 Data Source

Dashboard membaca data dari **TOPSIS_Input_Level.xlsx**:
- Sheet: **1. Input Level**
- Format: Level 1-5 untuk setiap kriteria
- Auto-convert ke nilai standar

## 🎯 Kriteria & Level

### 1. **CPU (Core)** - BENEFIT | Bobot: 25%
- Level 1: 1-2 Core → Nilai: 2
- Level 2: 3-4 Core → Nilai: 4
- Level 3: 5-6 Core → Nilai: 6
- Level 4: 7-8 Core → Nilai: 8
- Level 5: 9+ Core → Nilai: 10

### 2. **RAM (GB)** - BENEFIT | Bobot: 25%
- Level 1: 1-2 GB → Nilai: 2
- Level 2: 3-4 GB → Nilai: 4
- Level 3: 5-8 GB → Nilai: 8
- Level 4: 9-16 GB → Nilai: 16
- Level 5: 17+ GB → Nilai: 32

### 3. **Disk I/O Speed (MB/s)** - BENEFIT | Bobot: 25%
- Level 1: 100-200 MB/s → Nilai: 150
- Level 2: 201-400 MB/s → Nilai: 300
- Level 3: 401-600 MB/s → Nilai: 500
- Level 4: 601-800 MB/s → Nilai: 700
- Level 5: 801+ MB/s → Nilai: 1000

### 4. **Harga/Bulan (USD)** - COST | Bobot: 25%
- Level 1: $5-$20 → Nilai: 15
- Level 2: $21-$50 → Nilai: 35
- Level 3: $51-$100 → Nilai: 75
- Level 4: $101-$200 → Nilai: 150
- Level 5: $201+ → Nilai: 250

## 📊 Dashboard Tabs

### Tab 1: 📊 Ranking & Visualisasi
- Top 10 bar chart
- Heatmap top 10
- Radar chart top 5
- Scatter plot (harga vs score)
- Pie chart (distribusi bobot)

### Tab 2: 🧮 Perhitungan TOPSIS
- Matriks keputusan
- Normalisasi
- Pembobotan
- Solusi ideal
- Jarak & score

### Tab 3: 📋 Parameter Level
- Panduan level 1-5
- Distribusi level
- Bar charts per kriteria

### Tab 4: ✏️ Edit Data
- Edit alternatif existing
- Tambah alternatif baru
- Preview & reset

### Tab 5: 📁 Data Lengkap
- Tabel lengkap semua alternatif
- Export ke CSV
- Summary metrics

## 🎨 Design Features

- **Glassmorphism** - Backdrop blur effects
- **Gradient Background** - Purple gradient
- **Animated Winner Card** - Rotating gradient
- **Interactive Charts** - Hover, zoom, pan
- **Micro-interactions** - Smooth transitions
- **Responsive Layout** - Mobile-friendly

## 📁 Struktur File

```
SPK-kajek/
├── dashboard.py                    # Dashboard utama (MODERN)
├── topsis_spk.py                   # Script Python TOPSIS
├── TOPSIS_Input_Level.xlsx         # Data input (LEVEL 1-5)
├── requirements.txt                # Dependencies
├── run_dashboard.sh                # Script runner
├── README.md                       # Dokumentasi ini
├── DASHBOARD_README.md             # Dokumentasi dashboard detail
├── QUICKSTART.md                   # Panduan cepat
├── COMPARISON.md                   # Perbandingan fitur
└── SUMMARY.md                      # Summary project
```

## 🎓 Metode TOPSIS

TOPSIS memilih alternatif terbaik berdasarkan:
1. Jarak terdekat ke solusi ideal positif (A⁺)
2. Jarak terjauh dari solusi ideal negatif (A⁻)

**Formula Score:**
```
Score = D⁻ / (D⁺ + D⁻)
```

## 💡 Tips Penggunaan

1. **Adjust Bobot** - Gunakan sidebar untuk mengubah prioritas
2. **Explore Charts** - Hover pada chart untuk detail
3. **Edit Data** - Ubah level di Tab 4
4. **Export** - Download hasil di Tab 5
5. **Reset** - Kembali ke data awal kapan saja

## 📚 Dokumentasi Lengkap

- **Dashboard Detail**: `DASHBOARD_README.md`
- **Quick Start**: `QUICKSTART.md`
- **Comparison**: `COMPARISON.md`
- **Summary**: `SUMMARY.md`
- **Kriteria Level**: `KRITERIA_LEVEL.md`

## 🏆 Tech Stack

- **Frontend**: Streamlit + Custom CSS
- **Charts**: Plotly (interactive)
- **Data**: Pandas + NumPy + openpyxl
- **Styling**: CSS3 Glassmorphism
- **Fonts**: Google Fonts (Inter)

## 👨‍💻 Developer

**PT Kajek Indonesia**  
Sistem Pendukung Keputusan - 2025

---

*Dibuat dengan ❤️ menggunakan Python, Streamlit, Plotly & Modern UI/UX Design*

**Dashboard siap untuk presentasi dan production! 🚀✨**

