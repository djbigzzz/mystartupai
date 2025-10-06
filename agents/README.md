# MyStartup.ai Market Research Agent

![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)

## Overview

The **Market Research Agent** is an autonomous AI agent that performs intelligent market analysis for startup ideas. Built for the ASI Alliance hackathon, it leverages the Fetch.ai uAgents framework and integrates with the MyStartup.ai platform.

## Agent Details

- **Name**: `market_research_agent`
- **Address**: _(Will be generated after Agentverse deployment)_
- **Port**: 8001
- **Chat Protocol**: Enabled ✅
- **ASI:One Compatible**: Yes ✅

## Features

🔍 **Intelligent Market Analysis**
- Analyzes startup ideas using AI-powered insights
- Provides competitive landscape analysis
- Identifies market opportunities and challenges

🤝 **Multi-Agent Communication**
- Communicates with other MyStartup.ai agents
- Shares insights across the agent ecosystem
- Supports agent-to-agent collaboration

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
pip install uagents requests
```

### Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_key_here
BACKEND_URL=http://localhost:5000
```

### Run the Agent

```bash
python agents/market_research_agent.py
```

## Agentverse Deployment

1. Register agent on Agentverse
2. Configure endpoint and API keys
3. Enable Chat Protocol for ASI:One discovery
4. Test via ASI:One interface

## Integration with MyStartup.ai

This agent is part of the **MyStartup.ai** ecosystem, a Solana-native AI startup accelerator. It works alongside:

- Business Plan Agent
- Pitch Deck Agent  
- Financial Modeling Agent
- Investor Matching Agent

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
├── market_research_agent.py    # Main agent code
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
