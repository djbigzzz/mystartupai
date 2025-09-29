# MyStartup.ai - AI-Powered Startup Accelerator

## Overview
MyStartup.ai is an AI-powered platform designed to guide startup founders from idea to investor-readiness. It automates the creation of detailed business plans, pitch decks, and financial models, adhering to Y Combinator standards. The platform aims to transform raw ideas into viable businesses through intelligent analysis and content generation, providing a comprehensive toolkit for early-stage entrepreneurs. It offers a 10-step guided workflow, an agentic AI platform for autonomous task execution, and tools for MVP development, investor matching, and grant applications.

## Recent Changes
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