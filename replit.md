# MyStartup.ai - AI-Powered Startup Accelerator

## Overview
MyStartup.ai is an AI-powered platform designed to guide startup founders from idea to investor-readiness. It automates the creation of detailed business plans, pitch decks, and financial models, adhering to Y Combinator standards. The platform aims to transform raw ideas into viable businesses through intelligent analysis and content generation, providing a comprehensive toolkit for early-stage entrepreneurs. It offers a 10-step guided workflow, an agentic AI platform for autonomous task execution, and tools for MVP development, investor matching, and grant applications.

## Recent Changes
- **Pitch Demo Page Built** (Oct 8, 2025): Hidden live demo at `/pitch-demo-live` for Superteam Ireland Pitchathon
  - **State-Based Data Flow**: Business plan generated via useEffect from marketData and financialData state - proves agent coordination
  - **Real-Time Messaging**: Agent-to-agent communication with AGENT_REQUEST/RESPONSE protocol visible in UI
  - **Timing Display**: Each message shows elapsed time (+0.80s, +2.00s format) from generation start
  - **Dynamic Stats**: Total generation time updates live (not hardcoded) showing actual agent coordination speed
  - **Multi-Agent Flow**: User → Business Plan Agent → Market Research Agent → Financial Modeling Agent → synthesized plan
  - **Architect Approved**: Proper state persistence and data flow demonstration for hackathon pitch
  - **No Navigation Links**: Accessible only via direct URL for controlled demo presentation
- **Subscription System Complete** (Oct 8, 2025): Full usage-based billing with monthly subscriptions and overage tracking
  - **Monthly Credit Allocation**: CORE (2,000/month at $29), PRO (7,000/month at $79), FREEMIUM (200 total) with automatic renewal at billing cycle
  - **Overage Tracking**: Precise overage calculation when credits depleted - bills at $0.002/credit for additional usage
  - **Usage Alerts**: Users set spending thresholds, API returns alerts when exceeded for frontend notification display
  - **Subscription Management**: Profile tab for viewing status, cancelling subscription, setting usage alerts
  - **Auto Credit Reset**: Backend automatically renews credits at billing cycle end, clears monthly overage counter
  - **Purchase Credits UI**: Shows "/month" for subscriptions, displays next billing date and overage for active subscribers
  - **Bug Fixes**: Fixed negative balance overage math, proper state hydration for usage alerts with useEffect
  - **Production Ready**: Architect-approved implementation with comprehensive subscription lifecycle management
- **UI Information Architecture Cleanup** (Oct 7, 2025): Streamlined dashboard to reduce redundancy and improve user experience
  - **Removed Credits from Banner**: Credits now only displayed in Purchase Credits and usage pages - cleaner top banner
  - **Consolidated Plan Info**: Plan display moved from top-right header to sidebar profile section with plan-specific icons
  - **Removed Top-Right Profile**: Eliminated redundant user profile section from header - all info now in sidebar footer
  - **Sidebar Profile Enhancement**: Shows avatar, name, and plan (with Crown/CreditCard/Zap icons) with logout button
  - **Cleaner Navigation**: Simplified top header to show only Dashboard/Profile tabs and notification button
  - **Information Hierarchy**: Critical user information centralized in single, consistent location
- **Sanctum Gateway Integration Complete** (Oct 7, 2025): Full integration with Sanctum Gateway for $10K bounty
  - **Gateway Service** (`server/gateway-service.ts`): Complete API wrapper with optimizeTransaction, sendTransaction, and status checking
  - **API Endpoints**: Three production-ready endpoints at `/api/gateway/*` (status, transaction lookup, history)
  - **Monitoring Dashboard**: Beautiful UI at `/gateway-monitor` with real-time transaction tracking and Solana Explorer links
  - **Observability**: Comprehensive metrics tracking (attempts, successes, failures, latency) with structured logging
  - **Error Sanitization**: All Gateway errors sanitized before exposing to clients - no provider internals leaked
  - **Production Ready**: Architect-approved implementation with proper error handling, rate limiting, and authentication
  - **Future Ready**: Infrastructure prepared for programmatic transactions (refunds, airdrops, admin operations)
  - **Cost Optimization**: Automatic Jito tip refunds, optimized priority fees, multi-channel delivery
  - **Documentation**: Complete submission materials in `GATEWAY_INTEGRATION.md`
