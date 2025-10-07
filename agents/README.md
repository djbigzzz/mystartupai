# MyStartup.ai Multi-Agent System

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)
![tag:multi-agent](https://img.shields.io/badge/multi--agent-FF6B6B)

## Overview

The **MyStartup.ai Multi-Agent System** demonstrates autonomous agent orchestration for startup development. Built for the ASI Alliance hackathon, it showcases **two specialized agents** working together to help entrepreneurs build better businesses.

## Agents

### 1. Market Research Agent
- **Name**: `market_research_agent`
- **Port**: 8000
- **Function**: Analyzes startup ideas, provides market insights
- **Chat Protocol**: Enabled ✅

### 2. Business Plan Agent
- **Name**: `business_plan_agent`
- **Port**: 8001
- **Function**: Generates comprehensive business plans
- **Chat Protocol**: Enabled ✅
- **Coordinates with**: Market Research Agent

Both agents are **ASI:One Compatible** ✅

## Features

🤝 **Multi-Agent Orchestration**
- Business Plan Agent coordinates with Market Research Agent
- Demonstrates autonomous agent collaboration
- Shared backend for unified AI analysis

🔍 **Intelligent Market Analysis**
- Analyzes startup ideas using AI-powered insights
- Provides competitive landscape analysis
- Identifies market opportunities and challenges

📋 **Comprehensive Business Plans**
- Generates executive summaries
- Creates financial projections
- Develops go-to-market strategies

💬 **Natural Language Interface**
- Accessible via ASI:One Chat Protocol
- Supports conversational interactions
- Provides structured market research outputs

## How It Works - Multi-Agent Collaboration

### User → Business Plan Agent Flow:
1. **User sends startup idea** to Business Plan Agent via ASI:One Chat
2. **Business Plan Agent** receives the idea and validates it
3. **Agent-to-Agent Communication**: Business Plan Agent sends `AGENT_REQUEST` to Market Research Agent
4. **Market Research Agent** performs AI analysis and responds with `AGENT_RESPONSE`
5. **Business Plan Agent** compiles the market research into a complete business plan
6. **User receives** comprehensive business plan with integrated market analysis

### Direct User → Market Research Agent Flow:
1. **User sends startup idea** to Market Research Agent via ASI:One Chat
2. **Market Research Agent** performs AI-powered market analysis
3. **User receives** detailed market research insights

This demonstrates **true autonomous agent orchestration** where agents communicate directly with each other, not just through a shared backend.

## Setup & Installation

### Prerequisites

- Python 3.11+
- Fetch.ai uAgents framework
- MyStartup.ai backend running (Node.js/Express)
- OpenAI API key

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

**Required:**
- `AGENTVERSE_MAILBOX_KEY` - Your Agentverse mailbox key (already configured in Replit secrets)
- `MARKET_RESEARCH_AGENT_ADDRESS` - Address of Market Research Agent (auto-set by start_agents.sh)

**Optional:**
- `BACKEND_URL` - MyStartup.ai backend URL (default: http://localhost:5000)
- `MARKET_RESEARCH_AGENT_SEED` - Seed for Market Research Agent (default: mystartup_market_research_secret)
- `BUSINESS_PLAN_AGENT_SEED` - Seed for Business Plan Agent (default: mystartup_business_plan_secret)

**Note:** When using `start_agents.sh`, all configuration is handled automatically.

### Run the Agents

**Quick Start (Recommended):**
```bash
./agents/start_agents.sh
```

This script automatically:
- Sets the Market Research Agent address for Business Plan Agent
- Starts both agents with proper configuration
- Handles graceful shutdown with Ctrl+C

**Manual Start (Alternative):**

If you need to start agents individually, first compute the Market Research Agent address:

```bash
cd agents
# Get the Market Research Agent address
python -c "from uagents import Agent; agent = Agent(name='market_research_agent', seed='mystartup_market_research_seed_phrase', port=8001); print(agent.address)"
```

Then start the agents:

**Terminal 1 - Market Research Agent:**
```bash
cd agents
python market_research_agent.py
```

**Terminal 2 - Business Plan Agent:**
```bash
cd agents
export MARKET_RESEARCH_AGENT_ADDRESS="<address_from_above>"
python business_plan_agent.py
```

## Agentverse Deployment

1. Register agent on Agentverse
2. Configure endpoint and API keys
3. Enable Chat Protocol for ASI:One discovery
4. Test via ASI:One interface

## Integration with MyStartup.ai

These agents are part of the **MyStartup.ai** ecosystem, a Solana-native AI startup accelerator competing in **two hackathons simultaneously**:

### Colosseum Hackathon (Solana)
- Solana wallet authentication
- Credit-based subscriptions
- Solana Pay integration

### ASI Alliance Hackathon  
- Multi-agent orchestration ✅
- Chat Protocol integration ✅
- Autonomous agent collaboration ✅

## Agent-to-Agent Communication Protocol

The multi-agent system uses a simple message-based protocol:

**Request Format (Business Plan → Market Research):**
```
AGENT_REQUEST:<request_id>:<startup_idea>
```

**Response Format (Market Research → Business Plan):**
```
AGENT_RESPONSE:<request_id>:SUCCESS:<analysis_data>
AGENT_RESPONSE:<request_id>:ERROR:<error_message>
```

This protocol enables:
- ✅ Asynchronous agent coordination
- ✅ Request/response correlation via unique IDs
- ✅ Error handling across agent boundaries
- ✅ Scalable multi-agent workflows

## Demo

_(Video demo link will be added after recording)_

## Tech Stack

- **Framework**: Fetch.ai uAgents v0.22.9
- **AI Model**: OpenAI GPT-4
- **Backend**: Node.js/Express
- **Blockchain**: Solana (for payments)
- **Protocol**: Chat Protocol (ASI Alliance)

## Repository Structure

```
agents/
├── market_research_agent.py    # Market Research Agent
├── business_plan_agent.py       # Business Plan Agent
├── README.md                    # This file
└── requirements.txt             # Python dependencies
```

## ASI Alliance Compliance

✅ Built with uAgents framework  
✅ Registered on Agentverse  
✅ Chat Protocol enabled  
✅ ASI:One compatible  
✅ Innovation Lab categorized  
✅ Autonomous and intelligent  

## License

MIT License - Part of MyStartup.ai platform

## Contact

For questions about this agent or the MyStartup.ai platform, please open an issue on GitHub.

---

**Built for the ASI Alliance Hackathon** 🚀  
*Pioneering the future of decentralized AI for startup acceleration*
