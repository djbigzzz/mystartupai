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

## How It Works

1. **User Input**: Receives startup idea via chat
2. **Analysis**: Performs market research using OpenAI GPT-4
3. **Output**: Returns structured market insights
4. **Collaboration**: Can share data with other agents (Business Plan, Pitch Deck, etc.)

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

Create a `.env` file (see `.env.example`):

```env
BACKEND_URL=http://localhost:5000
AGENTVERSE_MAILBOX_KEY=your_mailbox_key_here
MARKET_RESEARCH_AGENT_SEED=mystartup_market_research_secret
BUSINESS_PLAN_AGENT_SEED=mystartup_business_plan_secret
```

### Run the Agents

**Terminal 1 - Market Research Agent:**
```bash
python agents/market_research_agent.py
```

**Terminal 2 - Business Plan Agent:**
```bash
python agents/business_plan_agent.py
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
