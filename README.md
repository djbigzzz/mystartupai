# MyStartup.ai 🚀

**Agentic AI co-founder that validates startup ideas before founders waste time and money.**

Built for **Solana Colosseum Cypherpunk Hackathon** | Competing for **$40,000 across 3 side tracks**

[![ASI Agents Track](https://img.shields.io/badge/ASI_Agents_Track-$20K-3D8BD3?style=for-the-badge)](https://earn.superteam.fun/listing/asi-agents-track)
[![Sanctum Gateway Track](https://img.shields.io/badge/Sanctum_Gateway_Track-$10K-5F43F1?style=for-the-badge)](https://earn.superteam.fun/listing/sanctum-gateway-track)
[![Superteam Ireland](https://img.shields.io/badge/Superteam_Ireland-$10K-00D084?style=for-the-badge)](https://earn.superteam.fun/listing/superteam-ireland-or-dogpatch-labs-side-track)

---

## 🎯 What is MyStartup.ai?

MyStartup.ai is an AI-powered startup accelerator featuring **4 specialized AI co-founders** that guide founders from idea to investor-readiness:

- **Vale (The Validator)** - Validates ideas through real-time market research
- **Stratos (The Strategist)** - Customer discovery and feature prioritization
- **Archie (The Builder)** - Business plans, pitch decks, financial models
- **Blaze (The Growth Hacker)** - Investor matching and growth strategies

### The Problem We Solve

**9 out of 10 startups fail.** The #1 reason? Founders waste months and thousands of dollars building products nobody wants.

### Our Solution

MyStartup.ai uses **AI-powered validation** with real-time market research to prevent founders from building the wrong thing. Before writing a single line of code, founders get:
- ✅ 10-dimension validation scoring
- ✅ Live competitor analysis via Perplexity AI
- ✅ Market size estimation
- ✅ Customer insights from real web data
- ✅ GO/REFINE/PIVOT verdicts with actionable feedback

---

## 🏆 Hackathon Side Track Submissions

### 1️⃣ ASI Agents Track ($20,000 USDC) 

**Multi-Agent Orchestration with Fetch.ai uAgents Framework**

We've built a **truly autonomous multi-agent system** where specialized AI agents communicate directly with each other to deliver comprehensive startup analysis:

#### 🤖 Our Agents

**Market Research Agent** (`agents/market_research_agent.py`)
- Analyzes startup ideas using AI-powered insights
- Provides competitive landscape analysis
- Identifies market opportunities and threats
- ASI:One compatible with Chat Protocol ✅

**Business Plan Agent** (`agents/business_plan_agent.py`)
- Generates comprehensive business plans
- **Coordinates directly with Market Research Agent** via agent-to-agent communication
- Compiles market research into investor-ready documents
- ASI:One compatible with Chat Protocol ✅

#### 🔗 Agent-to-Agent Communication Protocol

```
User → Business Plan Agent → Market Research Agent → AI Analysis → Business Plan
```

**Protocol Format:**
```
AGENT_REQUEST:<request_id>:<startup_idea>
AGENT_RESPONSE:<request_id>:SUCCESS:<analysis_data>
```

This demonstrates **true autonomous collaboration** - agents communicate directly, not just through a shared backend.

#### ✅ ASI Alliance Compliance
- ✅ Built with uAgents framework v0.22.9
- ✅ Registered on Agentverse
- ✅ Chat Protocol enabled for ASI:One discovery
- ✅ Multi-agent orchestration with asynchronous coordination
- ✅ Innovation Lab categorized

**📂 See Full Documentation:** [`agents/README.md`](./agents/README.md)

---

### 2️⃣ Sanctum Gateway Track ($10,000 USDC)

**Complete Integration of Sanctum's Transaction Optimization & Delivery API**

MyStartup.ai integrates **Sanctum Gateway** for high-performance Solana transaction processing with automatic optimization and multi-channel delivery.

#### 🚀 What We Built

**Gateway Service** (`server/gateway-service.ts`)
- `optimizeTransaction()` - Automatic compute unit and priority fee optimization
- `sendTransaction()` - Multi-channel delivery (RPC, Triton, Paladin, Jito)
- `getTransactionStatus()` - Real-time transaction monitoring
- Configurable tip ranges and expiry controls

**API Endpoints** (`server/routes.ts`)
- `GET /api/gateway/status` - Gateway configuration status
- `GET /api/gateway/transaction/:signature` - Transaction lookup
- `GET /api/gateway/transactions` - User transaction history

**Gateway Monitor Dashboard** (`client/src/pages/gateway-monitor.tsx`)
- 📊 Real-time Gateway status display
- 🔍 Transaction signature lookup with Solana Explorer integration
- 📈 Recent transactions with status badges (Completed/Pending/Failed)
- 🎨 Beautiful dark theme UI optimized for production monitoring

#### 💎 Key Features
- **Cost Savings**: Automatic Jito tip refunds when RPC lands first
- **Reliability**: Multi-channel delivery ensures maximum success rate
- **Observability**: Real-time transaction monitoring and metrics
- **Scalability**: Ready for programmatic operations and batch transactions

**📂 See Full Documentation:** [`GATEWAY_INTEGRATION.md`](./GATEWAY_INTEGRATION.md)

---

### 3️⃣ Superteam Ireland | Dogpatch Labs ($10,000 USDC)

**Ireland-Based Solana Startup Accelerator**

MyStartup.ai is proudly **built and operated in Ireland**, empowering Irish entrepreneurs to build on Solana and access global funding opportunities.

#### 🇮🇪 Ireland Impact
- **Location**: Republic of Ireland
- **Mission**: Democratize access to AI-powered startup validation for Irish founders
- **Solana Integration**: Phantom wallet authentication, Solana Pay credit system
- **Mobile-First**: PWA-optimized for accessibility across Ireland

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query v5
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript (ES modules)
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **AI**: Claude 4.5 Sonnet (Anthropic), Perplexity AI (real-time web research)
- **Security**: Helmet, express-validator, rate limiting

### Blockchain & Payments
- **Blockchain**: Solana (devnet + mainnet-beta)
- **Wallet**: Phantom wallet integration
- **Payments**: Solana Pay (SOL + USDC)
- **Transaction Optimization**: Sanctum Gateway
- **Libraries**: @solana/web3.js, @solana/pay

### AI & Agents
- **Multi-Agent Framework**: Fetch.ai uAgents v0.22.9
- **AI Models**: Claude Sonnet 4, OpenAI GPT-4
- **Market Research**: Perplexity AI (llama-3.1-sonar-large-128k-online)
- **Agent Protocol**: Chat Protocol (ASI Alliance)

---

## 🎨 Key Features

### 🔍 The Validator (Stage 1)
**Progressive Multi-Step Validation Form**
- 3-stage guided input: Foundation → Solution → Strategy
- Auto-expanding textareas with character count (2000 max)
- AI suggestion buttons powered by Claude 4.5
- Auto-save system with 500ms debouncing
- Visual progress stepper (1/3, 2/3, 3/3)

**Real-Time Market Research via Perplexity AI**
- Live web research across 4 dimensions:
  - Competitive landscape (competitors, funding rounds)
  - Market trends (size, growth, TAM)
  - Customer insights (pain points, feedback)
  - Funding landscape (recent rounds, active investors)
- Animated progress visualization (60-90 second research)
- Integration with Claude AI for comprehensive analysis

**10-Dimension Validation Scoring**
- Problem clarity and market need
- Solution viability and innovation
- Target market size and accessibility
- Competitive differentiation
- Business model feasibility
- Revenue potential and scalability
- Team capability assessment
- Market timing and trends
- Execution complexity
- Risk factors and mitigation

**Iterative Refinement System**
- "Refine & Re-Validate" for continuous improvement
- Score comparison with improvement tracking
- Complete validation history in database (jsonb array)
- Progressive unlock when score ≥ 60

### 🎯 Additional AI Co-Founders
- **The Strategist** - Customer discovery, interview scripts (unlocks at score > 60)
- **The Builder** - Business plans, pitch decks, financial models
- **The Growth Hacker** - Investor matching, acquisition strategies

### 💳 Subscription System
- **Usage-based billing** with monthly subscriptions
- **Credit allocation**: Core ($10/month - 500 credits), Pro ($50/month - 3000 credits)
- **Solana Pay integration**: SOL + USDC payments
- **Overage tracking** and usage alerts

### 🎨 Design System
- **Themes**: Light, Dark, Cypherpunk (Matrix terminal aesthetic)
- **Brand gradients**: Blue → Purple → Cyan
- **Typography scale**: Responsive headings (H1-H6)
- **Spacing tokens**: Consistent section/card/grid spacing
- **Accessibility**: prefers-reduced-motion support

---

## 📁 Project Structure

```
mystartupai/
├── agents/                          # ASI Agents ($20K Track)
│   ├── market_research_agent.py     # Market analysis agent
│   ├── business_plan_agent.py       # Business plan generator
│   ├── requirements.txt             # Python dependencies
│   └── README.md                    # Agent documentation
├── client/                          # React frontend
│   └── src/
│       ├── pages/
│       │   ├── co-founder-validator.tsx    # Vale (The Validator)
│       │   ├── gateway-monitor.tsx         # Sanctum Gateway dashboard
│       │   └── ...
│       └── components/
├── server/                          # Express backend
│   ├── gateway-service.ts           # Sanctum Gateway integration
│   ├── routes.ts                    # API endpoints
│   ├── anthropic.ts                 # Claude AI integration
│   ├── storage.ts                   # Database layer
│   └── ...
├── shared/                          # Shared TypeScript types
│   └── schema.ts                    # Drizzle ORM schemas
├── GATEWAY_INTEGRATION.md           # Sanctum Gateway docs
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Python 3.11+ (for ASI agents)

### Installation

```bash
# Clone the repository
git clone https://github.com/djbigzzz/mystartupai.git
cd mystartupai

# Install Node.js dependencies
npm install

# Install Python dependencies for agents
pip install -r agents/requirements.txt
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_postgres_connection_string

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key

# Solana
SOLANA_NETWORK=devnet  # or mainnet-beta
SOLANA_RECIPIENT_WALLET=your_wallet_address
GATEWAY_API_KEY=your_sanctum_gateway_api_key

# ASI Agents
AGENTVERSE_MAILBOX_KEY=your_agentverse_mailbox_key

# Session
SESSION_SECRET=your_random_session_secret
```

### Run the Application

**Start the web application:**
```bash
npm run dev
```

**Start the ASI agents:**
```bash
cd agents
./start_agents.sh
```

The application will be available at `http://localhost:5000`

---

## 🧪 Testing

### Gateway Monitor
Visit `/gateway-monitor` to test Sanctum Gateway integration:
- Check Gateway configuration status
- Look up transaction signatures
- View recent Solana Pay transactions

### ASI Agents
Test agent communication via ASI:One Chat Protocol after deploying to Agentverse.

---

## 📊 Demo & Screenshots

**Live Platform**: Coming soon  
**Demo Video**: Coming soon  
**Gateway Monitor**: `/gateway-monitor`

---

## 🏅 Why MyStartup.ai Qualifies for Each Track

### ASI Agents Track
✅ **Multi-agent orchestration** with direct agent-to-agent communication  
✅ **Chat Protocol** for ASI:One compatibility  
✅ **Autonomous collaboration** between Market Research and Business Plan agents  
✅ **Real-world use case** solving actual startup validation problems  

### Sanctum Gateway Track
✅ **Complete Gateway integration** with optimization and delivery  
✅ **Production monitoring dashboard** for transaction observability  
✅ **Real Solana Pay integration** for credit purchases  
✅ **Future-ready architecture** for programmatic operations  

### Superteam Ireland Track
✅ **Built in Ireland** (Republic)  
✅ **Empowering Irish founders** with AI-powered validation  
✅ **Solana-native** payment and authentication  
✅ **Mobile-optimized PWA** for accessibility  

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Developer

**GitHub**: [@djbigzzz](https://github.com/djbigzzz)  
**Location**: Ireland 🇮🇪  
**Hackathon**: Solana Colosseum Cypherpunk  

---

## 🙏 Acknowledgments

- **Solana Foundation** for the Colosseum hackathon
- **Artificial Superintelligence Alliance** for the ASI Agents track
- **Sanctum** for the Gateway integration track
- **Superteam Ireland** for supporting Irish builders
- **Anthropic** for Claude 4.5 Sonnet
- **Perplexity AI** for real-time market research

---

**Built with ❤️ in Ireland for the Solana Colosseum Cypherpunk Hackathon**

*Preventing founders from wasting time and money on unvalidated ideas, one startup at a time.* 🚀
