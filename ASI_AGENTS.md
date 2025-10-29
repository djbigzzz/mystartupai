# ASI Multi-Agent System Integration

## Overview

MyStartup.ai has integrated the **Fetch.ai uAgents framework** to create an autonomous multi-agent system for startup validation and business planning. Two specialized agents work together to help entrepreneurs build better businesses through intelligent orchestration.

## What are ASI Agents?

ASI (Artificial Superintelligence Alliance) agents are autonomous programs built with the Fetch.ai uAgents framework that:
- Communicate independently with each other
- Execute tasks without human intervention
- Support natural language interaction via Chat Protocol
- Are discoverable and accessible through ASI:One
- Enable scalable multi-agent workflows

## Our Multi-Agent System

### 1. Market Research Agent
- **Name**: `market_research_agent`
- **Port**: 8000
- **Function**: Analyzes startup ideas and provides market insights
- **Chat Protocol**: Enabled ✅
- **ASI:One Compatible**: Yes ✅

### 2. Business Plan Agent
- **Name**: `business_plan_agent`
- **Port**: 8001
- **Function**: Generates comprehensive business plans
- **Chat Protocol**: Enabled ✅
- **Coordinates with**: Market Research Agent
- **ASI:One Compatible**: Yes ✅

## How Multi-Agent Collaboration Works

### User → Business Plan Agent Flow

1. **User sends startup idea** to Business Plan Agent via ASI:One Chat
2. **Business Plan Agent** receives the idea and validates it
3. **Agent-to-Agent Communication**: Business Plan Agent sends `AGENT_REQUEST` to Market Research Agent
4. **Market Research Agent** performs AI analysis and responds with `AGENT_RESPONSE`
5. **Business Plan Agent** compiles the market research into a complete business plan
6. **User receives** comprehensive business plan with integrated market analysis

### Direct User → Market Research Agent Flow

1. **User sends startup idea** to Market Research Agent via ASI:One Chat
2. **Market Research Agent** performs AI-powered market analysis
3. **User receives** detailed market research insights

This demonstrates **true autonomous agent orchestration** where agents communicate directly with each other, not just through a shared backend.

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
- Asynchronous agent coordination
- Request/response correlation via unique IDs
- Error handling across agent boundaries
- Scalable multi-agent workflows

## Technical Implementation

### Framework & Dependencies
- **Framework**: Fetch.ai uAgents v0.22.9
- **AI Backend**: MyStartup.ai Node.js/Express server
- **AI Models**: Claude 4.5 Sonnet (primary), OpenAI GPT-4 (fallback)
- **Protocol**: ASI Chat Protocol for natural language interaction

### File Structure
```
agents/
├── market_research_agent.py    # Market Research Agent
├── business_plan_agent.py      # Business Plan Agent
├── start_agents.sh             # Automated startup script
├── requirements.txt            # Python dependencies
└── README.md                   # Technical documentation
```

### Environment Configuration

**Required:**
- `AGENTVERSE_MAILBOX_KEY` - Your Agentverse mailbox key
- `MARKET_RESEARCH_AGENT_ADDRESS` - Address of Market Research Agent

**Optional:**
- `BACKEND_URL` - MyStartup.ai backend URL (default: http://localhost:5000)
- `MARKET_RESEARCH_AGENT_SEED` - Seed for Market Research Agent
- `BUSINESS_PLAN_AGENT_SEED` - Seed for Business Plan Agent

### Running the Agents

**Quick Start:**
```bash
./agents/start_agents.sh
```

This script automatically:
- Sets the Market Research Agent address for Business Plan Agent
- Starts both agents with proper configuration
- Handles graceful shutdown with Ctrl+C

**Manual Start:**

Terminal 1 - Market Research Agent:
```bash
cd agents
python market_research_agent.py
```

Terminal 2 - Business Plan Agent:
```bash
cd agents
export MARKET_RESEARCH_AGENT_ADDRESS="<address_from_market_research_agent>"
python business_plan_agent.py
```

## Integration with MyStartup.ai

The multi-agent system is deeply integrated with the MyStartup.ai platform:

**Backend Integration:**
- Agents make HTTP requests to MyStartup.ai backend
- Share Claude 4.5 Sonnet AI analysis with web platform
- Unified validation scoring across chat and web interfaces

**Data Flow:**
- User submits idea via ASI:One Chat → Agent processes → Backend analyzes → Response via Chat
- Agents can trigger the same validation pipeline as the web platform
- Results are consistent whether accessed via chat or web UI

**Why Both Web UI and Agents?**
- **Web UI (Vale)**: Interactive, visual, iterative refinement with live market research
- **Chat Agents**: Quick validation via natural language, accessible through ASI:One
- **Different use cases**: Chat for speed, web for depth

## ASI Alliance Compliance

✅ Built with uAgents framework  
✅ Registered on Agentverse  
✅ Chat Protocol enabled  
✅ ASI:One compatible  
✅ Autonomous agent-to-agent communication  
✅ Intelligent task execution  

## Agentverse Deployment

1. Register agents on Agentverse
2. Configure endpoint and API keys
3. Enable Chat Protocol for ASI:One discovery
4. Test via ASI:One interface
5. Verify agent-to-agent communication

## Why Multi-Agent Architecture?

**Separation of Concerns:**
- Market Research Agent focuses on competitive analysis
- Business Plan Agent focuses on document generation
- Each agent has specialized knowledge and capabilities

**Scalability:**
- New agents can be added without modifying existing ones
- Agent-to-agent protocol supports complex workflows
- Distributed processing for better performance

**Autonomy:**
- Agents make decisions independently
- No central orchestrator required
- Resilient to individual agent failures

## Key Features Demonstrated

**Multi-Agent Orchestration:**
- Business Plan Agent coordinates with Market Research Agent
- Demonstrates autonomous agent collaboration
- Shows practical value of agent-to-agent communication

**Intelligent Market Analysis:**
- AI-powered competitive landscape analysis
- Market opportunity identification
- Risk assessment and mitigation strategies

**Comprehensive Business Planning:**
- Executive summary generation
- Financial projection creation
- Go-to-market strategy development

**Natural Language Interface:**
- Accessible via ASI:One Chat Protocol
- Conversational interactions
- Structured outputs for business planning

## Developer Information

**Repository**: https://github.com/djbigzzz/mystartupai  
**Developer**: Galin Dimitrov ([@djbigzzz](https://github.com/djbigzzz))  
**Location**: Ireland 🇮🇪  
**Hackathon**: Solana Colosseum Cypherpunk  
**Submission Date**: October 30, 2025

## Technical Documentation

For detailed technical documentation on running and developing the agents, see [`agents/README.md`](./agents/README.md).

---

**Built with support from the Artificial Superintelligence Alliance**

*Autonomous AI agents for startup validation and business planning*
