# 📊 DEFINISI KRITERIA DAN LEVEL
## SPK Pemilihan Server Cloud Terbaik PT Kajek Indonesia

---

## 🎯 4 KRITERIA UTAMA

### 1. **CPU (Core)** - BENEFIT | Bobot: 25%
Semakin tinggi jumlah CPU core, semakin baik performa server.

| Level | Range | Kategori |
|-------|-------|----------|
| 1 | 1-2 Core | Sangat Rendah |
| 2 | 3-4 Core | Rendah |
| 3 | 5-6 Core | Sedang |
| 4 | 7-8 Core | Tinggi |
| 5 | 9+ Core | Sangat Tinggi |

---

### 2. **RAM (GB)** - BENEFIT | Bobot: 25%
Semakin besar kapasitas RAM, semakin baik untuk menjalankan aplikasi.

| Level | Range | Kategori |
|-------|-------|----------|
| 1 | 1-2 GB | Sangat Rendah |
| 2 | 3-4 GB | Rendah |
| 3 | 5-8 GB | Sedang |
| 4 | 9-16 GB | Tinggi |
| 5 | 17+ GB | Sangat Tinggi |

---

### 3. **Disk I/O Speed (MB/s)** - BENEFIT | Bobot: 25%
Kecepatan baca/tulis disk yang lebih tinggi meningkatkan performa I/O.

| Level | Range | Kategori |
|-------|-------|----------|
| 1 | 100-200 MB/s | Sangat Rendah |
| 2 | 201-400 MB/s | Rendah |
| 3 | 401-600 MB/s | Sedang |
| 4 | 601-800 MB/s | Tinggi |
| 5 | 801+ MB/s | Sangat Tinggi |

**Catatan:** Disk I/O Speed dihitung dari bandwidth jaringan (Gbps/Mbps) dibagi 8 untuk mendapatkan MB/s.

---

### 4. **Harga/Bulan (USD)** - COST | Bobot: 25%
Semakin rendah harga, semakin baik (cost-effective).

| Level | Range | Kategori |
|-------|-------|----------|
| 1 | $5-$20 | Sangat Murah |
| 2 | $21-$50 | Murah |
| 3 | $51-$100 | Sedang |
| 4 | $101-$200 | Mahal |
| 5 | $201+ | Sangat Mahal |

---

## 📐 METODE TOPSIS

### Formula Normalisasi:
```
X_norm = X / √(Σ X²)
```

### Formula Pembobotan:
```
X_weighted = X_norm × Weight
```

### Solusi Ideal:
- **Ideal Positif (A+)**: Max untuk BENEFIT, Min untuk COST
- **Ideal Negatif (A-)**: Min untuk BENEFIT, Max untuk COST

### Formula Jarak:
```
D+ = √(Σ (X_weighted - A+)²)
D- = √(Σ (X_weighted - A-)²)
```

### Formula Score TOPSIS:
```
Score = D- / (D+ + D-)
```

**Range Score:** 0 - 1 (semakin mendekati 1, semakin baik)

---

## 🎯 INTERPRETASI HASIL

| Score Range | Interpretasi |
|-------------|--------------|
| 0.80 - 1.00 | Sangat Baik |
| 0.60 - 0.79 | Baik |
| 0.40 - 0.59 | Cukup |
| 0.20 - 0.39 | Kurang |
| 0.00 - 0.19 | Sangat Kurang |

---

## 📝 CATATAN PENTING

1. **BENEFIT Criteria** (CPU, RAM, Disk I/O): Nilai lebih tinggi = lebih baik
2. **COST Criteria** (Harga): Nilai lebih rendah = lebih baik
3. Semua kriteria memiliki bobot **sama (25%)** untuk evaluasi yang adil
4. Level digunakan untuk kategorisasi dan interpretasi hasil
5. Perhitungan TOPSIS menggunakan nilai numerik asli, bukan level

---

**PT Kajek Indonesia - 2025**
