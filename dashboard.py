import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px

st.set_page_config(page_title="TOPSIS SPK", page_icon="🚀", layout="wide")

# CSS - Soft Dark Theme (Eye-friendly)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    * { font-family: 'Inter', sans-serif; }
    
    .stApp {
        background: #1a1f2e;
    }
    
    #MainMenu, footer, header {visibility: hidden;}
    
    .hero {
        background: #242b3d;
        border-radius: 16px;
        padding: 2.5rem;
        text-align: center;
        margin-bottom: 2rem;
        border: 1px solid #2d3548;
    }
    
    .winner {
        background: linear-gradient(135deg, #2d3548 0%, #3d4556 100%);
        border-radius: 16px;
        padding: 2.5rem;
        text-align: center;
        margin: 2rem 0;
        border: 1px solid #3d4556;
    }
    
    .stTabs [data-baseweb="tab-list"] {
        gap: 4px;
        background: #242b3d;
        border-radius: 12px;
        padding: 0.5rem;
    }
    
    .stTabs [data-baseweb="tab"] {
        background: transparent;
        border-radius: 8px;
        color: #8b92a7;
        font-weight: 500;
    }
    
    .stTabs [aria-selected="true"] {
        background: #2d3548;
        color: #e2e8f0;
    }
    
    [data-testid="stSidebar"] {
        background: #242b3d;
        border-right: 1px solid #2d3548;
    }
    
    [data-testid="stSidebar"] .stMarkdown {
        color: #e2e8f0;
    }
    
    .stButton > button {
        background: #3d4556;
        color: #e2e8f0;
        border: none;
        border-radius: 8px;
        font-weight: 500;
    }
    
    .stButton > button:hover {
        background: #4a5568;
    }
    
    /* Fix dataframe colors */
    .stDataFrame {
        background: #242b3d;
    }
    
    /* Fix metric colors */
    [data-testid="stMetricValue"] {
        color: #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# Functions
def get_cpu_level(val):
    if val <= 2: return 1
    elif val <= 4: return 2
    elif val <= 6: return 3
    elif val <= 8: return 4
    else: return 5

def get_ram_level(val):
    if val <= 2: return 1
    elif val <= 4: return 2
    elif val <= 8: return 3
    elif val <= 16: return 4
    else: return 5

def get_diskio_level(val):
    if val <= 200: return 1
    elif val <= 400: return 2
    elif val <= 600: return 3
    elif val <= 800: return 4
    else: return 5

def get_price_level(val):
    if val <= 20: return 1
    elif val <= 50: return 2
    elif val <= 100: return 3
    elif val <= 200: return 4
    else: return 5

@st.cache_data
def load_data():
    df = pd.read_excel('TOPSIS_Input_Level.xlsx', sheet_name='1. Input Level', skiprows=2)
    df.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
    df = df.dropna(subset=['Vendor']).reset_index(drop=True)
    
    df['CPU_val'] = df['CPU_Level'].apply(lambda x: {1:2, 2:4, 3:6, 4:8, 5:10}[int(x)])
    df['RAM_val'] = df['RAM_Level'].apply(lambda x: {1:2, 2:4, 3:8, 4:16, 5:32}[int(x)])
    df['DiskIO_val'] = df['DiskIO_Level'].apply(lambda x: {1:150, 2:300, 3:500, 4:700, 5:1000}[int(x)])
    df['Price_val'] = df['Price_Level'].apply(lambda x: {1:15, 2:35, 3:75, 4:150, 5:250}[int(x)])
    
    return df

def calculate_topsis(df, weights):
    X = df[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
    X_norm = X / np.sqrt((X**2).sum(axis=0))
    X_weighted = X_norm * weights
    
    ideal_pos = np.array([X_weighted[:, 0].max(), X_weighted[:, 1].max(), 
                          X_weighted[:, 2].max(), X_weighted[:, 3].min()])
    ideal_neg = np.array([X_weighted[:, 0].min(), X_weighted[:, 1].min(), 
                          X_weighted[:, 2].min(), X_weighted[:, 3].max()])
    
    D_pos = np.sqrt(((X_weighted - ideal_pos)**2).sum(axis=1))
    D_neg = np.sqrt(((X_weighted - ideal_neg)**2).sum(axis=1))
    
    result = df.copy()
    result['Score'] = D_neg / (D_pos + D_neg)
    result['Rank'] = result['Score'].rank(ascending=False).astype(int)
    result['D_pos'] = D_pos
    result['D_neg'] = D_neg
    
    return result.sort_values('Rank'), X_norm, X_weighted, ideal_pos, ideal_neg

# Init
if 'df_data' not in st.session_state:
    st.session_state.df_data = load_data()

# Hero
st.markdown("""
<div class="hero">
    <h1 style="color: #e2e8f0; margin: 0; font-weight: 600;">TOPSIS Decision Support System</h1>
    <p style="color: #94a3b8; margin: 0.5rem 0 0 0; font-weight: 400;">PT Kajek Indonesia - Server Cloud VPS Selection</p>
</div>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("### ⚙️ Bobot Kriteria")
    w_cpu = st.slider("🔧 CPU", 0.0, 1.0, 0.25, 0.05)
    w_ram = st.slider("💾 RAM", 0.0, 1.0, 0.25, 0.05)
    w_disk = st.slider("💿 Disk I/O", 0.0, 1.0, 0.25, 0.05)
    w_price = st.slider("💰 Harga", 0.0, 1.0, 0.25, 0.05)
    
    total = w_cpu + w_ram + w_disk + w_price
    if abs(total - 1.0) > 0.01:
        st.error(f"⚠️ Total: {total:.2f} (Harus = 1.0)")
    else:
        st.success(f"✅ Total: {total:.2f}")
    
    st.markdown("---")
    st.info(f"**Data:** {len(st.session_state.df_data)} alternatif\n\n**Source:** TOPSIS_Input_Level.xlsx")

# Calculate
weights = np.array([w_cpu, w_ram, w_disk, w_price])
result, X_norm, X_weighted, ideal_pos, ideal_neg = calculate_topsis(st.session_state.df_data, weights)

# Winner
top = result.iloc[0]
st.markdown(f"""
<div class="winner">
    <div style="background: #f59e0b; color: #1a1f2e; padding: 0.4rem 1.2rem; border-radius: 20px; display: inline-block; font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; letter-spacing: 0.5px;">
        REKOMENDASI TERBAIK
    </div>
    <h1 style="color: #e2e8f0; margin: 0.5rem 0; font-weight: 600;">{top['Vendor']}</h1>
    <h3 style="color: #94a3b8; margin-bottom: 1.5rem; font-weight: 400;">{top['Nama Paket (Plan)']}</h3>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;">
        <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">CPU</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #e2e8f0; margin-top: 0.3rem;">{top['CPU_val']}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">vCPU</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">RAM</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #e2e8f0; margin-top: 0.3rem;">{top['RAM_val']}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">GB</div>
        </div>
        <div style="background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Disk I/O</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #e2e8f0; margin-top: 0.3rem;">{top['DiskIO_val']:.0f}</div>
            <div style="font-size: 0.75rem; color: #94a3b8;">MB/s</div>
        </div>
        <div style="background: rgba(245,158,11,0.1); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(245,158,11,0.3);">
            <div style="font-size: 0.75rem; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px;">Harga</div>
            <div style="font-size: 1.5rem; font-weight: 600; color: #fbbf24; margin-top: 0.3rem;">${top['Price_val']:.0f}</div>
            <div style="font-size: 0.75rem; color: #fcd34d;">/bulan</div>
        </div>
    </div>
    <div style="margin-top: 1.5rem; font-size: 0.9rem; color: #94a3b8;">
        TOPSIS Score: <span style="color: #e2e8f0; font-weight: 600; font-size: 1.5rem;">{top['Score']:.4f}</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs(["📊 Ranking", "🧮 Perhitungan", "📋 Level", "✏️ Edit", "📁 Data"])

with tab1:
    st.markdown("### 🏅 Top 10 Ranking")
    
    top10 = result.head(10)
    
    fig = go.Figure(go.Bar(
        y=[f"#{int(row['Rank'])} {row['Vendor']}" for _, row in top10.iterrows()],
        x=top10['Score'],
        orientation='h',
        marker=dict(color='#3b82f6', line=dict(color='#2563eb', width=1)),
        text=[f"{s:.4f}" for s in top10['Score']],
        textposition='outside',
        textfont=dict(color='#e2e8f0')
    ))
    
    fig.update_layout(
        height=500,
        plot_bgcolor='#242b3d',
        paper_bgcolor='#242b3d',
        font=dict(color='#e2e8f0'),
        xaxis=dict(title="Score", showgrid=True, gridcolor='#2d3548', range=[0, 1]),
        yaxis=dict(categoryorder='total ascending'),
        margin=dict(l=20, r=20, t=20, b=20)
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🔥 Heatmap Top 10")
        heatmap_data = top10[['CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].values
        
        fig_heat = go.Figure(go.Heatmap(
            z=heatmap_data.T,
            x=[f"#{int(row['Rank'])}" for _, row in top10.iterrows()],
            y=['CPU', 'RAM', 'Disk I/O', 'Harga'],
            colorscale='Blues',
            text=heatmap_data.T,
            texttemplate='%{text:.0f}',
            textfont=dict(size=11, color='#e2e8f0')
        ))
        
        fig_heat.update_layout(
            height=400,
            plot_bgcolor='#242b3d',
            paper_bgcolor='#242b3d',
            font=dict(color='#e2e8f0'),
            margin=dict(l=20, r=20, t=20, b=20)
        )
        
        st.plotly_chart(fig_heat, use_container_width=True)
    
    with col2:
        st.markdown("### 🎯 Radar Top 5")
        top5 = result.head(5)
        
        fig_radar = go.Figure()
        colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']
        
        for i, (_, row) in enumerate(top5.iterrows()):
            values = [row['CPU_val']/32, row['RAM_val']/128, row['DiskIO_val']/5000, 1-(row['Price_val']/500)]
            fig_radar.add_trace(go.Scatterpolar(
                r=values + [values[0]],
                theta=['CPU', 'RAM', 'Disk I/O', 'Harga', 'CPU'],
                fill='toself',
                name=f"#{int(row['Rank'])} {row['Vendor']}",
                line=dict(color=colors[i], width=2),
                fillcolor=colors[i],
                opacity=0.3
            ))
        
        fig_radar.update_layout(
            height=400,
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 1], gridcolor='#2d3548', tickfont=dict(color='#94a3b8')),
                angularaxis=dict(gridcolor='#2d3548', tickfont=dict(color='#e2e8f0')),
                bgcolor='#242b3d'
            ),
            plot_bgcolor='#242b3d',
            paper_bgcolor='#242b3d',
            font=dict(color='#e2e8f0'),
            showlegend=True,
            margin=dict(l=20, r=20, t=20, b=20)
        )
        
        st.plotly_chart(fig_radar, use_container_width=True)

with tab2:
    st.markdown("### 🧮 Perhitungan TOPSIS")
    
    st.markdown("#### 1️⃣ Matriks Keputusan")
    decision_df = result[['Vendor', 'CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val']].copy()
    decision_df.columns = ['Vendor', 'CPU', 'RAM', 'Disk I/O', 'Harga']
    st.dataframe(decision_df, use_container_width=True, height=300)
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("CPU", "BENEFIT", f"{w_cpu:.2f}")
    col2.metric("RAM", "BENEFIT", f"{w_ram:.2f}")
    col3.metric("Disk I/O", "BENEFIT", f"{w_disk:.2f}")
    col4.metric("Harga", "COST", f"{w_price:.2f}")
    
    st.markdown("#### 2️⃣ Hasil Akhir")
    final_df = result[['Rank', 'Vendor', 'D_pos', 'D_neg', 'Score']].copy()
    final_df.columns = ['Rank', 'Vendor', 'D+ (ke A+)', 'D- (ke A-)', 'Score']
    st.dataframe(final_df, use_container_width=True, height=400)

with tab3:
    st.markdown("### 📋 Panduan Level (1-5)")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 🔧 CPU (BENEFIT)")
        st.dataframe(pd.DataFrame({
            'Level': ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
            'Range': ['1-2 Core', '3-4 Core', '5-6 Core', '7-8 Core', '9+ Core'],
            'Nilai': [2, 4, 6, 8, 10]
        }), use_container_width=True, hide_index=True)
        
        st.markdown("#### 💿 Disk I/O (BENEFIT)")
        st.dataframe(pd.DataFrame({
            'Level': ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
            'Range': ['100-200 MB/s', '201-400 MB/s', '401-600 MB/s', '601-800 MB/s', '801+ MB/s'],
            'Nilai': [150, 300, 500, 700, 1000]
        }), use_container_width=True, hide_index=True)
    
    with col2:
        st.markdown("#### 💾 RAM (BENEFIT)")
        st.dataframe(pd.DataFrame({
            'Level': ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
            'Range': ['1-2 GB', '3-4 GB', '5-8 GB', '9-16 GB', '17+ GB'],
            'Nilai': [2, 4, 8, 16, 32]
        }), use_container_width=True, hide_index=True)
        
        st.markdown("#### 💰 Harga (COST)")
        st.dataframe(pd.DataFrame({
            'Level': ['💰', '💰💰', '💰💰💰', '💰💰💰💰', '💰💰💰💰💰'],
            'Range': ['$5-$20', '$21-$50', '$51-$100', '$101-$200', '$201+'],
            'Nilai': [15, 35, 75, 150, 250]
        }), use_container_width=True, hide_index=True)

with tab4:
    st.markdown("### ✏️ Edit & Tambah Data")
    
    # Mode selector
    mode = st.radio("", ["📝 Edit Alternatif", "➕ Tambah Alternatif Baru"], horizontal=True, label_visibility="collapsed")
    
    st.markdown("---")
    
    if mode == "📝 Edit Alternatif":
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.info("💡 Edit data di sini akan otomatis tersimpan ke Excel")
        
        with col2:
            if st.button("🔄 Reload Data dari Excel", use_container_width=True):
                st.cache_data.clear()
                st.session_state.df_data = load_data()
                st.success("✅ Data berhasil direload!")
                st.rerun()
        
        st.markdown("---")
        
        # Pilih vendor untuk edit
        vendors = st.session_state.df_data['Vendor'].tolist()
        selected_vendor = st.selectbox("🔍 Pilih Provider untuk Edit:", vendors)
        
        # Get data vendor yang dipilih
        idx = st.session_state.df_data[st.session_state.df_data['Vendor'] == selected_vendor].index[0]
        current_data = st.session_state.df_data.loc[idx]
        
        st.markdown(f"### Editing: **{current_data['Vendor']}** - {current_data['Nama Paket (Plan)']}")
        
        # Form edit dengan 4 kolom
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.markdown("**🔧 CPU Level**")
            cpu_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=int(current_data['CPU_Level'])-1,
                format_func=lambda x: f"⭐{x} ({[2,4,6,8,10][x-1]} vCPU)",
                key="cpu_edit"
            )
        
        with col2:
            st.markdown("**💾 RAM Level**")
            ram_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=int(current_data['RAM_Level'])-1,
                format_func=lambda x: f"⭐{x} ({[2,4,8,16,32][x-1]} GB)",
                key="ram_edit"
            )
        
        with col3:
            st.markdown("**💿 Disk I/O Level**")
            diskio_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=int(current_data['DiskIO_Level'])-1,
                format_func=lambda x: f"⭐{x} ({[150,300,500,700,1000][x-1]} MB/s)",
                key="diskio_edit"
            )
        
        with col4:
            st.markdown("**💰 Harga Level**")
            price_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=int(current_data['Price_Level'])-1,
                format_func=lambda x: f"💰{x} (${[15,35,75,150,250][x-1]})",
                key="price_edit"
            )
        
        st.markdown("---")
        
        # Tombol save
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col2:
            if st.button("💾 Simpan ke Excel", type="primary", use_container_width=True):
                try:
                    # Load Excel
                    df_excel = pd.read_excel('TOPSIS_Input_Level.xlsx', sheet_name='1. Input Level', skiprows=2)
                    df_excel.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
                    
                    # Update data
                    excel_idx = df_excel[df_excel['Vendor'] == selected_vendor].index[0]
                    df_excel.loc[excel_idx, 'CPU_Level'] = cpu_level
                    df_excel.loc[excel_idx, 'RAM_Level'] = ram_level
                    df_excel.loc[excel_idx, 'DiskIO_Level'] = diskio_level
                    df_excel.loc[excel_idx, 'Price_Level'] = price_level
                    
                    # Save ke Excel
                    with pd.ExcelWriter('TOPSIS_Input_Level.xlsx', mode='a', if_sheet_exists='overlay', engine='openpyxl') as writer:
                        df_excel.to_excel(writer, sheet_name='1. Input Level', startrow=2, index=False, header=False)
                    
                    # Reload data
                    st.cache_data.clear()
                    st.session_state.df_data = load_data()
                    
                    st.success(f"✅ Data **{selected_vendor}** berhasil disimpan ke Excel!")
                    st.balloons()
                    st.rerun()
                    
                except Exception as e:
                    st.error(f"❌ Error: {str(e)}")
    
    else:  # Tambah Alternatif Baru
        st.markdown("### ➕ Tambah Alternatif Baru")
        st.info("💡 Alternatif baru akan ditambahkan ke Excel")
        
        col1, col2 = st.columns(2)
        
        with col1:
            new_vendor = st.text_input("🏢 Nama Vendor", placeholder="Contoh: AWS")
            new_paket = st.text_input("📦 Nama Paket", placeholder="Contoh: t3.medium")
        
        with col2:
            st.write("")  # Spacing
        
        st.markdown("#### Pilih Level untuk Setiap Kriteria")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.markdown("**🔧 CPU Level**")
            new_cpu_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=2,
                format_func=lambda x: f"⭐{x} ({[2,4,6,8,10][x-1]} vCPU)",
                key="cpu_new"
            )
        
        with col2:
            st.markdown("**💾 RAM Level**")
            new_ram_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=2,
                format_func=lambda x: f"⭐{x} ({[2,4,8,16,32][x-1]} GB)",
                key="ram_new"
            )
        
        with col3:
            st.markdown("**💿 Disk I/O Level**")
            new_diskio_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=2,
                format_func=lambda x: f"⭐{x} ({[150,300,500,700,1000][x-1]} MB/s)",
                key="diskio_new"
            )
        
        with col4:
            st.markdown("**💰 Harga Level**")
            new_price_level = st.selectbox(
                "Level",
                options=[1, 2, 3, 4, 5],
                index=2,
                format_func=lambda x: f"💰{x} (${[15,35,75,150,250][x-1]})",
                key="price_new"
            )
        
        st.markdown("---")
        
        # Tombol tambah
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col2:
            if st.button("➕ Tambah ke Excel", type="primary", use_container_width=True):
                if new_vendor and new_paket:
                    try:
                        # Load Excel
                        df_excel = pd.read_excel('TOPSIS_Input_Level.xlsx', sheet_name='1. Input Level', skiprows=2)
                        df_excel.columns = ['No', 'Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']
                        df_excel = df_excel.dropna(subset=['Vendor'])
                        
                        # Buat row baru
                        new_no = len(df_excel) + 1
                        new_row = pd.DataFrame({
                            'No': [new_no],
                            'Vendor': [new_vendor],
                            'Nama Paket (Plan)': [new_paket],
                            'CPU_Level': [new_cpu_level],
                            'RAM_Level': [new_ram_level],
                            'DiskIO_Level': [new_diskio_level],
                            'Price_Level': [new_price_level]
                        })
                        
                        # Append row baru
                        df_excel = pd.concat([df_excel, new_row], ignore_index=True)
                        
                        # Save ke Excel
                        with pd.ExcelWriter('TOPSIS_Input_Level.xlsx', mode='a', if_sheet_exists='overlay', engine='openpyxl') as writer:
                            df_excel.to_excel(writer, sheet_name='1. Input Level', startrow=2, index=False, header=False)
                        
                        # Reload data
                        st.cache_data.clear()
                        st.session_state.df_data = load_data()
                        
                        st.success(f"✅ Alternatif **{new_vendor} - {new_paket}** berhasil ditambahkan!")
                        st.balloons()
                        st.rerun()
                        
                    except Exception as e:
                        st.error(f"❌ Error: {str(e)}")
                else:
                    st.error("⚠️ Nama Vendor dan Paket harus diisi!")
    
    st.markdown("---")
    
    # Preview data saat ini
    st.markdown("### 📊 Preview Data Saat Ini")
    preview_df = st.session_state.df_data[['Vendor', 'Nama Paket (Plan)', 'CPU_Level', 'RAM_Level', 'DiskIO_Level', 'Price_Level']].copy()
    preview_df.columns = ['Vendor', 'Paket', 'CPU Lvl', 'RAM Lvl', 'I/O Lvl', 'Harga Lvl']
    st.dataframe(preview_df, use_container_width=True, height=400)
    
    st.caption(f"Total: {len(preview_df)} alternatif")

with tab5:
    st.markdown("### 📁 Data Lengkap")
    
    display_df = result[['Rank', 'Vendor', 'Nama Paket (Plan)', 
                         'CPU_val', 'RAM_val', 'DiskIO_val', 'Price_val', 'Score']].copy()
    display_df.columns = ['Rank', 'Vendor', 'Paket', 'CPU', 'RAM', 'Disk I/O', 'Harga', 'Score']
    
    st.dataframe(display_df, use_container_width=True, height=500)
    
    csv = display_df.to_csv(index=False).encode('utf-8')
    st.download_button("📥 Download CSV", csv, "hasil_topsis.csv", "text/csv", use_container_width=True)

st.markdown("---")
st.markdown("<p style='text-align: center; color: #64748b; font-size: 0.9rem;'>© 2025 PT Kajek Indonesia</p>", unsafe_allow_html=True)
