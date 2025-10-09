# MyStartup.ai - AI-Powered Startup Accelerator

## Overview
MyStartup.ai is an AI-powered platform designed to guide startup founders from idea to investor-readiness. It automates the creation of detailed business plans, pitch decks, and financial models, adhering to Y Combinator standards. The platform aims to transform raw ideas into viable businesses through intelligent analysis and content generation, providing a comprehensive toolkit for early-stage entrepreneurs. It offers a 10-step guided workflow, an agentic AI platform for autonomous task execution, and tools for MVP development, investor matching, and grant applications.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Updates (October 2025)

### UI/UX Enhancements
- **3-Theme Mode System**: Light, Dark, and Web3 (futuristic galaxy) themes with cycling toggle and localStorage persistence
  - Web3 theme features animated galaxy background, neon cyan/purple/magenta colors, starfield effects, and glowing UI elements
  - Theme toggle button in header cycles through all three modes
- **Brand Gradient Styling**: Consistent gradient branding across platform using `from-blue-600 via-purple-600 to-blue-700`
  - Marketing home page: 6 major section headings use gradient text (bg-clip-text text-transparent)
  - Dashboard welcome header: Full gradient background with theme compatibility
  - Dashboard CardTitle: Gradient text for "Your Next Step" section
  - Logo sizing: Increased dashboard sidebar logo by 1.4x (sm→md, 40px→56px) for enhanced visibility
  - All gradients tested and verified across Light, Dark, and Web3 themes
- **Credits Display Fix**: Corrected API field accessor from `balance` to `credits` to properly display user credit balance
- **Profile Page Navigation**: Added consistent sidebar navigation matching dashboard layout with responsive mobile/desktop support
- **Logo Branding**: MyStartup.ai logo added to all pages for consistent branding
- **Purchase Credits Page Redesign**: 
  - Enhanced multi-layer gradient backgrounds for all themes
  - Improved header with gradient text and better typography
  - Upgraded pricing cards with hover scale effects, enhanced shadows/borders
  - Special styling for PRO plan with primary borders and glows
  - Current plan ring indicator for active subscriptions

### Subscription Management
- **Cancellation Flow**: Comprehensive cancellation experience with retention strategy
  - Confirmation dialog with emotional messaging and benefits reminder before cancellation
  - Shows scheduled cancellation date with heart icon for emotional connection
  - "Keep My Subscription" as primary action to reduce churn
  - Rate-limited cancellation endpoint with proper authorization
- **Reactivation Feature**: One-click subscription reactivation for cancelled plans
  - Green "Reactivate Subscription" button appears in both profile and purchase-credits pages
  - Instant UI updates with toast notifications
  - Reverses cancel_at_period_end status back to active
  - Dual integration ensures users can reactivate from multiple touchpoints

### AI-Powered Form Assistance
- **AI Suggestion Buttons**: Intelligent form field assistance in startup idea submission
  - Four AI-powered suggestion buttons for Problem Statement, Solution Approach, Competitive Advantage, and Revenue Model fields
  - Context-aware GPT-4 integration generates relevant suggestions based on idea title, description, and industry
  - Field-level loading states with spinner animations during generation
  - Real-time form validation and dirty-state tracking using React Hook Form
  - Toast notifications for success/error feedback
  - Rate-limited endpoint (20 requests per 5 minutes) with proper authentication
  - Tested and verified with all fields generating contextually relevant content

### Development Infrastructure
- **Test User Seeding**: Automatic seeding of test users in development environment
  - Test account: web3user@test.com / password123 (CORE plan, 6,200 credits)
  - Seeds on server startup for consistent testing environment

## System Architecture

### General Architecture
MyStartup.ai utilizes a modern web application architecture with a React frontend, a Node.js/Express backend, and a PostgreSQL database. The application is built with TypeScript for enhanced type safety and maintainability.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite.
- **UI/UX**: `shadcn/ui` components based on Radix UI primitives, styled with Tailwind CSS, emphasizing a clean, professional dark theme with balanced visuals and clear content hierarchy.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query manages server-side data.
- **Form Handling**: React Hook Form with Zod for schema validation.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database ORM**: Drizzle ORM.
- **API Design**: RESTful API.
- **AI Integration**: Core functionality leverages OpenAI's GPT-4 for advanced AI analysis, content generation, and autonomous agent capabilities, including multi-agent coordination (e.g., Business Plan Agent communicating with Market Research Agent).

### Database
- **Database System**: PostgreSQL, configured for serverless deployment with Neon.
- **Schema**: Includes `users` for authentication and `startup_ideas` to store core startup data and AI-generated content.
- **Migrations**: Managed using Drizzle Kit.

### Key Features & Design Patterns
- **AI-Powered Modules**: Y Combinator-inspired AI modules for workflow steps like company setup, business strategy, product development, financial planning, marketing, and legal.
- **Agentic AI Platform**: Autonomous AI agents for natural language interactions, real-time task execution, and intelligent investor/grant matching.
- **MVP Development Tools**: AI-powered code generation for various MVP templates (SaaS, marketplace, mobile apps).
- **Comprehensive Workflow Dashboard**: A guided 10-step workflow with progress tracking.
- **Security**: Enterprise-grade security measures against OWASP Top 10 vulnerabilities, including input validation, rate limiting, secure session management, and privacy protection. IDOR vulnerabilities have been fixed.
- **User Authentication**: Solana wallet authentication (Phantom, Solflare, etc.) as primary, with email/password as a fallback option. OAuth integration is also supported.
- **Subscription System**: Usage-based billing with monthly subscriptions, credit allocation, overage tracking, and usage alerts.
- **Email Service**: Integrated with Resend for transactional emails (password resets, welcome emails).
- **Payment Processing**: Exclusive focus on Solana Pay for cryptocurrency payments.
- **Sanctum Gateway Integration**: For optimized Solana transaction management, including monitoring and cost optimization.

## External Dependencies

### Core Technologies
- `@neondatabase/serverless`: Serverless PostgreSQL connections.
- `openai`: OpenAI API integration.
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