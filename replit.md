# Overview

MyStartupAI is an agentic AI co-founder application designed to validate startup ideas before founders invest significant time and money. The system acts as an intelligent advisor that helps entrepreneurs assess the viability of their business concepts through AI-powered analysis and feedback.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Application Type
This appears to be an early-stage project with minimal code scaffolding in place. The primary architecture decisions have not yet been implemented, with only security scanning configuration present.

## Security Infrastructure
- **Security Scanning**: Semgrep rules configured for static code analysis
- **Secret Management**: Rules enforce the use of `@secure()` decorator for sensitive parameters in Bicep templates (Azure infrastructure-as-code)
- **Vulnerability Detection**: Configured to detect CWE-532 violations (insertion of sensitive information into log files)

## Expected Architecture Patterns
Based on the project's purpose as an AI co-founder validation tool, the system will likely implement:

1. **AI/ML Integration**: Core functionality will rely on AI models for analyzing and validating startup ideas
2. **User Interaction Layer**: Interface for founders to submit and receive feedback on their startup concepts
3. **Analysis Engine**: Logic to process startup ideas and generate validation reports
4. **Data Persistence**: Storage for user submissions, analysis results, and historical data

## Infrastructure Approach
- **Cloud Platform**: Azure (indicated by Bicep configuration files)
- **Infrastructure as Code**: Uses Bicep templates for Azure resource provisioning
- **Security-First Design**: Emphasis on secure parameter handling and secret management from the outset

# External Dependencies

## Cloud Services
- **Azure**: Primary cloud platform for hosting and infrastructure
- **Bicep**: Azure's domain-specific language for declarative infrastructure deployment

## Security Tools
- **Semgrep**: Static analysis security scanner with custom rules for detecting security vulnerabilities, particularly around sensitive data exposure in logs and Azure portal displays

## Anticipated Integrations
Given the AI-focused nature of the application, future dependencies may include:
- AI/ML APIs or services (e.g., OpenAI, Azure OpenAI, Anthropic)
- Database solutions for storing startup idea submissions and analysis results
- Authentication providers for user management