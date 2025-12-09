# 🚀 Dashboard TOPSIS - Modern UI/UX

Dashboard interaktif dengan desain **Glassmorphism** yang modern dan profesional untuk Sistem Pendukung Keputusan pemilihan Server Cloud VPS menggunakan metode TOPSIS.

## ✨ Fitur Utama

### 🎨 Design Features
- **Glassmorphism Design** - Efek kaca transparan dengan blur backdrop
- **Gradient Background** - Background gradient purple yang elegan
- **Animated Winner Card** - Card pemenang dengan animasi rotating gradient
- **Interactive Charts** - Visualisasi interaktif menggunakan Plotly
- **Responsive Layout** - Layout yang optimal di berbagai ukuran layar
- **Modern Typography** - Font Inter untuk tampilan profesional

### 📊 Dashboard Sections

#### 1. **Hero Section**
- Judul besar dengan gradient text
- Subtitle informatif
- Design eye-catching

#### 2. **Winner Card (Premium)**
- Tampilan pemenang dengan design premium
- Badge emas dengan shadow
- Stats grid dengan 4 metrik utama
- Score TOPSIS yang prominent
- Animasi background rotating

#### 3. **Sidebar - Konfigurasi Bobot**
- Slider interaktif untuk 4 kriteria
- Real-time validation total bobot
- Info dataset
- Design glassmorphism

#### 4. **Tab 1: Ranking & Visualisasi**
- **Top 10 Bar Chart** - Horizontal bar dengan gradient colors
- **Heatmap Top 10** - Perbandingan nilai kriteria
- **Radar Chart Top 5** - Perbandingan multi-dimensi
- **Scatter Plot** - Harga vs Score dengan level colors
- **Pie Chart** - Distribusi bobot kriteria

#### 5. **Tab 2: Perhitungan TOPSIS**
- Step-by-step calculation dengan styling
- Matriks Keputusan (X)
- Matriks Ternormalisasi (R)
- Matriks Terbobot (Y)
- Solusi Ideal (A+ & A-)
- Jarak Euclidean & Score
- Visualisasi jarak dengan grouped bar chart

#### 6. **Tab 3: Parameter Level**
- Tabel panduan level 1-5 untuk setiap kriteria
- Emoji indicators (⭐ untuk benefit, 💰 untuk cost)
- Distribusi level dalam dataset
- 4 bar charts untuk setiap kriteria

#### 7. **Tab 4: Edit Data**
- Mode Edit: Ubah data alternatif existing
- Mode Tambah: Tambah alternatif baru
- Select slider dengan emoji dan nama level
- Preview data real-time
- Actions: Reset, Hapus, Metrics

#### 8. **Tab 5: Data Lengkap**
- Tabel lengkap semua alternatif
- Gradient background pada score
- Export ke CSV
- Metrics summary

## 🎨 Color Palette

```css
Primary: #667eea (Purple Blue)
Secondary: #764ba2 (Purple)
Accent 1: #f093fb (Pink)
Accent 2: #f5576c (Red Pink)
Success: #10b981 (Green)
Warning: #fbbf24 (Yellow)
Danger: #ef4444 (Red)
Gold: #FFD700 (Gold)
```

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Jalankan Dashboard
```bash
streamlit run dashboard_new.py
```

### 3. Akses Dashboard
Buka browser dan akses: `http://localhost:8501`

## 📱 Responsive Design

Dashboard ini dioptimalkan untuk:
- 💻 Desktop (1920x1080 dan lebih)
- 💻 Laptop (1366x768)
- 📱 Tablet (768x1024)
- 📱 Mobile (375x667)

## 🎯 UI/UX Best Practices

### ✅ Yang Diterapkan:
1. **Visual Hierarchy** - Informasi penting lebih prominent
2. **Consistency** - Design pattern yang konsisten
3. **Feedback** - Success/error messages dengan balloons
4. **Accessibility** - Contrast ratio yang baik
5. **White Space** - Spacing yang optimal
6. **Color Psychology** - Warna sesuai fungsi (hijau=sukses, merah=bahaya)
7. **Typography** - Font hierarchy yang jelas
8. **Interactive Elements** - Hover effects dan transitions
9. **Data Visualization** - Charts yang mudah dipahami
10. **Loading States** - Caching untuk performa optimal

## 🏆 Keunggulan Design

### 1. **Glassmorphism Effect**
- Backdrop blur untuk depth
- Semi-transparent backgrounds
- Border dengan opacity
- Shadow untuk elevation

### 2. **Gradient Magic**
- Background gradient yang smooth
- Text gradient untuk emphasis
- Button gradient untuk CTA
- Card gradient untuk winner

### 3. **Interactive Charts**
- Plotly untuk interaktivity
- Hover tooltips informatif
- Zoom & pan capabilities
- Export chart as image

### 4. **Micro-interactions**
- Button hover effects
- Card hover transforms
- Smooth transitions
- Balloons animation on success

## 📊 Chart Types

1. **Horizontal Bar Chart** - Top 10 ranking
2. **Heatmap** - Kriteria comparison
3. **Radar Chart** - Multi-dimensional view
4. **Scatter Plot** - Price vs Score correlation
5. **Pie Chart** - Weight distribution
6. **Grouped Bar Chart** - Distance visualization
7. **Simple Bar Charts** - Level distribution

## 🎨 CSS Customization

File menggunakan custom CSS dengan:
- Google Fonts (Inter)
- CSS Variables untuk colors
- Flexbox & Grid layouts
- CSS Animations
- Media queries (responsive)
- Pseudo-elements untuk effects

## 💡 Tips Penggunaan

1. **Adjust Weights** - Gunakan sidebar untuk mengubah bobot kriteria
2. **Explore Charts** - Hover pada charts untuk detail
3. **Edit Data** - Tambah/edit alternatif di Tab 4
4. **Export Results** - Download CSV di Tab 5
5. **Reset Data** - Kembali ke data awal kapan saja

## 🔧 Customization

### Ubah Color Scheme:
Edit bagian CSS di `dashboard_new.py`:
```python
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Ubah Font:
```python
@import url('https://fonts.googleapis.com/css2?family=YourFont');
font-family: 'YourFont', sans-serif;
```

### Ubah Layout:
Sesuaikan `st.columns()` ratio dan grid layout

## 📈 Performance

- **Caching** - `@st.cache_data` untuk load data
- **Lazy Loading** - Charts dimuat per tab
- **Optimized Images** - Vector graphics (SVG)
- **Minimal Re-renders** - Efficient state management

## 🎓 Tech Stack

- **Streamlit** - Web framework
- **Plotly** - Interactive charts
- **Pandas** - Data manipulation
- **NumPy** - Numerical computation
- **CSS3** - Custom styling
- **HTML5** - Custom components

## 📝 Notes

- Dashboard ini menggunakan **session state** untuk menyimpan data
- Semua perubahan data bersifat **temporary** (tidak tersimpan ke file)
- Untuk menyimpan permanen, gunakan tombol **Download CSV**
- Refresh browser akan **reset** semua perubahan

## 🏅 Award-Winning Features

Design ini menerapkan prinsip UI/UX terbaik:
- ✅ Nielsen's 10 Usability Heuristics
- ✅ Material Design Guidelines
- ✅ Apple Human Interface Guidelines
- ✅ Web Content Accessibility Guidelines (WCAG)
- ✅ Gestalt Principles
- ✅ Fitts's Law
- ✅ Hick's Law
- ✅ Miller's Law

---

**Dibuat dengan ❤️ oleh Tim UI/UX PT Kajek Indonesia**

*"Design is not just what it looks like and feels like. Design is how it works." - Steve Jobs*