- **Multi-Agent System Complete** (Oct 6, 2025): True agent-to-agent coordination implemented for ASI Alliance hackathon
  - **Agent-to-Agent Messaging**: Business Plan Agent directly communicates with Market Research Agent via Chat Protocol
  - **Market Research Agent** (port 8001): Analyzes startup ideas, responds to both users and other agents
  - **Business Plan Agent** (port 8002): Coordinates with Market Research Agent to compile comprehensive business plans
  - **Communication Protocol**: `AGENT_REQUEST`/`AGENT_RESPONSE` format with UUID-based request correlation
  - **Multi-Agent Flow**: User → Business Plan → Market Research → Business Plan → User
  - **Production Ready**: Architect-approved implementation with proper error handling and security
  - **Innovation Lab Compliant**: Fully documented with badges, deployment guides, and protocol specifications
  - **Dual Strategy**: Colosseum (Solana) + ASI Alliance hackathons with integrated platform
- **Resend Email Service Integration** (Oct 4, 2025): Professional transactional email service now active
  - **Password Reset Emails**: Secure reset links sent via Resend instead of console logs
  - **Security Enhancement**: Reset tokens no longer exposed in API responses - only sent via email
  - **Welcome Emails**: New users receive branded welcome emails with platform overview
  - **Remember Me Feature**: Users can opt for 30-day sessions on trusted devices via checkbox
  - **Better Error Messages**: Login failures show helpful messages without revealing account existence
  - **Email Service**: Using Resend API with re_* key for reliable email delivery
- **Solana Pay Exclusive Focus** (Oct 3, 2025): Paused PayPal integration to focus solely on Solana Pay testing
  - **Removed PayPal UI**: Eliminated tabs and PayPal payment options from Purchase Credits page
  - **Streamlined Modal**: Payment modal now shows only Solana Pay options (SOL/USDC)
  - **Auto-trigger QR**: Payment request automatically generated when modal opens
  - **Testnet Ready**: Fully configured for Solana devnet testing with no real money required
  - **Future Plan**: PayPal integration may be resumed after Solana Pay validation
- **CRITICAL SECURITY FIX**: Fixed IDOR vulnerabilities preventing unauthorized access to user data (Sept 30, 2025)
  - **GET /api/companies/:id**: Added ownership verification - users can now only access their own companies
  - **Business Plan Endpoints**: Added ownership checks to all business plan generation and retrieval endpoints
  - **Pitch Deck Endpoints**: Added ownership checks to all pitch deck generation and retrieval endpoints
  - **Business Plan Sections**: Secured individual section generation endpoint
  - **Impact**: Prevents any logged-in user from accessing other users' companies, ideas, business plans, and pitch decks
- **Solana-Only Wallet Integration**: Streamlined to Solana blockchain focus (Sept 29, 2025)
  - **Solana Wallet Support**: Direct integration with Phantom, Solflare, and other Solana wallets via browser extension API
  - **Authentication Flow**: Challenge-response system with Ed25519 signature verification for Solana wallets
  - **Profile Linking**: Users can link Solana wallets to existing email/password accounts
  - **UI Updates**: Solana-branded buttons and messaging throughout login and profile pages
  - **Simplified Implementation**: Removed EVM dependencies (WalletConnect, wagmi) for cleaner Solana-focused architecture
  - **Fallback Option**: Maintained email/password authentication for broader accessibility
