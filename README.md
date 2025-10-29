# MyStartup.ai

**Your AI co-founder who won't let you build the wrong thing.**

Built for the Solana Colosseum Cypherpunk Hackathon | Qualifying for 3 side tracks ($40k total bounties)

---

## The Problem

Nine out of ten startups fail because founders build products nobody wants.

**The AI Coding Paradox:** Tools like Replit Agent, Lovable, Bolt.new, and v0.dev can now build a full app in under an hour. But validation still takes weeks and costs thousands. So instead of wasting months building one wrong idea, founders now waste days building ten wrong ideas.

Building got faster. Validation didn't. That's the gap we're filling.

## Our Solution

**Four AI co-founders who guide you from idea to investor-ready.**

**Vale (The Validator)** stops you from building the wrong thing. She runs real-time market research using Perplexity AI—analyzing competitors, market size, customer pain points, and funding landscape. You get a validation report with a clear verdict: GO, REFINE, or PIVOT. No expensive consultants. No waiting weeks. Just honest feedback in minutes.

Once Vale validates your idea, the team takes over:

**Stratos (The Strategist)** helps you talk to customers. He generates interview scripts, analyzes feedback, and prioritizes features based on what real users actually want.

**Archie (The Builder)** creates the documents investors expect. Business plans following Y Combinator standards, pitch decks that tell your story, and financial models that make sense.

**Blaze (The Growth Hacker)** connects you with the right people. He matches you with investors in your space and develops customer acquisition strategies that scale.

**The full journey:**
1. Vale validates your idea with live market research
2. Stratos guides customer discovery and feature prioritization  
3. Archie generates business plans and pitch decks
4. Blaze matches you with investors and growth channels
5. Now you're ready to build with Replit Agent or raise funding

We're not here to tell you your idea is great. We're here to tell you the truth, then help you build something that actually works.

---

## Solana Integration

MyStartup.ai is built natively on Solana:

**Phantom Wallet Authentication**
- Primary authentication method (Phantom, Solflare, etc.)
- No passwords, just your wallet
- SIWE protocol adapted for Solana

**Solana Pay Integration**
- Pay with SOL or USDC for credit packages
- QR code payments for mobile users
- Real-time transaction verification
- Devnet + Mainnet ready

**Sanctum Gateway (Transaction Optimization)**
- Automatic compute unit optimization
- Multi-channel delivery (RPC, Jito, Triton, Paladin)
- Real-time monitoring dashboard
- Automatic Jito tip refunds

**ASI Agents (Multi-Agent System)**
- Built with Fetch.ai uAgents framework
- Autonomous agent-to-agent communication
- ASI:One compatible with Chat Protocol
- Market research + business plan generation

**Mobile-Optimized PWA**
- Responsive design for all screen sizes
- Works seamlessly on Phantom mobile browser
- Progressive Web App features

---

## Tech Stack

**Blockchain**
- Solana (devnet + mainnet-beta ready)
- @solana/web3.js, @solana/pay, @solana/wallet-adapter
- Sanctum Gateway for transaction optimization

**AI & Intelligence**
- Claude 4.5 Sonnet (Anthropic) - Primary AI
- Perplexity AI (llama-3.1-sonar-large) - Real-time market research
- Fetch.ai uAgents v0.22.9 - Multi-agent orchestration
- OpenAI GPT-4o - Fallback AI

**Frontend**
- React 18 + TypeScript + Vite
- shadcn/ui (Radix UI primitives)
- Tailwind CSS with custom design system
- TanStack Query v5 + Wouter routing
- React Hook Form + Zod validation

**Backend**
- Node.js + Express.js + TypeScript
- PostgreSQL (Neon serverless) + Drizzle ORM
- Helmet, express-validator, rate limiting
- PostgreSQL-backed sessions

---

## Vale - The Validator (Live & Working)

Our flagship feature. Before founders write a single line of code, Vale validates their idea through:

**Progressive 3-Step Form**
1. Foundation - Idea title + problem statement
2. Solution - Solution approach + target market
3. Strategy - Competition + business model + unique value prop

