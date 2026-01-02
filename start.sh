#!/bin/bash

echo "🚀 Starting SPK Kajek Application..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Start backend (if exists)
if [ -d "backend" ]; then
    echo "🔧 Starting backend server..."
    cd backend
    if [ -f "requirements.txt" ]; then
        # Check if virtual environment exists
        if [ ! -d "venv" ]; then
            echo "📦 Creating virtual environment..."
            python3 -m venv venv
        fi
        
        echo "🔄 Activating virtual environment..."
        source venv/bin/activate
        
        echo "📥 Installing backend dependencies..."
        pip install -r requirements.txt
        
        echo "🚀 Starting Flask server..."
        python app.py &
        BACKEND_PID=$!
    fi
    cd ..
fi

# Start frontend
echo "🎨 Starting frontend development server..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🚀 Starting Vite development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
