#!/bin/bash

# MTC Quiz Application - Modern Implementation Complete! ✅
# This script helps you get started with the modernized React application

echo "🚀 MTC Quiz Application - Modern Setup"
echo "======================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js installed: $(node --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
if npm install > /dev/null 2>&1; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎨 Modern Features Ready:"
echo "  ✨ 12 Professional Themes"
echo "  🎭 Smooth Animations"
echo "  🔊 Audio Feedback"
echo "  📱 Fully Responsive"
echo "  🌓 Dark/Light Mode"
echo "  ♿ Accessibility Support"
echo ""

echo "🚀 Starting development server..."
echo "   📍 Open browser to: http://localhost:5173"
echo ""

npm run dev
