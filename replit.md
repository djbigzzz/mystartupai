# MyStartup.ai - AI-Powered Startup Accelerator

## Overview
MyStartup.ai is an AI-powered platform designed to guide startup founders from idea to investor-readiness. It automates the creation of detailed business plans, pitch decks, and financial models, adhering to Y Combinator standards. The platform aims to transform raw ideas into viable businesses through intelligent analysis and content generation, providing a comprehensive toolkit for early-stage entrepreneurs. It offers a 10-step guided workflow, an agentic AI platform for autonomous task execution, and tools for MVP development, investor matching, and grant applications.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Updates (October 2025)

### UI/UX Enhancements
- **Landing Page Polish (October 2025)**: Targeted improvements for better conversion and readability
  - Navigation links: Increased contrast (gray-600→gray-800) and weight (medium→semibold) for better readability
  - Hero headline: Removed outline text effect on "Your AI Co-Founder" - now clean solid white with drop-shadow for modern look
  - Trust signals: Repositioned above CTA button in highlighted glass-effect box with green checkmarks and updated "48-hour delivery" messaging
  - CTA button: Enlarged from px-10 py-4 to px-12 py-6 for greater prominence
  - Demo preview: Reduced size from 50% to ~30% width (lg:grid-cols-5 with 3:2 split) giving more breathing room to hero content
- **3-Theme Mode System**: Light, Dark, and Web3 (futuristic galaxy) themes with cycling toggle and localStorage persistence
  - Web3 theme features animated galaxy background, neon cyan/purple/magenta colors, starfield effects, and glowing UI elements
  - Theme toggle button in header cycles through all three modes
- **Web3 Visual Effects System**: Canvas-based animation system for Web3 theme
  - Particle system with 50 cyan/purple glowing particles with mouse attraction physics
  - Mouse trail effect with purple/magenta glow following cursor
  - Click ripple effects with dual expanding rings (cyan + magenta) and particle bursts
  - Performance-optimized using refs and requestAnimationFrame (60fps target)
  - Proper cleanup on theme change, no React re-renders during animation
  - Full-screen canvas with pointer-events: none for click-through, mix-blend-mode: screen for glow effect
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
- **3D Luxury Button Styling**: Platform-wide button enhancements with depth and polish
  - Primary buttons: Gradient backgrounds (blue-600→purple-600) with layered shadows and transforms
  - Outline buttons: Subtle depth with inset highlights and hover elevation
  - Destructive buttons: Red gradient with enhanced warning shadows
  - Ghost buttons: Minimal hover effects with subtle shadows
  - All effects properly scoped to specific button variants using CVA-generated classes
- **Theme-Aware Background Effects**: Dynamic floating orbs and gradients for light/dark themes
  - Light theme: Radial gradient overlay with 3 floating blue/purple orbs (400px, blur 80px)
  - Dark theme: Enhanced gradient with 3 floating cyan/purple/magenta orbs (500-600px, blur 100px)
  - Web3 theme: Isolated from background effects, relies solely on Web3Effects component
  - All effects use `pointer-events: none` with z-index layering for proper interactivity
- **Accessibility Support**: prefers-reduced-motion implementation across all animations
  - Disables orb animations for motion-sensitive users
  - Reduces blur intensity (80px→40px light, 100px→50px dark) for better performance
  - Prevents background gradient animations when reduced motion is preferred
  - Ensures inclusive experience without sacrificing visual appeal for standard users

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

### Mobile Responsiveness
- **Comprehensive Mobile Navigation**: Full mobile support across all dashboard and marketing pages
  - Dashboard pages (business-plan, pitch-deck, submit-idea): Sidebar hidden on mobile (`hidden lg:block`), MobileNavigation component with Sheet drawer provides access to all navigation links
  - Marketing home page: Hamburger menu (Sheet component) with full navigation and CTA buttons accessible on mobile devices
  - All navigation states covered: loading, empty/no-data, and main content states
- **Tier-Based Module Locking**: Subscription-based access control in mobile navigation
  - Three-tier hierarchy: FREEMIUM (1), CORE (2), PRO (3)
  - Locked modules display lock icon and reduced opacity (60%)
  - Current plan badge with Crown icon shows user's active tier
  - Access rules: FREEMIUM gets basic features; CORE adds Financial Model, Market Research, Analytics, Funding Tools; PRO adds MVP Builder and Investor Matching (coming soon)
  - Clicking locked modules redirects to /purchase-credits page for upgrade
  - Uses AuthContext for reliable tier detection, preventing race conditions where PRO users temporarily appear as FREEMIUM during load
  - Loading spinner displays while auth resolves, blocking premature interactions
  - "Soon" badges mark upcoming features (MVP Builder, Find Investors)
- **Form Validation Enhancement**: Fixed AI suggestion form validation issue
  - Validation functions now properly check trimmed string values to handle AI-populated fields
  - Submit button correctly enables when all required fields contain non-empty content
  - Fixed LSP type error with email field null handling
  - Tested and verified with Playwright end-to-end tests
- **Responsive Grid Layouts**: All card grids use mobile-first breakpoints
  - Pattern: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4` ensures single column on mobile, proper stacking
  - Overflow handling with `overflow-auto` on scrollable content areas
  - Touch-friendly button sizing with `flex-1 sm:flex-none` for full-width buttons on mobile

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