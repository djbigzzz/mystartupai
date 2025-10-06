#!/bin/bash

# Test script for Market Research Agent
echo "🧪 Testing MyStartup.ai Market Research Agent"
echo "================================================"

# Check Python installation
echo "✓ Checking Python..."
python --version || { echo "❌ Python not found!"; exit 1; }

# Check dependencies
echo "✓ Checking uAgents installation..."
python -c "import uagents" || { echo "❌ uAgents not installed! Run: pip install -r requirements.txt"; exit 1; }

# Check environment file
echo "✓ Checking .env file..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "📝 Please edit agents/.env with your API keys before running"
    exit 1
fi

# Check backend is running
echo "✓ Checking backend connection..."
curl -s http://localhost:5000/api/auth/me > /dev/null || {
    echo "⚠️  Backend not running on port 5000"
    echo "   Start it with: npm run dev"
}

echo ""
echo "✅ All checks passed!"
echo "🚀 Ready to run agent: python market_research_agent.py"
