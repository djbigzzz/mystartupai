// Credit and Pricing Configuration
export const CREDIT_PACKAGES = {
  FREEMIUM: {
    name: "Freemium",
    credits: 200,
    price: 0,
    priceUSD: 0,
    priceSol: 0,
    features: [
      "200 credits/month",
      "1 Business Plan OR 1 Pitch Deck",
      "Basic AI analysis",
      "Community access (view-only)",
      "Standard export (PDF)"
    ]
  },
  QUICK_500: {
    name: "Quick 500",
    credits: 500,
    price: 5,
    priceUSD: 5,
    priceSol: 0.025,
    features: [
      "500 credits instantly",
      "~2-3 Business Plans",
      "~3 Pitch Decks",
      "Perfect for quick top-ups"
    ]
  },
  QUICK_1000: {
    name: "Quick 1,000",
    credits: 1000,
    price: 10,
    priceUSD: 10,
    priceSol: 0.05,
    features: [
      "1,000 credits instantly",
      "~5 Business Plans",
      "~6 Pitch Decks",
      "Great for regular users"
    ]
  },
  BASIC: {
    name: "Basic",
    credits: 2000,
    price: 29,
    priceUSD: 29,
    priceSol: 0.15,
    features: [
      "2,000 credits/month",
      "~10 Business Plans",
      "~12 Pitch Decks",
      "Full AI analysis",
      "Advanced market research",
      "Community forums access",
      "Export formats (PDF, DOCX)",
      "Email support"
    ]
  },
  PRO: {
    name: "Pro",
    credits: 7000,
    price: 79,
    priceUSD: 79,
    priceSol: 0.40,
    features: [
      "7,000 credits/month",
      "~35 Business Plans",
      "~43 Pitch Decks",
      "Full AI analysis",
      "Premium market research",
      "Priority email support",
      "Early access to new features",
      "All export formats",
      "Coming soon: MVP builder",
      "Coming soon: Investor matching"
    ]
  },
  ENTERPRISE_10K: {
    name: "Enterprise 10K",
    credits: 10000,
    price: 99,
    priceUSD: 99,
    priceSol: 0.50,
    features: [
      "10,000 credits",
      "~50 Business Plans",
      "~62 Pitch Decks",
      "Everything in Pro",
      "Best value per credit",
      "Ideal for agencies & teams"
    ]
  },
  ENTERPRISE_25K: {
    name: "Enterprise 25K",
    credits: 25000,
    price: 199,
    priceUSD: 199,
    priceSol: 1.00,
    features: [
      "25,000 credits",
      "~125 Business Plans",
      "~156 Pitch Decks",
      "Everything in Pro",
      "Maximum value",
      "Perfect for power users"
    ]
  }
} as const;

// Credit costs for AI features
export const CREDIT_COSTS = {
  BUSINESS_PLAN: 200,
  PITCH_DECK: 160,
  MARKET_RESEARCH: 60,
  FINANCIAL_MODEL: 100,
  INVESTOR_MATCHING: 80,
  MVP_GENERATION: 150,
  AI_ANALYSIS: 50,
} as const;

// Feature descriptions for users
export const FEATURE_DESCRIPTIONS = {
  BUSINESS_PLAN: "Comprehensive AI-generated business plan with all sections",
  PITCH_DECK: "Professional pitch deck with design and content",
  MARKET_RESEARCH: "In-depth market analysis and competitor insights",
  FINANCIAL_MODEL: "3-year financial projections and revenue modeling",
  INVESTOR_MATCHING: "AI-powered investor recommendations",
  MVP_GENERATION: "MVP code generation and architecture planning",
  AI_ANALYSIS: "Intelligent startup idea analysis and validation",
} as const;

// Solana configuration
export const SOLANA_CONFIG = {
  NETWORK: 'mainnet-beta', // Use 'devnet' for testing
  USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on mainnet
  RECIPIENT_WALLET: '', // Your business wallet - will be set from env
} as const;

// PayPal configuration
export const PAYPAL_CONFIG = {
  MODE: 'live', // 'sandbox' for testing
  CURRENCY: 'USD',
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  USAGE: 'usage',
  REFUND: 'refund',
  BONUS: 'bonus',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  SOLANA_SOL: 'solana_sol',
  SOLANA_USDC: 'solana_usdc',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  BONUS: 'bonus',
} as const;

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Helper function to check if user has enough credits
export function hasEnoughCredits(userCredits: number, requiredCredits: number): boolean {
  return userCredits >= requiredCredits;
}

// Helper function to calculate credits per dollar
export function getCreditsPerDollar(packageType: keyof typeof CREDIT_PACKAGES): number {
  const pkg = CREDIT_PACKAGES[packageType];
  if (pkg.price === 0) return 0;
  return Math.round(pkg.credits / pkg.price);
}

// Helper to get package by credits purchased
export function getPackageByCredits(credits: number): keyof typeof CREDIT_PACKAGES | null {
  if (credits === CREDIT_PACKAGES.BASIC.credits) return 'BASIC';
  if (credits === CREDIT_PACKAGES.PRO.credits) return 'PRO';
  return null;
}