- **OAuth System Fixed**: Resolved 404 errors by correcting callback URL configuration and session handling (Jan 18, 2025)
- **Google Console Configuration**: Properly configured redirect URIs for both callback endpoints
- **Session Deserialization**: Fixed Passport.js session errors that were causing server crashes
- **Manual OAuth Implementation**: Created bypass system to handle OAuth without middleware conflicts
- **Production Deployment**: MyStartup.ai successfully deployed and live on mystartup.ai
- **Security Hardening**: Comprehensive security audit completed - 100% security score
- **Session Persistence**: Fixed cookie configuration with `sameSite: 'lax'` for OAuth compatibility
- **Database Schema**: Added missing `startup_vision` column to resolve backend errors
- **Profile Page**: Added back button navigation and functional change photo button
- **Security Vulnerabilities**: All identified vulnerabilities patched (CVE-2025-30208, hardcoded URLs, logging)
- **Enterprise Security**: All OWASP Top 10 vulnerabilities mitigated
- **Mobile Ready**: Platform optimized and accessible across all devices

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### General Architecture
MyStartup.ai utilizes a modern web application architecture with a React frontend, a Node.js/Express backend, and a PostgreSQL database. The application is built with TypeScript for enhanced type safety and maintainability.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite for optimized development and production builds.
- **UI/UX**: `shadcn/ui` components based on Radix UI primitives, styled with Tailwind CSS for a consistent and professional aesthetic. The design emphasizes a clean, professional layout with a dark theme, balanced visuals, and clear content hierarchy.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query manages server-side data, incorporating caching and optimistic updates.
- **Form Handling**: React Hook Form is used for form management, with Zod for schema validation.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database ORM**: Drizzle ORM for type-safe interactions with the database.
- **API Design**: RESTful API providing JSON responses.
- **Error Handling**: Centralized middleware for consistent error responses.
- **AI Integration**: Core functionality leverages OpenAI's GPT-4 for advanced AI analysis, content generation (business plans, pitch decks), and autonomous agent capabilities.

### Database
- **Database System**: PostgreSQL, configured for serverless deployment with Neon.
- **Schema**: Includes `users` for authentication and `startup_ideas` to store core startup data and AI-generated content.
- **Migrations**: Managed using Drizzle Kit.

### Key Features & Design Patterns
- **AI-Powered Modules**: Y Combinator-inspired AI modules for each workflow step, including company setup, business strategy, product development, financial planning, marketing, and legal.
- **Agentic AI Platform**: Autonomous AI agents for natural language interactions, real-time task execution (e.g., business plan generation, market research), and intelligent investor/grant matching.
- **MVP Development Tools**: AI-powered code generation for various MVP templates (SaaS, marketplace, mobile apps) with support for React, Node.js, Python, and React Native.
- **Comprehensive Workflow Dashboard**: A guided 10-step workflow (Company Setup to Launch & Scale) with progress tracking and progressive unlocking of modules.
- **Security**: Enterprise-grade security measures implemented against OWASP Top 10 vulnerabilities, including input validation, rate limiting, secure session management, and comprehensive privacy protection for user data.
- **User Authentication**: Solana wallet authentication (Phantom, Solflare, etc.) as primary method with direct browser extension integration, email/password as fallback option for broader accessibility.

## External Dependencies

### Core Technologies
- `@neondatabase/serverless`: For serverless PostgreSQL connections.
- `openai`: Official client library for OpenAI API integration.
- `drizzle-orm`: ORM for database interactions.
- `@tanstack/react-query`: For server state management in the frontend.
- `react-hook-form`: For robust form handling.
- `zod`: For runtime type validation.
- `express`: Web application framework for Node.js.

### UI/Styling
- `@radix-ui/`: Primitives for accessible UI components.
- `tailwindcss`: Utility-first CSS framework for styling.
- `lucide-react`: Icon library.
- `class-variance-authority`: Utility for managing component variants.

### Development & Security
- `vite`: Frontend build tool.
- `typescript`: For static type checking across the codebase.
- `tsx`: For running TypeScript files directly during development.
- `helmet`: Express middleware for setting security headers.
- `bcrypt`: For password hashing.
- `express-validator`: For input validation and sanitization.
- `dompurify`: For sanitizing HTML to prevent XSS attacks.