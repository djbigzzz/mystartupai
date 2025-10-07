#!/bin/bash

# MyStartup.ai Multi-Agent System Startup Script
# This script starts both Market Research and Business Plan agents with proper configuration

set -e

echo "============================================================"
echo "MyStartup.ai Multi-Agent System Startup"
echo "============================================================"

# Set environment variables
export BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"

# Agent seeds must match what's hardcoded in the agent files
MARKET_RESEARCH_AGENT_SEED="mystartup_market_research_seed_phrase"
BUSINESS_PLAN_AGENT_SEED="mystartup_business_plan_seed_phrase"

# Compute Market Research Agent address from seed (this ensures address is always correct)
echo "Computing agent addresses from seeds..."
MARKET_RESEARCH_AGENT_ADDRESS=$(python -c "
from uagents import Agent
agent = Agent(name='market_research_agent', seed='$MARKET_RESEARCH_AGENT_SEED', port=8001)
print(agent.address)
" 2>/dev/null)

export MARKET_RESEARCH_AGENT_ADDRESS

echo ""
echo "Configuration:"
echo "  Backend URL: $BACKEND_URL"
echo "  Market Research Agent Seed: $MARKET_RESEARCH_AGENT_SEED"
echo "  Market Research Agent Address: $MARKET_RESEARCH_AGENT_ADDRESS"
echo ""

# Change to agents directory
cd "$(dirname "$0")"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down agents..."
    if [ ! -z "$MARKET_PID" ]; then
        kill $MARKET_PID 2>/dev/null || true
    fi
    if [ ! -z "$BUSINESS_PID" ]; then
        kill $BUSINESS_PID 2>/dev/null || true
    fi
    echo "Agents stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Market Research Agent
echo "Starting Market Research Agent (port 8001)..."
python market_research_agent.py &
MARKET_PID=$!
echo "  ✓ Market Research Agent started (PID: $MARKET_PID)"

# Wait a moment for first agent to initialize
sleep 3

# Start Business Plan Agent
echo "Starting Business Plan Agent (port 8002)..."
python business_plan_agent.py &
BUSINESS_PID=$!
echo "  ✓ Business Plan Agent started (PID: $BUSINESS_PID)"

# Compute Business Plan Agent address for logging
BUSINESS_PLAN_AGENT_ADDRESS=$(python -c "
from uagents import Agent
agent = Agent(name='business_plan_agent', seed='$BUSINESS_PLAN_AGENT_SEED', port=8002)
print(agent.address)
" 2>/dev/null)

echo ""
echo "============================================================"
echo "Multi-Agent System Running"
echo "============================================================"
echo ""
echo "Market Research Agent:"
echo "  - Port: 8001"
echo "  - Address: $MARKET_RESEARCH_AGENT_ADDRESS"
echo "  - Inspector: https://agentverse.ai/inspect/?uri=http%3A//127.0.0.1%3A8001&address=$MARKET_RESEARCH_AGENT_ADDRESS"
echo ""
echo "Business Plan Agent:"
echo "  - Port: 8002"
echo "  - Address: $BUSINESS_PLAN_AGENT_ADDRESS"
echo "  - Inspector: https://agentverse.ai/inspect/?uri=http%3A//127.0.0.1%3A8002&address=$BUSINESS_PLAN_AGENT_ADDRESS"
echo ""
echo "Press Ctrl+C to stop all agents"
echo "============================================================"

# Wait for agents to finish
wait
