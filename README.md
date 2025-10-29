# MyStartup.ai 🚀

**Agentic AI co-founder that validates startup ideas before founders waste time and money.**

Built for the **Solana Colosseum Cypherpunk Hackathon**

[![Solana](https://img.shields.io/badge/Built_on-Solana-14F195?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![PWA](https://img.shields.io/badge/Mobile_Optimized-PWA-5A0FC8?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## The Problem

Nine out of ten startups fail because founders build products nobody wants.

**The AI Coding Paradox:** Tools like Replit Agent, Lovable, Bolt.new, and v0.dev can now build a full app in under an hour. But validation still takes weeks and costs thousands. So instead of wasting months building one wrong idea, founders now waste days building ten wrong ideas.

Building got faster. Validation didn't. That's the gap we're filling.

## Our Solution

**Your AI co-founder who won't let you build the wrong thing.**

Meet Vale, The Validator. Before you write a single line of code, Vale runs real-time market research using Perplexity AI to analyze competitors, market size, customer pain points, and funding landscape. You get a comprehensive validation report with a clear verdict: GO, REFINE, or PIVOT.

No expensive consultants. No waiting weeks for research reports. Just honest feedback in minutes, powered by live web data and Y Combinator-inspired methodology.

**The workflow:**
1. Tell Vale your idea (3-minute form)
2. Vale conducts live market research across the web
3. Get scored across 10 dimensions with actionable recommendations
4. Refine and re-validate until your score is strong
5. Then—and only then—build it with Replit Agent or Lovable

Think of us as the sanity check before you start building. We're not here to tell you your idea is great. We're here to tell you the truth.

---

## ⚡ Solana Integration

MyStartup.ai is built natively on Solana with multiple integrations:

### 🔐 Phantom Wallet Authentication
- Seamless wallet connection (Phantom, Solflare, etc.)
- Sign-in with Ethereum (SIWE) protocol adapted for Solana
- No passwords, just your wallet

### 💳 Solana Pay Integration
- **Pay with SOL or USDC** for credit packages
- QR code payments for mobile users
- Real-time transaction verification on Solana blockchain
- Devnet testing + Mainnet ready

### ⚡ Sanctum Gateway (Transaction Optimization)
- Automatic compute unit optimization
- Multi-channel delivery (RPC, Jito, Triton, Paladin)
- Real-time transaction monitoring dashboard
- Cost savings through automatic Jito tip refunds

### 🤖 ASI Agents (Multi-Agent System)
- Built with Fetch.ai uAgents framework
- Autonomous agent-to-agent communication
- ASI:One compatible with Chat Protocol
- Market research + business plan generation agents

### 📱 Mobile-Optimized PWA
- Responsive design for all screen sizes
- Touch-optimized UI for mobile interactions
- Progressive Web App features
- Works seamlessly on Phantom mobile browser

---

## 🛠️ Tech Stack

### Blockchain & Payments
- **Blockchain**: Solana (devnet + mainnet-beta ready)
- **Wallet Integration**: Phantom, Solflare (via @solana/wallet-adapter)
- **Payments**: Solana Pay (SOL + USDC)
- **Transaction Optimization**: Sanctum Gateway
- **Libraries**: @solana/web3.js v1.98.4, @solana/pay v0.2.6

### AI & Intelligence
- **Primary AI**: Claude 4.5 Sonnet (Anthropic) - Advanced reasoning and analysis
- **Market Research**: Perplexity AI (llama-3.1-sonar-large-128k-online) - Real-time web research
- **Multi-Agent Framework**: Fetch.ai uAgents v0.22.9 - Autonomous agent orchestration
- **Fallback AI**: OpenAI GPT-4o - Additional AI capabilities

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query v5
- **Routing**: Wouter (lightweight React router)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion, GSAP

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript (ES modules)
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with Zod integration
- **Security**: Helmet, express-validator, rate limiting, input sanitization
- **Session Management**: PostgreSQL-backed sessions

---

## 🎨 Key Features

### 🔍 Progressive Multi-Step Validation

**3-Stage Guided Form:**
1. **Foundation** - Idea title + problem statement
2. **Solution** - Solution approach + target market
3. **Strategy** - Competition + business model + unique value prop

**Enhanced UX:**
- Auto-expanding textareas with character count (2000 max)
- Focus glow effects with glass morphism backgrounds
- Smooth Framer Motion animations between steps
- Visual progress stepper (1/3, 2/3, 3/3)
- Summary review screen before validation

**AI Assistance:**
- AI suggestion buttons powered by Claude 4.5
- Context-aware content generation for each field
- Learns from already-filled data for better suggestions

**Auto-Save System:**
- 500ms debounced saving to database
- Visual "Saving.../Saved" indicators
- Never lose your work

### 🌐 Live Market Research (Powered by Perplexity AI)

Real-time web research across 4 dimensions:
1. **Competitive Landscape** - Competitors, funding rounds, market leaders
2. **Market Trends** - Size, growth rate, TAM analysis
3. **Customer Insights** - Pain points, feedback, user behavior
4. **Funding Landscape** - Recent rounds, active investors, valuations

**Live Research Visualization:**
- Animated progress for each dimension
- Status indicators (pending → in-progress → complete)
- Progress bar during 60-90 second research cycle
- Integration with Claude AI for comprehensive analysis

### 📊 10-Dimension Validation Scoring

Claude AI analyzes both structured form data + live market data:

1. Problem clarity and market need
2. Solution viability and innovation  
3. Target market size and accessibility
4. Competitive differentiation
5. Business model feasibility
6. Revenue potential and scalability
7. Team capability assessment
8. Market timing and trends
9. Execution complexity
10. Risk factors and mitigation

**Scoring System:**
- 0-100 score for each dimension
- Overall validation score (average)
- Clear GO (≥75) / REFINE (60-74) / PIVOT (<60) verdicts
- Actionable recommendations for improvement

### 🔄 Iterative Refinement

**Continuous Improvement:**
- "Refine & Re-Validate" button for score improvement
- Form pre-populates with existing data
- Score comparison with improvement tracking
- Toast notifications show "+10 improvement" or "-5 decline"

**Validation History:**
- Complete history stored in database (jsonb array)
- Track score progression across refinement cycles
- See what changed between validations
- Learn from iteration patterns

**Progressive Unlock:**
- "Continue to The Strategist" appears at score ≥ 60
- Prevents progression with unvalidated ideas
- Ensures quality before moving forward

### 🗑️ Data Safety

**Destructive Delete Confirmation:**
- Red "Start Over" button with AlertTriangle icon
- Two-step confirmation dialog
- Strong warning: "This will permanently delete your idea and all validation data"
- Red "Yes, Delete Forever" button prevents accidental deletion

### 💳 Credit System & Subscriptions

**Usage-Based Billing:**
- **Core Plan**: $10/month - 500 credits
- **Pro Plan**: $50/month - 3000 credits
- Pay with SOL or USDC via Solana Pay

**Credit Usage:**
- Idea validation: 50 credits
- AI suggestions: 5 credits each
- Business plan generation: 100 credits
- Pitch deck creation: 75 credits

**Smart Tracking:**
- Real-time credit balance display
- Usage alerts at 80% and 95%
- Overage tracking for monthly billing
- Subscription management (cancel/reactivate)

### 🎨 Design System & Themes

**3 Beautiful Themes:**
1. **Light Mode** - Clean, professional
2. **Dark Mode** - Modern, sleek
3. **Cypherpunk** - Matrix terminal aesthetic with neon green, glow effects

**Comprehensive Design System:**
- Typography scale (H1-H6 responsive)
- Brand gradients (Blue → Purple → Cyan)
- Consistent spacing tokens
- Glass morphism effects
- Accessibility features (prefers-reduced-motion)

---

## 📁 Project Structure

```
mystartupai/
├── client/                          # React frontend
│   └── src/
│       ├── pages/
│       │   ├── co-founder-validator.tsx    # The Validator
│       │   ├── gateway-monitor.tsx         # Sanctum Gateway dashboard
│       │   ├── landing.tsx                 # Landing page
│       │   └── ...
│       ├── components/
│       │   ├── ui/                         # shadcn/ui components
│       │   └── ...
│       └── lib/
├── server/                          # Express backend
│   ├── routes.ts                    # API endpoints
│   ├── gateway-service.ts           # Sanctum Gateway integration
│   ├── anthropic.ts                 # Claude AI integration
│   ├── storage.ts                   # Database layer (Drizzle ORM)
│   ├── auth.ts                      # Solana wallet authentication
│   └── ...
├── shared/                          # Shared TypeScript types
│   └── schema.ts                    # Drizzle ORM schemas + Zod validation
├── agents/                          # ASI multi-agent system
│   ├── market_research_agent.py     # Market analysis agent
│   ├── business_plan_agent.py       # Business plan generator
│   └── README.md                    # Agent documentation
├── GATEWAY_INTEGRATION.md           # Sanctum Gateway documentation
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Solana wallet (Phantom recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/djbigzzz/mystartupai.git
cd mystartupai

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL=postgresql://...

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...

# Solana
SOLANA_NETWORK=devnet
SOLANA_RECIPIENT_WALLET=your_wallet_address
GATEWAY_API_KEY=your_sanctum_gateway_key

# Session
SESSION_SECRET=your_random_secret
```

### Run the Application

```bash
npm run dev
```

Visit `http://localhost:5000`

---

## 🎥 Demo

**Live Platform**: Coming soon  
**Demo Video**: Coming soon  

---

## 🏆 Why This Matters for Solana

### 1. Real-World Problem Solving
MyStartup.ai addresses a $100B+ problem (startup failure) using Solana's speed and low costs to make validation accessible to everyone.

### 2. Native Solana Integration
- Not just "accepts SOL" - deeply integrated with Solana ecosystem
- Phantom wallet as primary authentication
- Solana Pay for seamless payments
- Sanctum Gateway for transaction optimization
- Mobile-optimized for Phantom mobile browser

### 3. Bringing Web2 Users to Solana
- Founders don't need crypto experience
- Phantom wallet onboarding is part of the flow
- Real utility drives adoption, not speculation

### 4. Scalability Showcase
- Credit system requires high-throughput, low-cost transactions
- Solana's speed enables real-time credit allocation
- Gateway optimization reduces costs for programmatic operations

### 5. Consumer dApp Excellence
- Mobile-first PWA design
- Intuitive UX that hides blockchain complexity
- Real value delivered in <5 minutes

---

## 🎖️ Also Qualifying For Side Tracks

### ASI Agents Track ($20,000 USDC)
Multi-agent orchestration with Fetch.ai uAgents framework. See [`agents/README.md`](./agents/README.md)

### Sanctum Gateway Track ($10,000 USDC)  
Complete transaction optimization and delivery integration. See [`GATEWAY_INTEGRATION.md`](./GATEWAY_INTEGRATION.md)

### Superteam Ireland | Dogpatch Labs ($10,000 USDC)
Built and operated in Ireland, empowering Irish founders.

---

## 📝 License

MIT License

---

## 👨‍💻 Developer

**GitHub**: [@djbigzzz](https://github.com/djbigzzz)  
**Location**: Ireland 🇮🇪  
**Hackathon**: Solana Colosseum Cypherpunk  

---

## 🙏 Acknowledgments

- Solana Foundation for the Colosseum hackathon
- Anthropic for Claude 4.5 Sonnet
- Perplexity AI for real-time market research
- Sanctum for Gateway transaction optimization
- Artificial Superintelligence Alliance for the uAgents framework

---

**Built with ❤️ in Ireland for the Solana ecosystem**

*Preventing founders from wasting time and money on unvalidated ideas.* 🚀
