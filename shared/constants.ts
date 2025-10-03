// Credit and Pricing Configuration
export const CREDIT_PACKAGES = {
  FREEMIUM: {
    name: "Freemium",
    credits: 200,
    price: 0,
    priceUSD: 0,
    priceSol: 0,
    features: [
      "200 credits",
      "1 Business Plan OR 1 Pitch Deck",
      "Limited AI analysis",
      "Basic market research"
    ]
  },
  BASIC: {
    name: "Basic",
    credits: 2000,
    price: 29,
    priceUSD: 29,
    priceSol: 0.15, // ~$29 at $200/SOL (will be calculated dynamically)
    features: [
      "2,000 credits",
      "10 Business Plans",
      "12 Pitch Decks",
      "Full AI analysis",
      "Advanced market research",
      "Priority support"
    ]
  },
  PRO: {
    name: "Pro",
    credits: 7000,
    price: 79,
    priceUSD: 79,
    priceSol: 0.40, // ~$79 at $200/SOL (will be calculated dynamically)
    features: [
      "7,000 credits",
      "35 Business Plans",
      "43 Pitch Decks",
      "Unlimited AI analysis",
      "Premium market research",
      "MVP builder access",
      "Investor matching",
      "Priority support",
      "1-on-1 consultation"
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
