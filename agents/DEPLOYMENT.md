# Market Research Agent - Deployment Guide

## 🚀 Quick Start

### Step 1: Set Up Agentverse Account

1. Go to https://agentverse.ai and create an account
2. Generate API credentials
3. Copy your API key and Mailbox key

### Step 2: Configure Environment

Create `agents/.env` file:

```bash
# Required - Your OpenAI API key (same one used by MyStartup.ai)
OPENAI_API_KEY=your_openai_key_here

# Backend URL
BACKEND_URL=http://localhost:5000

# Agentverse Credentials (add after Step 1)
AGENTVERSE_API_KEY=your_agentverse_api_key
AGENTVERSE_MAILBOX_KEY=your_mailbox_key
```

### Step 3: Run the Agent Locally

```bash
# From the root directory
cd agents
python market_research_agent.py
```

You should see:
```
==================================================
🤖 MyStartup.ai Market Research Agent
==================================================
Agent Name: market_research_agent
Agent Address: agent1q... (your unique address)
Backend URL: http://localhost:5000
Status: Ready to perform market research!
==================================================
```

**Copy the Agent Address** - you'll need this for Agentverse registration!

### Step 4: Register on Agentverse

1. Log in to https://agentverse.ai
2. Click "Create Agent"
3. Enter your agent details:
   - **Name**: `market_research_agent`
   - **Address**: (paste the address from Step 3)
   - **Category**: Innovation Lab
   - **Tags**: hackathon, market-research, startup-analysis
4. Enable **Chat Protocol** for ASI:One discovery
5. Save the agent

### Step 5: Test via ASI:One

1. Go to ASI:One interface
2. Search for "market_research_agent"
3. Start a chat session
4. Send a startup idea, e.g., "AI-powered fitness coaching app"
5. The agent should analyze it and return market insights!

## 🔧 Deployment Options

### Option A: Run Locally (Development)

Best for: Testing and development

```bash
python agents/market_research_agent.py
```

### Option B: Deploy to Agentverse (Production)

Best for: 24/7 availability, ASI:One discovery

1. Follow Steps 1-4 above
2. In Agentverse dashboard, click "Deploy"
3. Agent will run on Agentverse infrastructure
4. Accessible via ASI:One permanently

### Option C: Deploy to Replit (Cloud)

Best for: Continuous operation with your platform

The agent is already in your Replit workspace and will run alongside your Express backend.

## 🧪 Testing the Agent

### Test 1: Local Backend Connection

```bash
# Make sure MyStartup.ai backend is running
npm run dev

# In another terminal, run the agent
cd agents
python market_research_agent.py
```

### Test 2: API Endpoint

```bash
curl -X POST http://localhost:5000/api/market-research/analyze \
  -H "Content-Type: application/json" \
  -d '{"idea": "AI-powered meal planning app for busy professionals"}'
```

### Test 3: Chat Protocol (via ASI:One)

1. Start the agent
2. Open ASI:One
3. Search for your agent address
4. Send a message with a startup idea
5. Verify you get back market research analysis

## 📊 What the Agent Does

1. **Receives** startup ideas via Chat Protocol
2. **Analyzes** using OpenAI GPT-4 (via MyStartup.ai backend)
3. **Returns** structured market research including:
   - Market size and growth rate
   - Key opportunities
   - Challenges
   - Competitive advantages
   - Viability score (0-100)
   - Strategic recommendations

## 🎯 ASI Alliance Hackathon Checklist

- [x] Built with uAgents framework
- [x] Chat Protocol implemented
- [ ] Registered on Agentverse (do Step 4)
- [ ] ASI:One compatible (automatic after registration)
- [x] Innovation Lab badges in README
- [x] Comprehensive documentation
- [ ] Demo video (record after deployment)

## 🐛 Troubleshooting

### Agent won't start

- Check Python version: `python --version` (need 3.11+)
- Install dependencies: `pip install -r requirements.txt`
- Check .env file exists and has correct values

### Backend connection fails

- Verify MyStartup.ai backend is running on port 5000
- Check BACKEND_URL in .env
- Test endpoint: `curl http://localhost:5000/api/auth/me`

### Agentverse registration fails

- Ensure agent is running first (to get address)
- Copy the FULL agent address (agent1q...)
- Enable Chat Protocol in Agentverse UI
- Add to Innovation Lab category

## 📝 Next Steps

1. ✅ Complete Agentverse registration
2. 🎬 Record 3-5 minute demo video showing:
   - Agent startup
   - ASI:One interaction
   - Market research results
   - Integration with MyStartup.ai
3. 🚀 Submit to ASI Alliance hackathon with:
   - GitHub repo link
   - Demo video
   - Agent address
   - README with badges

## 🎓 Resources

- [uAgents Documentation](https://fetch.ai/docs/guides/agents/getting-started)
- [Chat Protocol Spec](https://fetch.ai/docs/guides/agents/chat-protocol)
- [Agentverse Guide](https://fetch.ai/docs/guides/agentverse)
- [ASI Alliance Hackathon](https://agentverse.ai/hackathon)

---

**Good luck with your submission!** 🚀
