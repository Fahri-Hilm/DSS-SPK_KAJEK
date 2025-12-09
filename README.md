# 🚀 SPK Pemilihan Server Cloud Terbaik - PT Kajek Indonesia

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red.svg)](https://streamlit.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Sistem Pendukung Keputusan (SPK) untuk memilih server cloud VPS terbaik menggunakan metode **TOPSIS** (Technique for Order Preference by Similarity to Ideal Solution) dengan dashboard interaktif modern.

![Dashboard Preview](https://via.placeholder.com/800x400/1a1f2e/e2e8f0?text=TOPSIS+Dashboard)

## ✨ Fitur Utama

- 🎨 **Modern UI/UX** - Soft dark theme yang nyaman untuk mata
- 📊 **Interactive Charts** - Visualisasi dengan Plotly (bar, heatmap, radar)
- 🔄 **2-Way Integration** - Edit data di dashboard atau Excel
- ⚙️ **Dynamic Weights** - Adjust bobot kriteria real-time
- 📱 **Responsive** - Optimal di semua device
- 📥 **Export** - Download hasil ke CSV
- 💾 **Auto-Save** - Perubahan tersimpan otomatis ke Excel

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Fahri-Hilm/SPK-Kajek.git
cd SPK-Kajek
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Dashboard
```bash
./run_dashboard.sh
```
atau
```bash
streamlit run dashboard.py
```

### 4. Akses Dashboard
Buka browser: **http://localhost:8501**

## 📊 Data Source

Dashboard terintegrasi penuh dengan **TOPSIS_Input_Level.xlsx**:
- Sheet: **1. Input Level**
- Format: Level 1-5 untuk setiap kriteria
- Auto-convert ke nilai standar

## 🎯 Kriteria & Level

### 1. **CPU (BENEFIT)** - Bobot: 25%
| Level | Range | Nilai Standar |
|-------|-------|---------------|
| ⭐ | 1-2 Core | 2 |
| ⭐⭐ | 3-4 Core | 4 |
| ⭐⭐⭐ | 5-6 Core | 6 |
| ⭐⭐⭐⭐ | 7-8 Core | 8 |
| ⭐⭐⭐⭐⭐ | 9+ Core | 10 |

### 2. **RAM (BENEFIT)** - Bobot: 25%
| Level | Range | Nilai Standar |
|-------|-------|---------------|
| ⭐ | 1-2 GB | 2 |
| ⭐⭐ | 3-4 GB | 4 |
| ⭐⭐⭐ | 5-8 GB | 8 |
| ⭐⭐⭐⭐ | 9-16 GB | 16 |
| ⭐⭐⭐⭐⭐ | 17+ GB | 32 |

### 3. **Disk I/O (BENEFIT)** - Bobot: 25%
| Level | Range | Nilai Standar |
|-------|-------|---------------|
| ⭐ | 100-200 MB/s | 150 |
| ⭐⭐ | 201-400 MB/s | 300 |
| ⭐⭐⭐ | 401-600 MB/s | 500 |
| ⭐⭐⭐⭐ | 601-800 MB/s | 700 |
| ⭐⭐⭐⭐⭐ | 801+ MB/s | 1000 |

### 4. **Harga (COST)** - Bobot: 25%
| Level | Range | Nilai Standar |
|-------|-------|---------------|
| 💰 | $5-$20 | 15 |
| 💰💰 | $21-$50 | 35 |
| 💰💰💰 | $51-$100 | 75 |
| 💰💰💰💰 | $101-$200 | 150 |
| 💰💰💰💰💰 | $201+ | 250 |

## 📊 Dashboard Tabs

### 1. 📊 Ranking & Visualisasi
- Top 10 bar chart dengan score
- Heatmap perbandingan kriteria
- Radar chart top 5 providers

### 2. 🧮 Perhitungan TOPSIS
- Matriks keputusan
- Normalisasi & pembobotan
- Solusi ideal (A+ & A-)
- Jarak Euclidean & score

### 3. 📋 Parameter Level
- Panduan level 1-5 untuk setiap kriteria
- Tabel konversi level ke nilai

### 4. ✏️ Edit Data (2-Way Integration)
- Edit data langsung di dashboard
- Auto-save ke Excel
- Reload data dari Excel
- Preview perubahan real-time

### 5. 📁 Data Lengkap
- Tabel lengkap semua alternatif
- Export ke CSV
- Summary metrics

## 🔄 Integrasi 2-Way

### Excel → Dashboard
```bash
1. Edit TOPSIS_Input_Level.xlsx
2. Save (Ctrl+S)
3. Dashboard → Tab 4 → "🔄 Reload Data"
```

### Dashboard → Excel
```bash
1. Dashboard → Tab 4
2. Pilih vendor
3. Edit level (1-5)
4. Klik "💾 Simpan ke Excel"
```

## 🎓 Metode TOPSIS

TOPSIS memilih alternatif terbaik berdasarkan:
1. Jarak terdekat ke solusi ideal positif (A⁺)
2. Jarak terjauh dari solusi ideal negatif (A⁻)

**Formula Score:**
```
Score = D⁻ / (D⁺ + D⁻)
```

Dimana:
- `D⁺` = Jarak ke solusi ideal positif
- `D⁻` = Jarak ke solusi ideal negatif

## 📁 Struktur Project

```
SPK-Kajek/
├── dashboard.py                    # Dashboard utama
├── topsis_spk.py                   # Script Python TOPSIS
├── TOPSIS_Input_Level.xlsx         # Data input (Level 1-5)
├── requirements.txt                # Dependencies
├── run_dashboard.sh                # Script runner
├── README.md                       # Dokumentasi utama
├── DASHBOARD_README.md             # Dokumentasi dashboard
├── QUICKSTART.md                   # Panduan cepat
├── FITUR_EDIT_2WAY.md             # Dokumentasi edit 2-way
├── VERIFIKASI_INTEGRASI.md        # Verifikasi integrasi Excel
└── COMPARISON.md                   # Perbandingan fitur
```

## 🏆 Tech Stack

- **Frontend**: Streamlit + Custom CSS
- **Charts**: Plotly (interactive)
- **Data**: Pandas + NumPy + openpyxl
- **Styling**: Soft Dark Theme
- **Fonts**: Google Fonts (Inter)

## 💡 Tips Penggunaan

1. **Adjust Bobot** - Gunakan sidebar untuk mengubah prioritas kriteria
2. **Explore Charts** - Hover pada chart untuk detail
3. **Edit Data** - Ubah level di Tab 4 (dashboard atau Excel)
4. **Export** - Download hasil di Tab 5
5. **Reload** - Refresh data kapan saja

## 📚 Dokumentasi Lengkap

- [Dashboard Detail](DASHBOARD_README.md)
- [Quick Start](QUICKSTART.md)
- [Fitur Edit 2-Way](FITUR_EDIT_2WAY.md)
- [Verifikasi Integrasi](VERIFIKASI_INTEGRASI.md)
- [Comparison](COMPARISON.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**PT Kajek Indonesia**  
Sistem Pendukung Keputusan - 2025

## 📧 Contact

- GitHub: [@Fahri-Hilm](https://github.com/Fahri-Hilm)
- Repository: [SPK-Kajek](https://github.com/Fahri-Hilm/SPK-Kajek)

---

*Dibuat dengan ❤️ menggunakan Python, Streamlit, Plotly & Modern UI/UX Design*

**Dashboard siap untuk presentasi dan production! 🚀✨**


