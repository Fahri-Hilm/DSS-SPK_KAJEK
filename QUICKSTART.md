# 🚀 QUICK START GUIDE

## 📦 Installation (One-time)

```bash
# 1. Install dependencies
pip install -r requirements.txt
```

## 🎯 Run Dashboard

### Option 1: Easy Script (Recommended)
```bash
./run_dashboard.sh
```

### Option 2: Direct Command
```bash
streamlit run dashboard_new.py
```

### Option 3: Custom Port
```bash
streamlit run dashboard_new.py --server.port 8080
```

## 🌐 Access Dashboard

Open browser and go to:
```
http://localhost:8501
```

## 🎨 What You'll See

### 1. Hero Section
- Big title with gradient
- Subtitle with info

### 2. Winner Card (Premium)
- 🏆 Best recommendation
- Gold badge
- 4 stats (CPU, RAM, Disk I/O, Harga)
- TOPSIS Score

### 3. Sidebar (Left)
- ⚙️ Adjust weights
- 4 sliders (CPU, RAM, Disk I/O, Harga)
- Real-time validation
- Dataset info

### 4. Main Content (5 Tabs)

#### Tab 1: 📊 Ranking & Visualisasi
- Top 10 bar chart
- Heatmap top 10
- Radar chart top 5
- Scatter plot (harga vs score)
- Pie chart (bobot)

#### Tab 2: 🧮 Perhitungan TOPSIS
- Step-by-step calculation
- All matrices
- Ideal solutions
- Distances & scores

#### Tab 3: 📋 Parameter Level
- Level guidelines (1-5)
- Distribution charts

#### Tab 4: ✏️ Edit Data
- Edit existing alternatives
- Add new alternatives
- Preview & actions

#### Tab 5: 📁 Data Lengkap
- Full data table
- Export to CSV
- Summary metrics

## 💡 Quick Tips

1. **Adjust Weights**: Use sidebar sliders
2. **Explore Charts**: Hover for details
3. **Edit Data**: Go to Tab 4
4. **Export Results**: Download CSV in Tab 5
5. **Reset Data**: Button in Tab 4

## 🎨 Features to Try

### Interactive Charts
- Hover on any chart point
- Zoom in/out (scroll)
- Pan (click & drag)
- Download chart (camera icon)

### Weight Adjustment
- Change CPU weight → See ranking change
- Try different combinations
- Total must = 1.0

### Data Management
- Edit any alternative
- Add new cloud provider
- Reset to original data

## 🐛 Troubleshooting

### Port Already in Use
```bash
streamlit run dashboard_new.py --server.port 8502
```

### Module Not Found
```bash
pip install -r requirements.txt --upgrade
```

### Browser Not Opening
Manually open: `http://localhost:8501`

### Data Not Updating
Click "Reset ke Data Awal" in Tab 4

## 📱 Mobile Access

If running on server:
```bash
streamlit run dashboard_new.py --server.address 0.0.0.0
```

Access from mobile:
```
http://YOUR_IP:8501
```

## ⌨️ Keyboard Shortcuts

- `Ctrl + C` - Stop dashboard
- `R` - Rerun app
- `C` - Clear cache
- `?` - Show shortcuts

## 🎯 First Time Checklist

- [ ] Install dependencies
- [ ] Run dashboard
- [ ] Open in browser
- [ ] Explore all 5 tabs
- [ ] Try adjusting weights
- [ ] Edit some data
- [ ] Export CSV
- [ ] Check mobile view

## 🏆 Pro Mode

### Custom Theme
Edit `.streamlit/config.toml`:
```toml
[theme]
primaryColor = "#667eea"
backgroundColor = "#0f172a"
secondaryBackgroundColor = "#1e293b"
textColor = "#f8fafc"
font = "sans serif"
```

### Performance Boost
```bash
streamlit run dashboard_new.py --server.runOnSave true --server.maxUploadSize 200
```

## 📚 Documentation

- **Full Docs**: `DASHBOARD_README.md`
- **Comparison**: `COMPARISON.md`
- **Summary**: `SUMMARY.md`
- **Main README**: `README.md`

## 🆘 Need Help?

1. Check documentation files
2. Read error messages
3. Check console output
4. Verify data file exists

## 🎉 Enjoy!

You're all set! Explore the dashboard and have fun with the data visualization! 🚀

---

**Happy Analyzing! 📊✨**
