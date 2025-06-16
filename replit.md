# MyStartup.ai - AI-Powered Startup Accelerator

## Overview

MyStartup.ai is a comprehensive AI-powered platform that transforms startup ideas into investor-ready businesses. The application generates detailed business plans, pitch decks, and financial models using advanced AI analysis, following Y Combinator standards. It features a modern React frontend with a Node.js/Express backend, PostgreSQL database, and integrates with OpenAI's GPT-4 for intelligent content generation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware
- **Development**: Hot reload with tsx for TypeScript execution

### Database Design
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Two main tables:
  - `users`: User authentication and management
  - `startup_ideas`: Core startup data with JSON fields for AI-generated content
- **Migrations**: Managed through Drizzle Kit

## Key Components

### AI Integration
- **OpenAI Integration**: GPT-4 for startup analysis, business plan generation, and pitch deck creation
- **Analysis Engine**: Evaluates ideas across multiple dimensions (market size, competition, feasibility)
- **Content Generation**: Creates structured business plans with 12 sections and professional pitch decks
- **MVP Builder**: AI-powered code generation with templates for SaaS, marketplace, mobile apps, and more

### MVP Development Tools
- **Template System**: 6 proven MVP templates (SaaS Dashboard, Marketplace, Mobile App, AI Chatbot, FinTech, Landing Page)
- **Code Generators**: React components, REST APIs, AI integrations, and mobile screens with full TypeScript support
- **Deployment Pipeline**: Cloud hosting setup, domain configuration, and security monitoring
- **Tech Stack Integration**: Support for React, Node.js, Python, React Native with modern frameworks

### User Experience Flow
1. **Idea Submission**: Users input startup details through a comprehensive form
2. **AI Analysis**: Real-time processing with progress indicators
3. **Dashboard**: Multi-tab interface showing analysis results, business plans, and pitch decks
4. **Demo Mode**: Interactive tour showcasing platform capabilities
5. **Complete Platform**: Advanced features including website builder, investor matching, and MVP development tools

### Data Models
- **Startup Ideas**: Core entity with user info, idea details, and AI-generated content
- **Analysis Results**: Structured scoring system with strengths, weaknesses, and recommendations
- **Business Plans**: 12-section comprehensive plans with executive summary, market analysis, and financial projections
- **Pitch Decks**: Slide-based presentations with speaker notes

## Data Flow

1. **Idea Submission**: Form data validated with Zod schemas before database storage
2. **AI Processing**: Asynchronous AI analysis triggered immediately after idea creation
3. **Content Generation**: Business plans and pitch decks generated on-demand via API endpoints
4. **Real-time Updates**: Frontend polls for completion status and updates UI dynamically
5. **Caching**: Query client manages server state with optimistic updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **openai**: Official OpenAI API client
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Replit Integration**: Configured for Replit hosting with automatic builds
- **Hot Reload**: Vite dev server with HMR for rapid development
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required
- **Port Configuration**: Frontend on port 5000, backend integrated

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Migrations managed through `drizzle-kit push`
- **Deployment**: Autoscale deployment target with health checks

### Configuration
- **Database**: PostgreSQL 16 module enabled
- **Node.js**: Version 20 runtime
- **Build Commands**: `npm run build` for production builds
- **Start Command**: `npm run start` for production server

## Changelog

- June 16, 2025: Initial setup with comprehensive AI-powered startup platform
- June 16, 2025: Implemented MVP Builder with 6 proven templates, code generators, and deployment pipeline
  - Added SaaS Dashboard, Marketplace, Mobile App, AI Chatbot, FinTech, and Landing Page templates
  - Integrated React, REST API, AI integration, and mobile screen code generators
  - Built comprehensive deployment system with cloud hosting, domain setup, and security monitoring
  - Added module to 12-module business development system with seamless navigation

## User Preferences

Preferred communication style: Simple, everyday language.