**Live Market Research via Perplexity AI**
- Competitive landscape analysis (competitors, funding rounds)
- Market trends and size estimation (TAM/SAM/SOM)
- Customer insights from real user feedback
- Funding landscape (recent rounds, active investors)

**10-Dimension Validation Scoring**

Claude AI analyzes form data + live market research to score:
1. Problem clarity and market need
2. Solution viability and innovation
3. Target market size
4. Competitive differentiation
5. Business model feasibility
6. Revenue potential
7. Team capability
8. Market timing
9. Execution complexity
10. Risk factors

**Results:** GO (≥75) / REFINE (60-74) / PIVOT (<60) with actionable recommendations

**Iterative Refinement**
- Refine and re-validate to improve scores
- Track score progression across cycles
- See improvements with each iteration

**AI Assistance**
- Claude-powered suggestion buttons for each field
- Context-aware content generation
- Auto-save system (never lose your work)

---

## Why Solana?

**Real utility for real people.** Founders don't need crypto experience. They connect a Phantom wallet, pay with SOL or USDC, and get instant validation. MyStartup.ai brings Web2 users to Solana through genuine value, not speculation.

**Speed matters.** Our credit system requires high-throughput, low-cost transactions. Solana's speed enables real-time credit allocation at scale. Sanctum Gateway optimizes every transaction automatically.

**Consumer dApp done right.** Mobile-first PWA that works seamlessly on Phantom's mobile browser. Blockchain complexity is hidden. Value is delivered in under 5 minutes.

---

## Side Track Qualifications

**ASI Agents Track** ($20,000 USDC)
- Multi-agent orchestration with Fetch.ai uAgents
- Autonomous agent-to-agent communication
- See [`agents/README.md`](./agents/README.md)

**Sanctum Gateway Track** ($10,000 USDC)
- Complete transaction optimization integration
- Real-time monitoring dashboard
- See [`GATEWAY_INTEGRATION.md`](./GATEWAY_INTEGRATION.md)

**Superteam Ireland** ($10,000 USDC)
- Built and operated in Ireland
- Empowering Irish founders

---

## Project Structure

```
mystartupai/
├── client/                  # React frontend
│   └── src/
│       ├── pages/
│       │   ├── co-founder-validator.tsx    # Vale (live)
│       │   └── gateway-monitor.tsx         # Sanctum dashboard
│       └── components/
├── server/                  # Express backend
│   ├── routes.ts           # API endpoints
│   ├── gateway-service.ts  # Sanctum Gateway
│   ├── anthropic.ts        # Claude AI
│   └── auth.ts             # Solana wallet auth
├── shared/
│   └── schema.ts           # Drizzle ORM + Zod
├── agents/                  # ASI multi-agent system
│   ├── market_research_agent.py
│   └── business_plan_agent.py
└── docs/                    # Documentation
```

---

## Getting Started

**Prerequisites:** Node.js 20+, PostgreSQL, Solana wallet (Phantom)

```bash
# Clone and install
git clone https://github.com/djbigzzz/mystartupai.git
cd mystartupai
npm install

# Configure .env
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...
SOLANA_NETWORK=devnet
GATEWAY_API_KEY=your_key

# Run
npm run dev
```

Visit `http://localhost:5000`

---

## Demo

**Live Platform:** Deploying for hackathon submission
**Demo Video:** Recording in progress
**GitHub:** https://github.com/djbigzzz/mystartupai

---

## Developer

**Galin Dimitrov** ([@djbigzzz](https://github.com/djbigzzz))  
Location: Ireland 🇮🇪  
Hackathon: Solana Colosseum Cypherpunk  
Submission: October 30, 2025

---

## Acknowledgments

Built with support from:
- Solana Foundation
- Anthropic (Claude 4.5 Sonnet)
- Perplexity AI
- Sanctum (Gateway)
- Artificial Superintelligence Alliance (uAgents)

---

**Built with ❤️ in Ireland for the Solana ecosystem**

*Preventing founders from wasting time and money on unvalidated ideas.*

---

## License

MIT License
