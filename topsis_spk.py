import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
from datetime import datetime

class TOPSISAnalyzer:
    def __init__(self, csv_file, weights):
        self.df = pd.read_csv(csv_file)
        self.weights = np.array(weights)
        self.criteria_names = ['CPU', 'RAM', 'Disk I/O', 'Harga']
        self.criteria_levels = {
            'CPU': [(1, 2, 'Sangat Rendah'), (3, 4, 'Rendah'), (5, 6, 'Sedang'), 
                    (7, 8, 'Tinggi'), (9, 999, 'Sangat Tinggi')],
            'RAM': [(1, 2, 'Sangat Rendah'), (3, 4, 'Rendah'), (5, 8, 'Sedang'), 
                    (9, 16, 'Tinggi'), (17, 999, 'Sangat Tinggi')],
            'Disk I/O': [(100, 200, 'Sangat Rendah'), (201, 400, 'Rendah'), (401, 600, 'Sedang'), 
                         (601, 800, 'Tinggi'), (801, 9999, 'Sangat Tinggi')],
            'Harga': [(5, 20, 'Sangat Murah'), (21, 50, 'Murah'), (51, 100, 'Sedang'), 
                      (101, 200, 'Mahal'), (201, 9999, 'Sangat Mahal')]
        }
        
    def get_level(self, criteria, value):
        """Menentukan level berdasarkan nilai kriteria"""
        for min_val, max_val, level_name in self.criteria_levels[criteria]:
            if min_val <= value <= max_val:
                return level_name
        return 'Unknown'
    
    def extract_values(self):
        self.df['CPU_val'] = self.df['CPU'].apply(lambda x: int(re.search(r'(\d+)', x).group(1)))
        self.df['RAM_val'] = self.df['RAM'].apply(lambda x: int(re.search(r'(\d+)', x).group(1)))
        
        def extract_disk_io(val):
            # Ekstrak kapasitas disk dan kecepatan bandwidth
            disk = int(re.search(r'(\d+)\s*GB', val).group(1))
            speed_match = re.search(r'(\d+(?:\.\d+)?)\s*(Gbps|Mbps)', val)
            if speed_match:
                speed = float(speed_match.group(1))
                if 'Gbps' in speed_match.group(2):
                    speed *= 1000  # Convert Gbps to Mbps
            else:
                speed = 100  # Default 100 Mbps
            # Estimasi Disk I/O Speed dalam MB/s (bandwidth / 8)
            return speed / 8
        
        self.df['DiskIO_val'] = self.df['Disk I/O Speed'].apply(extract_disk_io)
        self.df['Price_val'] = self.df['Harga/Bulan (USD)'].apply(
            lambda x: float(re.search(r'[\$\s]*([\d.]+)', x).group(1))
        )
        
        # Tambahkan kolom level
        self.df['CPU_Level'] = self.df['CPU_val'].apply(lambda x: self.get_level('CPU', x))
        self.df['RAM_Level'] = self.df['RAM_val'].apply(lambda x: self.get_level('RAM', x))
        self.df['DiskIO_Level'] = self.df['DiskIO_val'].apply(lambda x: self.get_level('Disk I/O', x))
        self.df['Price_Level'] = self.df['Price_val'].apply(lambda x: self.get_level('Harga', x))
        
    def calculate_topsis(self):
        X = self.df[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
        
        # Normalisasi
        X_norm = X / np.sqrt((X**2).sum(axis=0))
        
        # Matriks terbobot
        X_weighted = X_norm * self.weights
        
        # Solusi ideal (benefit: max, cost: min)
        ideal_pos = np.array([X_weighted[:, 0].max(), X_weighted[:, 1].max(), 
                              X_weighted[:, 2].max(), X_weighted[:, 3].min()])
        ideal_neg = np.array([X_weighted[:, 0].min(), X_weighted[:, 1].min(), 
                              X_weighted[:, 2].min(), X_weighted[:, 3].max()])
        
        # Jarak Euclidean
        D_pos = np.sqrt(((X_weighted - ideal_pos)**2).sum(axis=1))
        D_neg = np.sqrt(((X_weighted - ideal_neg)**2).sum(axis=1))
        
        # Skor TOPSIS
        self.df['Score'] = D_neg / (D_pos + D_neg)
        self.df['Rank'] = self.df['Score'].rank(ascending=False).astype(int)
        
        return X_norm, X_weighted, ideal_pos, ideal_neg
        
    def print_report(self):
        W = 70  # width
        
        print("\n" + "╔" + "═"*W + "╗")
        print("║" + "🚀 SPK PEMILIHAN SERVER CLOUD TERBAIK".center(W) + "║")
        print("║" + "PT KAJEK INDONESIA".center(W) + "║")
        print("╠" + "═"*W + "╣")
        print(f"║  📅 {datetime.now().strftime('%d %B %Y, %H:%M')}".ljust(W+1) + "║")
        print(f"║  📊 Metode: TOPSIS  •  Alternatif: {len(self.df)}  •  Kriteria: 4".ljust(W+1) + "║")
        print("╚" + "═"*W + "╝")
        
        # Kriteria & Bobot (compact)
        print("\n┌─ ⚖️  BOBOT KRITERIA " + "─"*48 + "┐")
        print(f"│  CPU: 25% (BENEFIT)  │  RAM: 25% (BENEFIT)  │  I/O: 25% (BENEFIT)  │  Harga: 25% (COST)  │")
        print("└" + "─"*68 + "┘")
        
        result = self.df[['Rank', 'Vendor', 'Nama Paket (Plan)', 'CPU_val', 'CPU_Level',
                          'RAM_val', 'RAM_Level', 'DiskIO_val', 'DiskIO_Level', 
                          'Price_val', 'Price_Level', 'Score']].sort_values('Rank')
        
        # Top 10 Table
        print("\n┌─ 🏆 TOP 10 RANKING " + "─"*49 + "┐")
        print(f"│ {'#':>2}  {'Vendor':<18} {'CPU':>6} {'RAM':>6} {'I/O':>8} {'Harga':>8} {'Score':>8} │")
        print("├" + "─"*68 + "┤")
        
        medals = ['🥇', '🥈', '🥉']
        for i, (_, row) in enumerate(result.head(10).iterrows()):
            medal = medals[i] if i < 3 else f"{int(row['Rank']):>2}"
            print(f"│ {medal}  {row['Vendor'][:18]:<18} {row['CPU_val']:>4}C {row['RAM_val']:>4}G "
                  f"{row['DiskIO_val']:>6.0f} ${row['Price_val']:>6.0f} {row['Score']:>8.4f} │")
        print("└" + "─"*68 + "┘")
        
        # Rekomendasi Terbaik (compact card)
        top = result.iloc[0]
        print("\n╔" + "═"*68 + "╗")
        print("║" + "🏆 REKOMENDASI TERBAIK".center(68) + "║")
        print("╠" + "═"*68 + "╣")
        print(f"║  Vendor : {top['Vendor']:<56} ║")
        print(f"║  Paket  : {top['Nama Paket (Plan)'][:56]:<56} ║")
        print("╟" + "─"*68 + "╢")
        print(f"║  CPU: {top['CPU_val']} Core ({top['CPU_Level']})".ljust(35) + 
              f"RAM: {top['RAM_val']} GB ({top['RAM_Level']})".ljust(34) + "║")
        print(f"║  I/O: {top['DiskIO_val']:.0f} MB/s ({top['DiskIO_Level']})".ljust(35) + 
              f"Harga: ${top['Price_val']:.0f}/bln ({top['Price_Level']})".ljust(34) + "║")
        print("╟" + "─"*68 + "╢")
        print(f"║  📈 Score TOPSIS: {top['Score']:.4f}".ljust(69) + "║")
        print("╚" + "═"*68 + "╝\n")
        
    def create_visualizations(self):
        result = self.df.sort_values('Rank')
        
        # Modern color palette
        COLORS = {
            'primary': '#2563EB', 'success': '#10B981', 'warning': '#F59E0B',
            'danger': '#EF4444', 'purple': '#8B5CF6', 'bg': '#F8FAFC',
            'card': '#FFFFFF', 'text': '#1E293B', 'muted': '#64748B'
        }
        
        plt.style.use('seaborn-v0_8-whitegrid')
        fig = plt.figure(figsize=(20, 12), facecolor=COLORS['bg'])
        
        # Grid layout: 3 rows
        gs = fig.add_gridspec(3, 4, height_ratios=[0.12, 1, 1], hspace=0.25, wspace=0.25,
                              left=0.04, right=0.96, top=0.95, bottom=0.05)
        
        # === HEADER ===
        ax_header = fig.add_subplot(gs[0, :])
        ax_header.set_facecolor(COLORS['primary'])
        ax_header.set_xlim(0, 1)
        ax_header.set_ylim(0, 1)
        ax_header.axis('off')
        ax_header.text(0.5, 0.6, '🚀 SPK PEMILIHAN SERVER CLOUD TERBAIK', fontsize=20, 
                      fontweight='bold', ha='center', va='center', color='white')
        ax_header.text(0.5, 0.2, f'Metode TOPSIS  •  {len(self.df)} Alternatif  •  4 Kriteria  •  {datetime.now().strftime("%d %B %Y")}',
                      fontsize=11, ha='center', va='center', color='#BFDBFE')
        
        # === ROW 1: Top 10 + Radar + Pie ===
        
        # 1. TOP 10 RANKING (span 2 cols)
        ax1 = fig.add_subplot(gs[1, :2])
        ax1.set_facecolor(COLORS['card'])
        top10 = result.head(10)
        gradient = plt.cm.Blues(np.linspace(0.9, 0.4, 10))
        bars = ax1.barh(range(10), top10['Score'], color=gradient, height=0.7, 
                       edgecolor='white', linewidth=2)
        
        # Medal icons
        medals = ['🥇', '🥈', '🥉'] + [''] * 7
        ax1.set_yticks(range(10))
        ax1.set_yticklabels([f"{medals[i]} {row['Vendor']}" for i, (_, row) in enumerate(top10.iterrows())], 
                           fontsize=10, fontweight='bold')
        ax1.invert_yaxis()
        ax1.set_xlim(0, 1.15)
        ax1.set_xlabel('')
        ax1.spines[['top', 'right', 'bottom']].set_visible(False)
        ax1.tick_params(bottom=False, labelbottom=False)
        
        for i, (_, row) in enumerate(top10.iterrows()):
            ax1.text(row['Score'] + 0.02, i, f"{row['Score']:.4f}", va='center', 
                    fontsize=10, fontweight='bold', color=COLORS['text'])
            ax1.text(1.08, i, f"${row['Price_val']:.0f}", va='center', fontsize=9, 
                    color=COLORS['muted'], ha='center')
        
        ax1.text(1.08, -0.8, 'Harga', fontsize=9, ha='center', color=COLORS['muted'], style='italic')
        ax1.set_title('🏆 TOP 10 RANKING', fontsize=13, fontweight='bold', color=COLORS['text'], loc='left', pad=15)
        
        # 2. RADAR CHART
        ax2 = fig.add_subplot(gs[1, 2], projection='polar')
        angles = np.linspace(0, 2 * np.pi, 4, endpoint=False).tolist() + [0]
        radar_colors = [COLORS['primary'], COLORS['warning'], COLORS['success']]
        
        for i, (_, row) in enumerate(result.head(3).iterrows()):
            values = [row['CPU_val']/10, row['RAM_val']/20, row['DiskIO_val']/1500, 
                     1 - (row['Price_val']/150)] + [row['CPU_val']/10]
            ax2.plot(angles, values, 'o-', linewidth=2.5, color=radar_colors[i], 
                    label=f"#{int(row['Rank'])} {row['Vendor']}", markersize=7)
            ax2.fill(angles, values, alpha=0.15, color=radar_colors[i])
        
        ax2.set_xticks(angles[:-1])
        ax2.set_xticklabels(['CPU', 'RAM', 'Disk I/O', 'Harga\n(inverse)'], fontsize=10, fontweight='bold')
        ax2.set_ylim(0, 1)
        ax2.set_yticks([0.25, 0.5, 0.75])
        ax2.set_yticklabels(['25%', '50%', '75%'], fontsize=8, color=COLORS['muted'])
        ax2.legend(loc='upper right', bbox_to_anchor=(1.3, 1.15), fontsize=9, frameon=True)
        ax2.set_title('🎯 TOP 3 COMPARISON', fontsize=13, fontweight='bold', pad=20, color=COLORS['text'])
        
        # 3. PIE CHART - Bobot
        ax3 = fig.add_subplot(gs[1, 3])
        ax3.set_facecolor(COLORS['card'])
        pie_colors = [COLORS['primary'], COLORS['success'], COLORS['purple'], COLORS['danger']]
        wedges, texts, autotexts = ax3.pie(
            self.weights, labels=['CPU', 'RAM', 'Disk I/O', 'Harga'], 
            autopct='%1.0f%%', colors=pie_colors, startangle=90,
            wedgeprops={'linewidth': 3, 'edgecolor': 'white'},
            textprops={'fontsize': 11, 'fontweight': 'bold'},
            pctdistance=0.75
        )
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
        
        # Legend dengan tipe
        legend_labels = ['CPU (BENEFIT)', 'RAM (BENEFIT)', 'Disk I/O (BENEFIT)', 'Harga (COST)']
        ax3.legend(wedges, legend_labels, loc='lower center', bbox_to_anchor=(0.5, -0.15), 
                  fontsize=9, ncol=2, frameon=False)
        ax3.set_title('⚖️ BOBOT KRITERIA', fontsize=13, fontweight='bold', color=COLORS['text'], pad=10)
        
        # === ROW 2: Scatter + Heatmap + Distribution ===
        
        # 4. SCATTER PLOT
        ax4 = fig.add_subplot(gs[2, :2])
        ax4.set_facecolor(COLORS['card'])
        price_colors = {'Sangat Murah': COLORS['success'], 'Murah': '#6EE7B7', 
                       'Sedang': COLORS['warning'], 'Mahal': '#FB923C', 'Sangat Mahal': COLORS['danger']}
        
        for level, color in price_colors.items():
            mask = self.df['Price_Level'] == level
            if mask.any():
                ax4.scatter(self.df[mask]['Price_val'], self.df[mask]['Score'], 
                           c=color, s=150, alpha=0.8, edgecolors='white', linewidth=2, label=level)
        
        # Annotate top 3
        for i, (_, row) in enumerate(result.head(3).iterrows()):
            ax4.annotate(f"#{int(row['Rank'])} {row['Vendor']}", 
                        xy=(row['Price_val'], row['Score']),
                        xytext=(10, 10), textcoords='offset points',
                        fontsize=9, fontweight='bold',
                        bbox=dict(boxstyle='round,pad=0.4', facecolor='white', edgecolor=COLORS['primary'], alpha=0.9),
                        arrowprops=dict(arrowstyle='->', color=COLORS['primary'], lw=1.5))
        
        ax4.set_xlabel('Harga (USD/Bulan)', fontsize=11, fontweight='bold', color=COLORS['text'])
        ax4.set_ylabel('Score TOPSIS', fontsize=11, fontweight='bold', color=COLORS['text'])
        ax4.legend(loc='lower left', fontsize=9, frameon=True, title='Level Harga', title_fontsize=10)
        ax4.spines[['top', 'right']].set_visible(False)
        ax4.grid(True, alpha=0.3, linestyle='--')
        ax4.set_title('💰 HARGA vs SCORE', fontsize=13, fontweight='bold', color=COLORS['text'], loc='left', pad=15)
        
        # 5. HEATMAP TOP 5
        ax5 = fig.add_subplot(gs[2, 2])
        top5 = result.head(5)
        heatmap_data = top5[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
        
        # Normalize untuk heatmap
        hm_norm = (heatmap_data - heatmap_data.min(axis=0)) / (heatmap_data.max(axis=0) - heatmap_data.min(axis=0) + 0.001)
        hm_norm[:, 3] = 1 - hm_norm[:, 3]  # Inverse harga
        
        sns.heatmap(hm_norm.T, annot=heatmap_data.T, fmt='.0f', cmap='RdYlGn',
                   xticklabels=[f"#{int(row['Rank'])}" for _, row in top5.iterrows()],
                   yticklabels=['CPU', 'RAM', 'I/O', 'Harga'], 
                   cbar=False, ax=ax5, linewidths=3, linecolor='white',
                   annot_kws={'fontsize': 11, 'fontweight': 'bold'})
        ax5.set_xticklabels(ax5.get_xticklabels(), fontsize=10, fontweight='bold')
        ax5.set_yticklabels(ax5.get_yticklabels(), fontsize=10, fontweight='bold')
        ax5.set_title('🔥 TOP 5 HEATMAP', fontsize=13, fontweight='bold', color=COLORS['text'], pad=15)
        
        # 6. DISTRIBUTION BAR
        ax6 = fig.add_subplot(gs[2, 3])
        ax6.set_facecolor(COLORS['card'])
        
        # Summary stats untuk top 5
        categories = ['CPU\n(Core)', 'RAM\n(GB)', 'I/O\n(MB/s)', 'Harga\n($)']
        top5_avg = [top5['CPU_val'].mean(), top5['RAM_val'].mean(), 
                   top5['DiskIO_val'].mean()/10, top5['Price_val'].mean()]
        all_avg = [self.df['CPU_val'].mean(), self.df['RAM_val'].mean(), 
                  self.df['DiskIO_val'].mean()/10, self.df['Price_val'].mean()]
        
        x = np.arange(4)
        width = 0.35
        bars1 = ax6.bar(x - width/2, top5_avg, width, label='Top 5', color=COLORS['primary'], edgecolor='white', linewidth=2)
        bars2 = ax6.bar(x + width/2, all_avg, width, label='Semua', color=COLORS['muted'], alpha=0.6, edgecolor='white', linewidth=2)
        
        ax6.set_xticks(x)
        ax6.set_xticklabels(categories, fontsize=10, fontweight='bold')
        ax6.legend(fontsize=10, loc='upper right', frameon=True)
        ax6.spines[['top', 'right']].set_visible(False)
        ax6.set_title('📊 TOP 5 vs RATA-RATA', fontsize=13, fontweight='bold', color=COLORS['text'], loc='left', pad=15)
        
        # Add value labels
        for bar in bars1:
            ax6.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5, 
                    f'{bar.get_height():.1f}', ha='center', fontsize=9, fontweight='bold', color=COLORS['primary'])
        
        plt.savefig('hasil_visualisasi_topsis.png', dpi=300, bbox_inches='tight', facecolor=COLORS['bg'])
        print("✓ Visualisasi disimpan ke 'hasil_visualisasi_topsis.png'")
        plt.show()
        
    def export_results(self):
        result = self.df[['Rank', 'No', 'Vendor', 'Nama Paket (Plan)', 
                          'CPU_val', 'CPU_Level', 'RAM_val', 'RAM_Level', 
                          'DiskIO_val', 'DiskIO_Level', 'Price_val', 'Price_Level', 
                          'Score']].sort_values('Rank')
        
        result.to_csv('hasil_topsis_lengkap.csv', index=False)
        print("✓ Hasil lengkap disimpan ke 'hasil_topsis_lengkap.csv'")
        
        # Export top 5 detail
        top5 = result.head(5)
        with open('rekomendasi_top5.txt', 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("SPK PEMILIHAN SERVER CLOUD TERBAIK PT KAJEK INDONESIA\n")
            f.write("TOP 5 REKOMENDASI\n")
            f.write("="*80 + "\n\n")
            for _, row in top5.iterrows():
                f.write(f"Rank #{row['Rank']}\n")
                f.write(f"Vendor: {row['Vendor']}\n")
                f.write(f"Paket: {row['Nama Paket (Plan)']}\n")
                f.write(f"CPU: {row['CPU_val']} Core (Level: {row['CPU_Level']})\n")
                f.write(f"RAM: {row['RAM_val']} GB (Level: {row['RAM_Level']})\n")
                f.write(f"Disk I/O Speed: {row['DiskIO_val']:.0f} MB/s (Level: {row['DiskIO_Level']})\n")
                f.write(f"Harga: ${row['Price_val']:.2f}/bulan (Level: {row['Price_Level']})\n")
                f.write(f"Score TOPSIS: {row['Score']:.4f}\n")
                f.write("-"*80 + "\n\n")
        
        print("✓ Top 5 rekomendasi disimpan ke 'rekomendasi_top5.txt'")

def main():
    # Konfigurasi
    csv_file = 'No-Vendor-NamaPaketPlan-CPU-RAM-DiskIOSpeed-HargaBulanUSD.csv'
    weights = [0.25, 0.25, 0.25, 0.25]  # CPU, RAM, Disk I/O, Harga
    
    # Inisialisasi
    analyzer = TOPSISAnalyzer(csv_file, weights)
    
    # Proses
    analyzer.extract_values()
    analyzer.calculate_topsis()
    
    # Output
    analyzer.print_report()
    analyzer.export_results()
    analyzer.create_visualizations()
    
    print("\n" + "="*80)
    print("✓ ANALISIS SELESAI".center(80))
    print("="*80 + "\n")

if __name__ == "__main__":
    main()
