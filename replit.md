# MyStartup.ai - AI-Powered Startup Accelerator

## Overview
MyStartup.ai is an AI-powered platform designed to guide startup founders from idea to investor-readiness. It automates the creation of detailed business plans, pitch decks, and financial models, adhering to Y Combinator standards. The platform aims to transform raw ideas into viable businesses through intelligent analysis and content generation, providing a comprehensive toolkit for early-stage entrepreneurs. It offers a 10-step guided workflow, an agentic AI platform for autonomous task execution, and tools for MVP development, investor matching, and grant applications.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### General Architecture
MyStartup.ai utilizes a modern web application architecture with a React frontend, a Node.js/Express backend, and a PostgreSQL database. The application is built with TypeScript for enhanced type safety and maintainability.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite.
- **UI/UX**: `shadcn/ui` components based on Radix UI primitives, styled with Tailwind CSS, emphasizing a clean, professional dark theme with balanced visuals and clear content hierarchy. Includes Light, Dark, and Cypherpunk themes with persistence and visual effects (e.g., Matrix rain).
  - **Cypherpunk Theme**: Optimized Matrix terminal aesthetic with bright neon green text (80-92% lightness), green-tinted card backgrounds (22% lightness, 25% saturation), enhanced glow effects on all UI elements, 2px green borders on cards, and 60% opacity background Matrix rain effect at z-0. All text forced to bright green for maximum visibility and authentic terminal feel.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query manages server-side data.
- **Form Handling**: React Hook Form with Zod for schema validation.
- **Branding**: Consistent use of brand gradients across the platform.
- **Accessibility**: Implemented `prefers-reduced-motion` for animations.

### Design System
A comprehensive design system ensuring visual consistency across the application:

#### Typography Scale
- **Headings**: `.heading-1` through `.heading-6` with responsive sizing
  - H1: 4xl → 5xl (mobile → desktop)
  - H2: 3xl → 4xl
  - H3: 2xl → 3xl
  - H4: xl → 2xl
  - H5: lg → xl
  - H6: base → lg
- **Body Text**: `.text-body-lg`, `.text-body`, `.text-body-sm`
- **Utility Text**: `.text-caption`, `.text-label`, `.text-tiny`

#### Spacing Tokens
- **Section Spacing**: `.section-spacing`, `.section-spacing-sm`, `.section-spacing-lg`
- **Container Widths**: `.container-narrow`, `.container-default`, `.container-wide`
- **Card Padding**: `.card-padding`, `.card-padding-sm`, `.card-padding-lg`
- **Stack (Vertical)**: `.stack-xs` through `.stack-xl` (2px → 48px)
- **Inline (Horizontal)**: `.inline-xs` through `.inline-lg` (8px → 32px)
- **Grid Gaps**: `.grid-gap-sm`, `.grid-gap-md`, `.grid-gap-lg`

#### Brand Gradients
- **Primary**: `.gradient-text-primary` (Blue → Purple → Blue)
- **Secondary**: `.gradient-text-secondary` (Blue → Purple)
- **Accent**: `.gradient-text-accent` (Purple → Cyan)

#### Font Family
- **Primary**: Inter (with system font fallback)
- **Monospace**: Courier New (Cypherpunk theme only)

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database ORM**: Drizzle ORM.
- **API Design**: RESTful API.
- **AI Integration**: 
  - **Claude 4.5 Sonnet** (claude-sonnet-4-20250514): Advanced AI analysis, content generation, and autonomous agent capabilities including multi-agent coordination
  - **Perplexity AI** (llama-3.1-sonar-large-128k-online): Real-time market research integration for The Validator, conducts live web research on competitors, market trends, customer insights, and funding landscape

### Database
- **Database System**: PostgreSQL, configured for serverless deployment with Neon.
- **Schema**: Includes `users` for authentication and `startup_ideas` to store core startup data and AI-generated content.
- **Migrations**: Managed using Drizzle Kit.

### Key Features & Design Patterns
- **AI-Powered Modules**: Y Combinator-inspired AI modules for workflow steps, including AI suggestion buttons for form assistance.
- **Co-Founder Journey System**: A validation-first approach positioned as "Your AI Co-Founder Who Won't Let You Build the Wrong Thing." Features a 4-stage sequential journey:
  - **The Validator** (Stage 1): Enhanced idea validation with 0-100 scoring system and clear GO/REFINE/PIVOT verdicts. **Single-idea-per-user model** - users can only have ONE active validated idea at a time for focused validation experience. **Real-time market research powered by Perplexity AI** conducts live web research across 4 dimensions: competitive landscape (competitors, funding), market trends (size, growth), customer insights (pain points, feedback), and funding landscape (recent rounds, investors). Claude AI then analyzes both user input and live market data for comprehensive 8-dimension validation including market size analysis, competition assessment, and feasibility scoring. Results display market research badge with source count and timestamp. **Two-pane layout**: validation workspace (left) shows validated idea or blank form, results panel (right) displays insights. "Start Over" button archives current idea and returns to blank workspace.
  - **The Strategist** (Stage 2): Customer discovery, interview scripts, and feature prioritization (unlocks when validation score > 60).
  - **The Builder** (Stage 3): Consolidated business plan, pitch deck, and financial model generation.
  - **The Growth Hacker** (Stage 4): Investor matching, customer acquisition strategies, and MVP iteration guidance.
  - Progressive unlock system with glass morphism UI, human avatars, and GSAP-powered animations using ReactBits components (AuroraBackground, SplitText, AnimatedGradient, WaveBackground).
- **Agentic AI Platform**: Autonomous AI agents for natural language interactions and real-time task execution.
- **MVP Development Tools**: AI-powered code generation for various MVP templates.
- **Comprehensive Workflow Dashboard**: A guided 10-step workflow with progress tracking and mobile responsiveness.
- **Security**: Enterprise-grade security measures against OWASP Top 10 vulnerabilities, including input validation, rate limiting, secure session management, and privacy protection.
- **User Authentication**: Solana wallet authentication (Phantom, Solflare, etc.) as primary, with email/password as a fallback option. OAuth integration supported.
- **Subscription System**: Usage-based billing with monthly subscriptions, credit allocation, overage tracking, usage alerts, and tier-based module locking. Includes cancellation and reactivation features.
- **Payment Processing**: Exclusive focus on Solana Pay for cryptocurrency payments.
- **Solana Integration**: Sanctum Gateway for optimized Solana transaction management.
- **Landing Page**: Premium Emergent.sh-inspired design with "Your AI Co-Founder" positioning, interactive demo visualization, comprehensive FAQ section, stats/metrics showcase, trust indicators, and mobile-optimized experience. Prominent "Start Now - It's Free" CTA with no misleading claims.

## External Dependencies

### Core Technologies
- `@neondatabase/serverless`: Serverless PostgreSQL connections.
- `@anthropic-ai/sdk`: Anthropic Claude AI integration.
- `drizzle-orm`: Database ORM.
- `@tanstack/react-query`: Frontend server state management.
- `react-hook-form`: Form handling.
- `zod`: Runtime type validation.
- `express`: Node.js web framework.
- `resend`: Transactional email service.

### UI/Styling
- `@radix-ui/`: Accessible UI component primitives.
- `tailwindcss`: Utility-first CSS framework.
- `lucide-react`: Icon library.
- `class-variance-authority`: Component variant management.

### Development & Security
- `vite`: Frontend build tool.
- `typescript`: Static type checking.
- `tsx`: Running TypeScript files directly.
- `helmet`: Security headers for Express.
- `bcrypt`: Password hashing.
- `express-validator`: Input validation.
- `dompurify`: HTML sanitization.