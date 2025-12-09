#!/bin/bash

echo "🚀 Starting TOPSIS Dashboard..."
echo "================================"
echo ""
echo "📊 Dashboard: http://localhost:8501"
echo "📁 Data Source: TOPSIS_Input_Level.xlsx"
echo ""
echo "💡 Tips:"
echo "   - Tekan Ctrl+C untuk stop"
echo "   - Gunakan sidebar untuk adjust bobot"
echo "   - Data diambil dari Excel sheet '1. Input Level'"
echo ""
echo "================================"
echo ""

streamlit run dashboard.py --server.port 8501
