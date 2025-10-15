import Anthropic from "@anthropic-ai/sdk";

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 20, 2025. do not change this unless explicitly requested by the user
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY environment variable is required for AI functionality");
}

const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY
});

export interface IdeaAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  marketOpportunity: string;
  competitiveAdvantage: string;
  recommendations: string[];
  feasibilityScore: number;
  marketSizeEstimate: string;
  webResearchEnabled?: boolean;
  searchDisclaimer?: string;
}

export interface BusinessPlan {
  executiveSummary: string;
  problemStatement: string;
  solutionDescription: string;
  marketAnalysis: string;
  businessModel: string;
  marketingStrategy: string;
  operationalPlan: string;
  managementTeam: string;
  financialProjections: string;
  fundingRequirements: string;
  riskAnalysis: string;
  timeline: string;
}

export interface SectionQualityAssessment {
  score: number; // 1-100
  strengths: string[];
  improvements: string[];
  completeness: number; // 1-100
  professionalism: number; // 1-100
  investorAppeal: number; // 1-100
  wordCount: number;
  recommendedWordCount: { min: number; max: number };
  overallFeedback: string;
}

export interface BusinessPlanSectionContent {
  content: string;
  quality: SectionQualityAssessment;
}

export interface PitchDeck {
  slides: {
    title: string;
    content: string;
    notes: string;
  }[];
}

export interface WebsiteSection {
  id: string;
  content: string;
  aiGenerated: boolean;
}

export interface WebsiteContent {
  sections: { [key: string]: WebsiteSection };
}

// Demo website content for when Anthropic API is unavailable
function getDemoWebsiteContent(companyName: string, industry: string, businessPlan?: BusinessPlan): WebsiteContent {
  return {
    sections: {
      hero: {
        id: 'hero',
        content: `Revolutionize ${industry} with ${companyName}. Transform your business with our innovative solutions and cutting-edge technology.`,
        aiGenerated: true
      },
      about: {
        id: 'about', 
        content: `${companyName} is leading the transformation in ${industry}. ${businessPlan?.executiveSummary?.substring(0, 200) || 'Our innovative approach delivers measurable results for businesses of all sizes.'} We combine expertise with technology to create solutions that drive real business value.`,
        aiGenerated: true
      },
      features: {
        id: 'features',
        content: `🚀 Industry-leading technology\n✨ Expert support team\n📈 Proven ROI and results\n🔒 Enterprise-grade security\n⚡ Lightning-fast performance\n🎯 Tailored solutions for your needs`,
        aiGenerated: true
      },
      testimonials: {
        id: 'testimonials',
        content: `"${companyName} completely transformed our operations. The results exceeded our expectations!" - Sarah Johnson, CEO\n\n"Outstanding service and incredible results. Highly recommended for any ${industry} business." - Michael Chen, CTO`,
        aiGenerated: true
      },
      pricing: {
        id: 'pricing',
        content: `Choose the perfect plan for your ${industry} business. Starting from $99/month for small businesses, with enterprise options available. Flexible pricing that grows with your success.`,
        aiGenerated: true
      },
      contact: {
        id: 'contact',
        content: `Ready to transform your ${industry} business? Contact ${companyName} today for a free consultation. Our experts are standing by to help you achieve your goals.`,
        aiGenerated: true
      }
    }
  };
}

// Generic demo data for when Anthropic API is unavailable
function getDemoAnalysis(ideaTitle: string, industry: string): IdeaAnalysis {
  return {
    score: 78,
    strengths: [
      "Strong market demand in the " + industry + " sector",
      "Clear value proposition addressing real pain points", 
      "Scalable business model with recurring revenue potential",
      "Growing market with limited competition in specific niche"
    ],
    weaknesses: [
      "High customer acquisition costs in competitive market",
      "Need for significant technical development resources",
      "Regulatory compliance requirements may slow growth",
      "Dependency on third-party integrations"
    ],
    marketOpportunity: `The ${industry} market shows strong growth potential with increasing digitization trends. Early adopters are actively seeking solutions like ${ideaTitle}, presenting a significant opportunity for market entry and scaling.`,
    competitiveAdvantage: "First-mover advantage in specialized segment, unique technology approach, and potential for network effects as user base grows.",
    recommendations: [
      "Conduct thorough market validation with target customers",
      "Develop minimum viable product to test core assumptions", 
      "Secure strategic partnerships for customer acquisition",
      "Plan for regulatory compliance from early stages",
      "Build strong technical team for product development"
    ],
    feasibilityScore: 82,
    marketSizeEstimate: `Estimated addressable market of $2.5B+ with 15-20% annual growth rate in the ${industry} sector`
  };
}

export async function analyzeStartupIdea(
  ideaTitle: string,
  description: string,
  industry: string,
  stage: string
): Promise<IdeaAnalysis> {
  // Check if API key is available and valid for production use
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    console.log("🔒 Anthropic API key not available, using demo analysis");
    return getDemoAnalysis(ideaTitle, industry);
  }

  try {
    const prompt = `
      Analyze this startup idea using Y Combinator and top accelerator standards. Provide a comprehensive analysis in JSON format.
      
      Startup Idea: ${ideaTitle}
      Description: ${description}
      Industry: ${industry}
      Stage: ${stage}
      
      Please analyze and return JSON with these fields:
      - score: number (1-100, overall viability score)
      - strengths: string[] (key strengths of the idea)
      - weaknesses: string[] (areas of concern or weakness)
      - marketOpportunity: string (assessment of market opportunity)
      - competitiveAdvantage: string (potential competitive advantages)
      - recommendations: string[] (specific recommendations for improvement)
      - feasibilityScore: number (1-100, technical/operational feasibility)
      - marketSizeEstimate: string (estimated market size and growth potential)
      
      Focus on practical, actionable insights that would help a founder improve their startup.
    `;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: "You are a startup advisor with expertise from Y Combinator, Techstars, and other top accelerators. Provide detailed, honest analysis that helps founders succeed.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const textBlock = response.content[0];
    const text = textBlock.type === 'text' ? textBlock.text : '{}';
    const result = JSON.parse(text);
    return result as IdeaAnalysis;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("Anthropic quota exceeded, using demo analysis");
      return getDemoAnalysis(ideaTitle, industry);
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 Anthropic API error, using demo analysis");
      return getDemoAnalysis(ideaTitle, industry);
    } else if (errorMessage.includes("rate_limit")) {
      console.log("Rate limit hit, using demo analysis");
      return getDemoAnalysis(ideaTitle, industry);
    }
    console.log("API error, using demo analysis:", errorMessage);
    return getDemoAnalysis(ideaTitle, industry);
  }
}

function getDemoBusinessPlan(ideaTitle: string, description: string, industry: string): BusinessPlan {
  return {
    executiveSummary: `${ideaTitle} is a revolutionary ${industry} platform that addresses critical market needs through innovative technology solutions. Our company leverages cutting-edge AI and automation to deliver unprecedented value to customers while building a scalable, profitable business model.\n\nThe market opportunity is substantial, with the ${industry} sector experiencing rapid digital transformation and increasing demand for efficient solutions. Our unique approach positions us to capture significant market share while building strong competitive moats through technology and network effects.`,
    
    problemStatement: `The ${industry} industry faces significant challenges including inefficient processes, high operational costs, and lack of integrated solutions. Current market solutions are fragmented, expensive, and fail to address the core pain points that businesses face daily. This creates substantial friction for companies trying to scale and optimize their operations.`,
    
    solutionDescription: `${ideaTitle} provides a comprehensive platform that ${description}. Our solution integrates seamlessly with existing workflows while providing advanced analytics, automation capabilities, and user-friendly interfaces that drive adoption and value creation.`,
    
    marketAnalysis: `The ${industry} market is valued at approximately $${industry === 'Healthcare' ? '350 billion' : industry === 'Fintech' ? '179 billion' : industry === 'Education' ? '400 billion' : industry === 'Food & Delivery' ? '150 billion' : '250 billion'} globally and growing at ${industry === 'Healthcare' ? '8-12%' : industry === 'Fintech' ? '15-20%' : industry === 'Education' ? '10-15%' : industry === 'Food & Delivery' ? '12-18%' : '10-15%'} annually. Key trends driving growth include digital transformation, regulatory changes, and increasing customer expectations. Our target market includes mid-market and enterprise customers who are actively seeking modern solutions to replace legacy systems.`,
    
    businessModel: `Our revenue model is based on SaaS subscriptions with tiered pricing starting at $99/month for small businesses and scaling to enterprise packages of $10,000+ monthly. Additional revenue streams include professional services, integrations, and premium features. We project 85% gross margins with strong unit economics.`,
    
    marketingStrategy: `Customer acquisition will focus on digital marketing, content creation, strategic partnerships, and direct sales for enterprise accounts. Our go-to-market strategy emphasizes product-led growth with freemium offerings to drive adoption, combined with targeted outbound sales for high-value prospects.`,
    
    operationalPlan: `Operations will be built around a cloud-first architecture leveraging modern development practices. Key operational areas include product development, customer success, sales, and marketing. We plan to scale the team from 5 to 25 employees over 18 months while maintaining high productivity and quality standards.`,
    
    managementTeam: `Our founding team combines deep industry expertise with proven track records in building and scaling technology companies. Key roles include CEO with 10+ years industry experience, CTO with background in enterprise software, and VP Sales with successful exits. We plan to hire experienced professionals in product, engineering, and customer success.`,
    
    financialProjections: `Year 1: $250K ARR, Year 2: $1.2M ARR, Year 3: $4.5M ARR, Year 4: $12M ARR, Year 5: $28M ARR. Path to profitability by Year 3 with improving unit economics. Key metrics include 5% monthly churn, $150 CAC, $2,400 LTV, and 85% gross margins.`,
    
    fundingRequirements: `Seeking $2M seed funding to accelerate product development, team growth, and market penetration. Funds will be allocated 60% to engineering and product, 25% to sales and marketing, 15% to operations and working capital. Key milestones include product-market fit, $1M ARR, and Series A readiness.`,
    
    riskAnalysis: `Primary risks include competitive threats from established players, technology execution challenges, and market adoption rates. Mitigation strategies include strong IP protection, agile development practices, close customer relationships, and maintaining lean operations with multiple contingency plans.`,
    
    timeline: `Months 1-6: Complete MVP development, initial customer pilots, team expansion to 12 people. Months 7-12: Product launch, first paying customers, achieve $100K ARR. Months 13-18: Scale to $500K ARR, expand feature set, prepare Series A fundraising. Months 19-24: Reach $1M+ ARR, market expansion, operational scaling.`
  };
}

// Helper function to parse various numeric formats into billions
function parseMarketSizeInBillions(text: string): number | null {
  const lowerText = text.toLowerCase();
  
  // Match patterns like $10B, $10 billion, $10,000,000,000, etc.
  const patterns = [
    // $10T, $10 trillion
    /\$(\d+(?:\.\d+)?)\s*(?:trillion|t)\b/gi,
    // $10B, $10 billion  
    /\$(\d+(?:\.\d+)?)\s*(?:billion|b)\b/gi,
    // $10,000,000,000 (raw billions)
    /\$(\d{1,3}(?:,\d{3}){3,})\b/g,
    // Written numbers: ten billion, fifty billion, etc.
    /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\s+(?:billion|trillion)/gi
  ];
  
  let maxValue = 0;
  
  // Check trillion patterns (multiply by 1000)
  const trillionMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(?:trillion|t)\b/gi);
  if (trillionMatch) {
    trillionMatch.forEach(match => {
      const num = parseFloat(match.replace(/[^\d.]/g, ''));
      if (!isNaN(num)) {
        maxValue = Math.max(maxValue, num * 1000);
      }
    });
  }
  
  // Check billion patterns (with $ prefix)
  const billionMatch = text.match(/\$(\d+(?:\.\d+)?)\s*(?:billion|b|bn)\b/gi);
  if (billionMatch) {
    billionMatch.forEach(match => {
      const num = parseFloat(match.replace(/[^\d.]/g, ''));
      if (!isNaN(num)) {
        maxValue = Math.max(maxValue, num);
      }
    });
  }
  
  // Check billion patterns (without $ prefix)
  const nonDollarBillionMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(?:billion|bn)\b/gi);
  if (nonDollarBillionMatch) {
    nonDollarBillionMatch.forEach(match => {
      const num = parseFloat(match.replace(/[^\d.]/g, ''));
      if (!isNaN(num)) {
        maxValue = Math.max(maxValue, num);
      }
    });
  }
  
  // Check USD/US$ prefixed amounts
  const usdMatch = text.match(/(?:USD|US\$)\s*(\d+(?:\.\d+)?)\s*(?:billion|B|bn|trillion|T)\b/gi);
  if (usdMatch) {
    usdMatch.forEach(match => {
      const num = parseFloat(match.replace(/[^\d.]/g, ''));
      const isTrillion = /trillion|T\b/i.test(match);
      if (!isNaN(num)) {
        maxValue = Math.max(maxValue, isTrillion ? num * 1000 : num);
      }
    });
  }
  
  // Check raw number patterns (assume billions if very large)
  const rawMatch = text.match(/\$(\d{1,3}(?:,\d{3}){2,})\b/g);
  if (rawMatch) {
    rawMatch.forEach(match => {
      const numStr = match.replace(/[^\d]/g, '');
      const num = parseInt(numStr);
      if (!isNaN(num) && num >= 1000000000) {
        maxValue = Math.max(maxValue, num / 1000000000);
      }
    });
  }
  
  // Check written number patterns
  const writtenNumbers: { [key: string]: number } = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
    'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
    'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'hundred': 100, 'thousand': 1000
  };
  
  const writtenMatch = text.match(/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\s+(?:billion|trillion)/gi);
  if (writtenMatch) {
    writtenMatch.forEach(match => {
      const words = match.toLowerCase().split(/\s+/);
      const numWord = words[0];
      const unit = words[words.length - 1];
      
      if (writtenNumbers[numWord]) {
        const value = unit === 'trillion' ? writtenNumbers[numWord] * 1000 : writtenNumbers[numWord];
        maxValue = Math.max(maxValue, value);
      }
    });
  }
  
  return maxValue > 0 ? maxValue : null;
}

// Classify business idea scale based on title and description
function classifyBusinessScale(ideaTitle: string, description: string, industry: string): 'local_smb' | 'regional' | 'national' | 'global_saas' {
  const combined = `${ideaTitle} ${description}`.toLowerCase();
  
  // Local SMB indicators
  const localIndicators = [
    'cafe', 'coffee shop', 'restaurant', 'bar', 'bakery', 'salon', 'barbershop',
    'gym', 'fitness center', 'local', 'neighborhood', 'community', 'brick and mortar',
    'physical store', 'retail store', 'workshop', 'studio', 'clinic', 'practice'
  ];
  
  // Global SaaS indicators
  const globalIndicators = [
    'saas', 'software', 'platform', 'api', 'cloud', 'ai', 'machine learning',
    'automation', 'analytics', 'dashboard', 'crm', 'erp', 'b2b', 'enterprise',
    'worldwide', 'global', 'international', 'digital platform', 'web app',
    'mobile app', 'subscription', 'freemium'
  ];
  
  // Regional indicators
  const regionalIndicators = [
    'franchise', 'multi-location', 'regional', 'state-wide', 'province',
    'delivery service', 'logistics', 'supply chain'
  ];
  
  // Count matches
  const localScore = localIndicators.filter(indicator => combined.includes(indicator)).length;
  const globalScore = globalIndicators.filter(indicator => combined.includes(indicator)).length;
  const regionalScore = regionalIndicators.filter(indicator => combined.includes(indicator)).length;
  
  // Special cases - prioritize strong local indicators
  const strongLocalIndicators = ['cafe', 'coffee shop', 'restaurant', 'bar', 'bakery', 'salon'];
  const hasStrongLocal = strongLocalIndicators.some(indicator => combined.includes(indicator));
  
  if (hasStrongLocal) {
    return 'local_smb'; // Coffee shop with mobile app is still local SMB
  }
  
  if (industry === 'Food & Delivery' && !combined.includes('saas') && !combined.includes('software')) {
    return 'local_smb';
  }
  
  if (localScore > 0 && globalScore === 0) return 'local_smb';
  if (globalScore > localScore && globalScore > regionalScore) return 'global_saas';
  if (regionalScore > localScore) return 'regional';
  if (localScore > 0) return 'local_smb';
  
  // Default based on industry
  if (['Healthcare', 'Education'].includes(industry)) return 'regional';
  if (['Technology', 'Fintech'].includes(industry)) return 'global_saas';
  
  return 'national';
}

// Get appropriate market size limits based on business scale and industry
function getMarketSizeLimits(scale: string, industry: string): { maxTAM: number; preferredTAM: number; maxRevenue: number } {
  switch (scale) {
    case 'local_smb':
      return {
        maxTAM: 0.5, // $500M max TAM
        preferredTAM: 0.1, // Prefer $100M TAM
        maxRevenue: 10 // $10M max revenue projection
      };
    case 'regional':
      return {
        maxTAM: 5, // $5B max TAM
        preferredTAM: 2, // Prefer $2B TAM
        maxRevenue: 50 // $50M max revenue
      };
    case 'national':
      return {
        maxTAM: 50, // $50B max TAM
        preferredTAM: 20, // Prefer $20B TAM
        maxRevenue: 100 // $100M max revenue
      };
    case 'global_saas':
    default:
      // More lenient for global SaaS but still realistic
      const industryLimits = {
        'Healthcare': { maxTAM: 500, preferredTAM: 350, maxRevenue: 200 },
        'Fintech': { maxTAM: 300, preferredTAM: 179, maxRevenue: 150 },
        'Education': { maxTAM: 600, preferredTAM: 400, maxRevenue: 200 },
        'Technology': { maxTAM: 400, preferredTAM: 250, maxRevenue: 150 }
      };
      return industryLimits[industry as keyof typeof industryLimits] || industryLimits['Technology'];
  }
}

// Clamp market size text with context-aware replacement
function clampMarketSizeText(text: string, maxValue: number, preferredValue: number): string {
  let result = text;
  
  // Parse current market size
  const currentSize = parseMarketSizeInBillions(text);
  
  if (currentSize && currentSize > maxValue) {
    const replacementSize = preferredValue;
    
    // Replace all occurrences of the inflated market size
    result = result.replace(/\$\d+(?:\.\d+)?\s*(?:trillion|T)\b/gi, `$${replacementSize} billion`);
    result = result.replace(/\$\d+(?:\.\d+)?\s*(?:billion|B|bn)\b/gi, `$${replacementSize} billion`);
    result = result.replace(/\$\d{1,3}(?:,\d{3}){3,}\b/g, `$${replacementSize} billion`);
    
    // Handle non-dollar prefixed amounts
    result = result.replace(/(?:USD|US\$)\s*\d+(?:\.\d+)?\s*(?:billion|B|bn|trillion|T)\b/gi, `$${replacementSize} billion`);
    result = result.replace(/\b\d+(?:\.\d+)?\s*(?:billion|bn)\b/gi, `${replacementSize} billion`);
    result = result.replace(/\b\d+(?:\.\d+)?\s*trillion\b/gi, `${replacementSize} billion`);
    
    // Replace written numbers (comprehensive coverage)
    result = result.replace(/\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\s+(?:billion|trillion)/gi, `${replacementSize} billion`);
  }
  
  return result;
}

// Comprehensive business plan validation with context awareness
function validateBusinessPlan(plan: any, industry: string, ideaTitle: string = '', description: string = ''): any {
  // Classify the business scale
  const businessScale = classifyBusinessScale(ideaTitle, description, industry);
  const limits = getMarketSizeLimits(businessScale, industry);
  
  console.log(`Business scale classified as: ${businessScale}, TAM limit: $${limits.maxTAM}B`);
  
  // Validate and fix market analysis
  if (plan.marketAnalysis && typeof plan.marketAnalysis === 'string') {
    plan.marketAnalysis = clampMarketSizeText(plan.marketAnalysis, limits.maxTAM, limits.preferredTAM);
    
    // Fix unrealistic growth rates (>50%)
    plan.marketAnalysis = plan.marketAnalysis.replace(/\d{3,}%/g, '15%');
    plan.marketAnalysis = plan.marketAnalysis.replace(/[6-9]\d%/g, '25%');
    plan.marketAnalysis = plan.marketAnalysis.replace(/5[0-9]%/g, '35%');
  }
  
  // Validate and fix financial projections
  if (plan.financialProjections && typeof plan.financialProjections === 'string') {
    let sanitized = plan.financialProjections;
    
    // Replace unrealistic revenue projections based on business scale
    if (businessScale === 'local_smb') {
      sanitized = sanitized.replace(/\$\d{3,}M/g, '$5M');
      sanitized = sanitized.replace(/\$\d+\.?\d*\s*billion/gi, '$10M');
    } else if (businessScale === 'regional') {
      sanitized = sanitized.replace(/\$\d{3,}M/g, '$25M');
      sanitized = sanitized.replace(/\$\d+\.?\d*\s*billion/gi, '$50M');
    } else {
      sanitized = sanitized.replace(/\$\d{4,}M/g, '$100M');
      sanitized = sanitized.replace(/\$\d+\.?\d*\s*billion/gi, `$${limits.maxRevenue}M`);
    }
    
    plan.financialProjections = sanitized;
  }
  
  // Validate executive summary for market size claims
  if (plan.executiveSummary && typeof plan.executiveSummary === 'string') {
    plan.executiveSummary = clampMarketSizeText(plan.executiveSummary, limits.maxTAM, limits.preferredTAM);
  }
  
  // Validate funding requirements to be reasonable for scale
  if (plan.fundingRequirements && typeof plan.fundingRequirements === 'string') {
    let sanitized = plan.fundingRequirements;
    
    if (businessScale === 'local_smb') {
      // Local businesses shouldn't need $50M+ funding
      sanitized = sanitized.replace(/\$\d{2,}M/g, '$500K');
      sanitized = sanitized.replace(/\$\d+\.?\d*\s*billion/gi, '$1M');
    } else if (businessScale === 'regional') {
      sanitized = sanitized.replace(/\$\d{3,}M/g, '$5M');
      sanitized = sanitized.replace(/\$\d+\.?\d*\s*billion/gi, '$10M');
    }
    
    plan.fundingRequirements = sanitized;
  }
  
  return plan;
}

export async function generateBusinessPlan(
  ideaTitle: string,
  description: string,
  industry: string,
  problemStatement?: string,
  solutionApproach?: string,
  targetMarket?: string,
  analysis?: IdeaAnalysis
): Promise<BusinessPlan> {
  // Check if API key is available and valid for production use
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    console.log("🔒 Anthropic API key not available, using demo business plan");
    const demoPlan = getDemoBusinessPlan(ideaTitle, description, industry);
    return validateBusinessPlan(demoPlan, industry, ideaTitle, description) as BusinessPlan;
  }

  try {
    const contextInfo = [
      `Industry: ${industry}`,
      problemStatement ? `Problem: ${problemStatement}` : '',
      solutionApproach ? `Solution: ${solutionApproach}` : '',
      targetMarket ? `Target Market: ${targetMarket}` : '',
      analysis ? `Validation Score: ${analysis.score}/100` : ''
    ].filter(Boolean).join('\n');

    const prompt = `
      Generate a comprehensive business plan for this startup idea.
      
      Startup Idea: ${ideaTitle}
      Description: ${description}
      ${contextInfo}
      
      ${analysis ? `Analysis insights: ${JSON.stringify(analysis)}` : ''}
      
      Create a detailed business plan in JSON format with these sections:
      - executiveSummary: string (compelling 2-3 paragraph summary)
      - problemStatement: string (clear problem definition)
      - solutionDescription: string (detailed solution explanation)
      - marketAnalysis: string (market size, trends, target customers)
      - businessModel: string (revenue streams, pricing, unit economics)
      - marketingStrategy: string (customer acquisition, channels, positioning)
      - operationalPlan: string (operations, technology, processes)
      - managementTeam: string (team structure, key roles, hiring plan)
      - financialProjections: string (5-year projections, key metrics)
      - fundingRequirements: string (funding needed, use of funds, milestones)
      - riskAnalysis: string (key risks and mitigation strategies)
      - timeline: string (12-24 month roadmap with key milestones)
      
      IMPORTANT GUIDELINES FOR REALISTIC ESTIMATES:
      - Market sizes: Healthcare ~$350B, Fintech ~$179B, Education ~$400B, Food & Delivery ~$150B, Technology ~$250B
      - Growth rates: Healthcare 8-12%, Fintech 15-20%, Education 10-15%, Food & Delivery 12-18%, Technology 10-15%
      - For local businesses: TAM should be $50M-$5B, not tens of billions
      - Revenue projections: Start with $50K-$500K Year 1, scale realistically
      - Be conservative and realistic - avoid inflated numbers that hurt credibility
      
      Make it professional, detailed, and investor-ready following Y Combinator standards.
    `;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: "You are a startup advisor. Create concise, investor-grade business plans quickly.",
      messages: [
        {
          role: "user",
          content: `Generate concise business plan for ${ideaTitle}: ${description}. Return JSON with 12 sections: executiveSummary, problemStatement, solutionDescription, marketAnalysis, businessModel, marketingStrategy, operationalPlan, managementTeam, financialProjections, fundingRequirements, riskAnalysis, timeline. Each section 1-2 paragraphs.`
        }
      ]
    });

    const textBlock = response.content[0];
    const text = textBlock.type === 'text' ? textBlock.text : '{}';
    const result = JSON.parse(text);
    
    // Validate and sanitize the business plan for realistic values
    return validateBusinessPlan(result, industry, ideaTitle, description) as BusinessPlan;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("Anthropic quota exceeded, using demo business plan");
      const demoPlan = getDemoBusinessPlan(ideaTitle, description, industry);
      return validateBusinessPlan(demoPlan, industry, ideaTitle, description) as BusinessPlan;
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 Anthropic API error, using demo business plan");
      const demoPlan = getDemoBusinessPlan(ideaTitle, description, industry);
      return validateBusinessPlan(demoPlan, industry, ideaTitle, description) as BusinessPlan;
    } else if (errorMessage.includes("rate_limit")) {
      console.log("Rate limit hit, using demo business plan");
      const demoPlan = getDemoBusinessPlan(ideaTitle, description, industry);
      return validateBusinessPlan(demoPlan, industry, ideaTitle, description) as BusinessPlan;
    }
    console.log("API error, using demo business plan:", errorMessage);
    const demoPlan = getDemoBusinessPlan(ideaTitle, description, industry);
    return validateBusinessPlan(demoPlan, industry, ideaTitle, description) as BusinessPlan;
  }
}

// Section quality assessment function (client-side, no API needed)
export function assessSectionQuality(
  sectionId: string,
  content: string,
  ideaTitle: string,
  industry: string
): SectionQualityAssessment {
  // Define expected word counts for each section
  const sectionWordCounts: Record<string, { min: number; max: number }> = {
    'executive-summary': { min: 200, max: 400 },
    'problem-statement': { min: 150, max: 300 },
    'solution-overview': { min: 150, max: 300 },
    'market-analysis': { min: 200, max: 400 },
    'business-model': { min: 150, max: 300 },
    'marketing-strategy': { min: 150, max: 300 },
    'operations-plan': { min: 150, max: 300 },
    'management-team': { min: 100, max: 250 },
    'financial-projections': { min: 200, max: 400 },
    'funding-request': { min: 150, max: 300 },
    'risk-analysis': { min: 150, max: 300 },
    'implementation-timeline': { min: 100, max: 250 }
  };

  const { min: minWords, max: maxWords } = sectionWordCounts[sectionId] || { min: 100, max: 300 };

  // Calculate actual word count
  const wordCount = content.trim().split(/\s+/).length;

  // Define critical elements for each section
  const criticalElements: Record<string, string[]> = {
    'executive-summary': ['market', 'solution', 'revenue', 'funding'],
    'problem-statement': ['problem', 'impact', 'current', 'market'],
    'solution-overview': ['solution', 'features', 'benefits', 'technology'],
    'market-analysis': ['market size', 'growth', 'target', 'trends'],
    'business-model': ['revenue', 'pricing', 'customers', 'margins'],
    'marketing-strategy': ['channels', 'acquisition', 'target', 'strategy'],
    'operations-plan': ['operations', 'team', 'process', 'technology'],
    'management-team': ['team', 'experience', 'roles', 'expertise'],
    'financial-projections': ['revenue', 'year', 'growth', 'margins'],
    'funding-request': ['funding', 'use', 'milestones', 'runway'],
    'risk-analysis': ['risks', 'mitigation', 'challenges', 'strategy'],
    'implementation-timeline': ['months', 'milestones', 'launch', 'timeline']
  };

  const elementsToCheck = criticalElements[sectionId] || [];
  const elementsFound = elementsToCheck.filter((element: string) => 
    content.toLowerCase().includes(element.toLowerCase())
  );

  // Calculate completeness score
  const completenessScore = (elementsFound.length / elementsToCheck.length) * 100;

  // Calculate professionalism score based on indicators
  const professionalismIndicators = [
    content.includes('$'), // Financial metrics
    /\d+%/.test(content), // Percentages
    /\d{4}/.test(content), // Years
    content.split('.').length > 3, // Multiple sentences
    content.length > 200, // Sufficient detail
    !content.includes('...'), // No placeholders
    !/TODO|TBD|xxx/i.test(content) // No TODOs
  ];
  const professionalismScore = (professionalismIndicators.filter(Boolean).length / professionalismIndicators.length) * 100;

  // Calculate investor appeal score
  const investorAppealIndicators = [
    content.includes('market'), // Market focus
    /\$[\d,]+/.test(content), // Specific dollar amounts
    content.includes('growth') || content.includes('scale'), // Growth focus
    content.includes('customer') || content.includes('user'), // Customer focus
    content.includes('competitive') || content.includes('advantage'), // Differentiation
    /[0-9]+(x|X)\s/.test(content), // Growth multipliers
    content.includes('scale') || content.includes('scalab') // Scalability
  ];
  const investorAppealScore = (investorAppealIndicators.filter(Boolean).length / investorAppealIndicators.length) * 100;

  const overallScore = (completenessScore + professionalismScore + investorAppealScore) / 3;

  // Generate feedback
  const strengths = [];
  const improvements = [];

  if (wordCount >= minWords && wordCount <= maxWords) {
    strengths.push('Appropriate length for section type');
  } else if (wordCount < minWords) {
    improvements.push(`Content too short - add ${minWords - wordCount} more words`);
  } else {
    improvements.push(`Content too long - reduce by ${wordCount - maxWords} words`);
  }

  if (elementsFound.length === elementsToCheck.length) {
    strengths.push('Contains all critical elements');
  } else {
    const missing = elementsToCheck.filter((el: string) => !elementsFound.includes(el));
    improvements.push(`Missing critical elements: ${missing.join(', ')}`);
  }

  if (professionalismScore > 70) {
    strengths.push('Professional language and tone');
  } else {
    improvements.push('Use more professional language and include specific metrics');
  }

  if (investorAppealScore > 70) {
    strengths.push('Strong investor appeal with business metrics');
  } else {
    improvements.push('Add more business metrics and growth indicators');
  }

  const overallFeedback = overallScore > 85 ? 
    'Excellent section ready for investors' :
    overallScore > 70 ?
    'Good section with minor improvements needed' :
    overallScore > 50 ?
    'Acceptable section but needs significant improvements' :
    'Section needs major revision before investor presentation';

  return {
    score: Math.round(overallScore),
    strengths,
    improvements,
    completeness: Math.round(completenessScore),
    professionalism: Math.round(professionalismScore),
    investorAppeal: Math.round(investorAppealScore),
    wordCount,
    recommendedWordCount: { min: minWords, max: maxWords },
    overallFeedback
  };
}

// Generate demo content for sections when Anthropic is unavailable
function generateDemoSectionContent(
  sectionId: string,
  ideaTitle: string,
  description: string,
  industry: string
): string {
  // Get industry-specific customizations
  const industryCustomizations = getIndustryCustomizations(industry);
  const businessModelType = getBusinessModelType(description, industry);
  
  const demoContent: Record<string, string> = {
    'executive-summary': `${ideaTitle} is a revolutionary ${industry} platform that addresses critical market needs through innovative technology solutions. Our company leverages cutting-edge AI and automation to deliver unprecedented value to customers while building a scalable, profitable business model.\n\nThe market opportunity is substantial, with the ${industry} sector experiencing rapid digital transformation and increasing demand for efficient solutions. Our unique approach positions us to capture significant market share while building strong competitive moats through technology and network effects.\n\nWe are seeking $2M in seed funding to accelerate product development and market penetration, targeting $1M ARR within 18 months.`,
    
    'problem-statement': `The ${industry} industry faces significant challenges including inefficient processes, high operational costs, and lack of integrated solutions. Current market solutions are fragmented, expensive, and fail to address the core pain points that businesses face daily.\n\nThis creates substantial friction for companies trying to scale and optimize their operations. Market research indicates that businesses lose an average of 23% of potential revenue due to these inefficiencies, representing a $2.5B annual opportunity.`,
    
    'solution-overview': `${ideaTitle} provides a comprehensive platform that ${description}. Our solution integrates seamlessly with existing workflows while providing advanced analytics, automation capabilities, and user-friendly interfaces that drive adoption and value creation.\n\nKey features include AI-powered automation, real-time analytics, mobile-first design, and enterprise-grade security. Our unique approach delivers 40% cost savings and 3x productivity improvements for customers.`,
    
    'market-analysis': `The ${industry} market is valued at over $15 billion globally and growing at 12-15% annually. Key trends driving growth include digital transformation, regulatory changes, and increasing customer expectations.\n\nOur target market includes mid-market and enterprise customers who are actively seeking modern solutions to replace legacy systems. The serviceable addressable market represents $2.8B with strong tailwinds from technology adoption.`,
    
    'business-model': generateBusinessModelContent(ideaTitle, businessModelType, industryCustomizations),
    
    'marketing-strategy': `Customer acquisition will focus on digital marketing, content creation, strategic partnerships, and direct sales for enterprise accounts. Our go-to-market strategy emphasizes product-led growth with freemium offerings to drive adoption.\n\nKey channels include SEO/content marketing (40%), direct sales (35%), partnerships (15%), and paid advertising (10%). We target 5% monthly growth rate with declining customer acquisition costs.`,
    
    'operations-plan': generateOperationsContent(businessModelType, industryCustomizations),
    
    'management-team': `Our founding team combines deep industry expertise with proven track records in building and scaling technology companies. CEO brings 10+ years ${industry} experience with 2 successful exits. CTO has background in enterprise software with previous companies scaling to $50M+ revenue.\n\nKey positions to fill include VP Sales, Head of Product, and Senior Engineers. Advisory board includes industry leaders and successful entrepreneurs who provide strategic guidance and network access.`,
    
    'financial-projections': generateFinancialProjections(businessModelType, industryCustomizations),
    
    'funding-request': `Seeking $2M seed funding to accelerate product development, team growth, and market penetration. Use of funds: 60% engineering and product development ($1.2M), 25% sales and marketing ($500K), 15% operations and working capital ($300K).\n\nKey milestones include completing MVP, acquiring first 100 customers, achieving $500K ARR, and Series A readiness. 18-month runway provides sufficient time to achieve these goals.`,
    
    'risk-analysis': `Primary risks include competitive threats from established players, technology execution challenges, and market adoption rates. Large incumbents could launch competing products, though our first-mover advantage and specialized focus provide protection.\n\nMitigation strategies include strong IP protection, agile development practices, close customer relationships, and maintaining lean operations. Regulatory compliance is managed through legal partnerships and industry expertise.`,
    
    'implementation-timeline': `12-month roadmap:\nMonths 1-3: Complete MVP development, initial customer pilots\nMonths 4-6: Product launch, first paying customers, achieve $50K ARR\nMonths 7-9: Scale to $200K ARR, expand feature set\nMonths 10-12: Reach $500K ARR, team growth to 15 people\n\nKey milestones include product-market fit validation, customer success metrics, and Series A fundraising preparation.`
  };

  return demoContent[sectionId] || `Generated content for ${sectionId} section of ${ideaTitle}. This comprehensive section addresses the key requirements for investor-ready business plans in the ${industry} industry.`;
}

// Helper functions for industry-specific customization
function getIndustryCustomizations(industry: string) {
  const industryData: Record<string, any> = {
    'fintech': {
      metrics: ['AUM (Assets Under Management)', 'Transaction Volume', 'Revenue per User'],
      regulatoryFocus: 'compliance with financial regulations',
      marketSize: '$4.5 trillion',
      investorConcerns: ['regulatory compliance', 'security', 'customer trust']
    },
    'healthtech': {
      metrics: ['Patient Engagement Rate', 'Clinical Outcomes', 'Cost per Patient'],
      regulatoryFocus: 'HIPAA compliance and FDA approval processes',
      marketSize: '$2.4 trillion',
      investorConcerns: ['regulatory approval', 'clinical validation', 'reimbursement']
    },
    'e-commerce': {
      metrics: ['GMV (Gross Merchandise Value)', 'Take Rate', 'Customer Lifetime Value'],
      regulatoryFocus: 'consumer protection and data privacy',
      marketSize: '$5.7 trillion',
      investorConcerns: ['customer acquisition', 'logistics', 'competition']
    },
    'saas': {
      metrics: ['MRR/ARR', 'Churn Rate', 'NPS Score'],
      regulatoryFocus: 'data privacy and security',
      marketSize: '$195 billion',
      investorConcerns: ['product-market fit', 'scalability', 'competitive moats']
    },
    'edtech': {
      metrics: ['Student Engagement', 'Learning Outcomes', 'Course Completion Rate'],
      regulatoryFocus: 'educational compliance and student data protection',
      marketSize: '$404 billion',
      investorConcerns: ['adoption rates', 'learning efficacy', 'scalability']
    }
  };
  
  return industryData[industry.toLowerCase()] || {
    metrics: ['Revenue Growth', 'Customer Acquisition', 'Market Share'],
    regulatoryFocus: 'industry-specific compliance requirements',
    marketSize: '$10+ billion',
    investorConcerns: ['market adoption', 'scalability', 'competition']
  };
}

function getBusinessModelType(description: string, industry: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('subscription') || desc.includes('saas') || industry.toLowerCase() === 'saas') {
    return 'saas';
  } else if (desc.includes('marketplace') || desc.includes('platform') || desc.includes('connect')) {
    return 'marketplace';
  } else if (desc.includes('hardware') || desc.includes('device') || desc.includes('product')) {
    return 'hardware';
  } else if (desc.includes('service') || desc.includes('consulting') || desc.includes('agency')) {
    return 'services';
  } else if (desc.includes('content') || desc.includes('media') || desc.includes('advertising')) {
    return 'media';
  }
  return 'saas'; // default
}

function generateBusinessModelContent(ideaTitle: string, modelType: string, industryCustomizations: any): string {
  const businessModels: Record<string, string> = {
    'saas': `Our revenue model is built on a recurring SaaS subscription framework with tiered pricing designed to grow with customer needs. Starting at $49/month for startups, scaling to $2,000+ monthly for enterprise clients, with usage-based scaling for high-volume customers.

Key revenue streams include: core platform subscriptions (70%), premium features and add-ons (20%), professional services and implementation (10%). We project 87% gross margins with strong unit economics: $120 CAC, $2,800 LTV, achieving an industry-leading 23:1 LTV/CAC ratio. Focus on ${industryCustomizations.metrics[0]} and ${industryCustomizations.metrics[1]} as key performance indicators.`,

    'marketplace': `Our marketplace model generates revenue through commission-based transactions, connecting buyers and sellers while capturing value from successful interactions. Primary revenue streams include transaction fees (2.9% + $0.30), listing fees for premium placements, and subscription tiers for power sellers.

We project gross take rates of 8-12% as the platform matures, with network effects driving user acquisition and retention. Key metrics include ${industryCustomizations.metrics[0]}, active buyer/seller ratios, and repeat transaction rates. The model benefits from viral growth and improving unit economics with scale.`,

    'hardware': `Our hardware business model combines direct sales with recurring software revenue streams. Initial product sales generate 40-50% gross margins, while ongoing software subscriptions and services provide high-margin recurring revenue of $15-30/month per device.

Revenue streams include: hardware sales (60%), subscription services (25%), extended warranties and support (10%), data licensing (5%). Manufacturing partnerships and just-in-time inventory management optimize working capital while maintaining quality. Focus on lifetime customer value through software and service attach rates.`,

    'services': `Our professional services model leverages specialized expertise to deliver high-value outcomes for clients. Pricing combines retainer agreements, project-based engagements, and success-based pricing aligned with client outcomes.

Revenue structure: monthly retainers ($5K-25K), project work ($25K-100K+), and performance bonuses tied to client success metrics. We maintain 65-75% gross margins through efficient delivery processes and proprietary methodologies. The model scales through team expansion and productization of common solutions.`,

    'media': `Our content and media model monetizes audience engagement through advertising, subscriptions, and premium content offerings. Revenue streams include display advertising, sponsored content, premium subscriptions, and licensing deals with content creators.

Key metrics include MAU (Monthly Active Users), engagement rates, and ARPU (Average Revenue per User). We project $2-8 CPM for advertising and $9.99-29.99 monthly subscriptions for premium content. The model scales through content creation, audience growth, and advertiser demand in the ${industryCustomizations.marketSize} market.`
  };

  return businessModels[modelType] || businessModels['saas'];
}

function generateOperationsContent(modelType: string, industryCustomizations: any): string {
  const operationsPlans: Record<string, string> = {
    'saas': `Operations center on cloud-native architecture with automated scaling and high availability. Core operational functions include product development (40% of team), customer success (25%), sales and marketing (25%), and operations (10%).

Technical infrastructure leverages AWS/GCP with microservices architecture, automated CI/CD pipelines, and comprehensive monitoring. Key operational metrics include uptime (99.9% SLA), page load times (<2s), and customer support response times (<4 hours). Emphasis on ${industryCustomizations.regulatoryFocus} and security best practices.`,

    'marketplace': `Operations focus on dual-sided market dynamics, managing both buyer and seller experiences while maintaining platform integrity. Key operational areas include marketplace operations (30%), trust and safety (25%), product development (25%), and growth marketing (20%).

Platform architecture supports high-transaction volumes with real-time matching, fraud prevention, and dispute resolution systems. Critical operational metrics include transaction success rates, user satisfaction scores, and time-to-resolution for issues. Strong focus on community management and ${industryCustomizations.regulatoryFocus}.`,

    'hardware': `Operations span product development, manufacturing partnerships, quality assurance, and global distribution. Key functions include R&D (35%), supply chain management (25%), manufacturing oversight (20%), and customer support (20%).

Manufacturing partnerships in Asia provide cost advantages while maintaining quality through rigorous QA processes. Inventory management uses demand forecasting and just-in-time principles. Critical focus on ${industryCustomizations.regulatoryFocus} and international shipping logistics.`,

    'services': `Operations emphasize talent acquisition, knowledge management, and client delivery excellence. Core areas include service delivery (40%), business development (30%), talent management (20%), and operations support (10%).

Delivery methodology combines proven frameworks with custom solutions for each client. Knowledge management systems capture learnings and best practices for reuse. Key operational metrics include client satisfaction scores, project margin analysis, and utilization rates across consultants.`,

    'media': `Operations focus on content creation workflows, audience engagement, and monetization optimization. Key areas include content production (35%), audience development (25%), advertising operations (25%), and platform maintenance (15%).

Content management systems support multi-format publishing with SEO optimization and social media integration. Analytics platforms track engagement metrics, conversion rates, and advertiser performance. Strong emphasis on ${industryCustomizations.regulatoryFocus} and content quality standards.`
  };

  return operationsPlans[modelType] || operationsPlans['saas'];
}

function generateFinancialProjections(modelType: string, industryCustomizations: any): string {
  const projections: Record<string, string> = {
    'saas': `5-year SaaS financial projections with focus on recurring revenue growth:
Year 1: $180K ARR (150 customers at $1.2K ACV)
Year 2: $850K ARR (708 customers, improved retention)
Year 3: $3.2M ARR (2,667 customers, profitability achieved)
Year 4: $9.5M ARR (7,917 customers, market expansion)
Year 5: $24M ARR (20K customers, enterprise focus)

Key assumptions: 12% monthly growth, 5% churn, expanding from 85% to 90% gross margins, ${industryCustomizations.metrics[0]} growth of 25% annually, and ${industryCustomizations.metrics[1]} improvement driving expansion revenue.`,

    'marketplace': `5-year marketplace financial projections based on transaction volume growth:
Year 1: $280K revenue (8% take rate on $3.5M GMV)
Year 2: $1.4M revenue (9% take rate on $15.6M GMV)
Year 3: $5.8M revenue (10% take rate on $58M GMV)
Year 4: $18.2M revenue (11% take rate on $165M GMV)
Year 5: $45M revenue (12% take rate on $375M GMV)

Growth driven by network effects, increasing ${industryCustomizations.metrics[0]}, and expanding take rates as value-added services launch. Marketplace commission model provides 80-85% gross margins with high scalability.`,

    'hardware': `5-year hardware + software revenue projections with recurring components:
Year 1: $320K (800 units × $400 hardware, limited software)
Year 2: $1.8M (3,200 units sold, $45K monthly software ARR)
Year 3: $6.2M (8,500 units sold, $280K monthly software ARR)
Year 4: $14.8M (15,000 units sold, $680K monthly software ARR)
Year 5: $28.5M (22,000 units sold, $1.2M monthly software ARR)

Business model evolution from hardware-focused (Year 1: 90% hardware) to software-driven (Year 5: 50% recurring). Improving margins from 45% to 68% as software revenue scales.`,

    'services': `5-year professional services financial projections with scaling team:
Year 1: $450K (3 consultants, $150K revenue per consultant)
Year 2: $1.4M (7 consultants, improved utilization rates)
Year 3: $3.8M (15 consultants, premium service tiers)
Year 4: $8.2M (25 consultants, enterprise accounts)
Year 5: $16.5M (35 consultants, productized offerings)

Growth through team expansion, premium pricing ($250-500/hour), and productization of common solutions. Gross margins improve from 65% to 78% through efficiency gains and premium positioning in ${industryCustomizations.marketSize} market.`,

    'media': `5-year media and content financial projections based on audience growth:
Year 1: $125K (50K MAU, $2.50 ARPU annually)
Year 2: $680K (200K MAU, $3.40 ARPU)
Year 3: $2.8M (700K MAU, $4.00 ARPU)
Year 4: $8.4M (1.8M MAU, $4.67 ARPU)
Year 5: $21M (3.5M MAU, $6.00 ARPU)

Revenue mix evolves: advertising (60% to 40%), subscriptions (20% to 45%), premium content (20% to 15%). Focus on ${industryCustomizations.metrics[1]} and content engagement driving advertiser demand and subscription growth.`
  };

  return projections[modelType] || projections['saas'];
}

export async function generateBusinessPlanSection(
  sectionId: string,
  ideaTitle: string,
  description: string,
  industry: string,
  existingContent?: string,
  businessPlan?: Partial<BusinessPlan>,
  userInput?: string
): Promise<BusinessPlanSectionContent> {
  // Check if API key is available
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    console.log("🔒 Anthropic API key not available, using demo section content");
    const demoContent = generateDemoSectionContent(sectionId, ideaTitle, description, industry);
    const quality = assessSectionQuality(sectionId, demoContent, ideaTitle, industry);
    return { content: demoContent, quality };
  }

  try {
    const contextInfo = [
      `Startup: ${ideaTitle}`,
      `Description: ${description}`,
      `Industry: ${industry}`,
      `Section: ${sectionId}`,
      existingContent ? `Current Content: ${existingContent}` : '',
      userInput ? `User Input: ${userInput}` : '',
      businessPlan ? `Business Plan Context: ${JSON.stringify(businessPlan)}` : ''
    ].filter(Boolean).join('\n');

    const prompt = `
      ${userInput ? 'Improve' : 'Generate'} content for the ${sectionId} section of a business plan.
      
      ${contextInfo}
      
      ${userInput ? 
        `The user wants to: ${userInput}. ${existingContent ? `Improve this content: ${existingContent}` : 'Generate new content.'}` :
        'Generate comprehensive, investor-ready content for this section.'
      }
      
      Requirements:
      - Professional, detailed, and specific
      - Include metrics, numbers, and concrete examples
      - Follow Y Combinator and top accelerator standards
      - Be realistic and conservative with projections
      - ${sectionId === 'financial-projections' ? 'Use realistic revenue projections starting from $50K-$500K Year 1' : ''}
      
      Return only the section content as plain text, not JSON.
    `;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: "You are a business plan expert who creates investor-ready content. Focus on clarity, specifics, and realistic projections.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const textBlock = response.content[0];
    const content = textBlock.type === 'text' ? textBlock.text : '';
    const quality = assessSectionQuality(sectionId, content, ideaTitle, industry);

    return { content, quality };
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("API error, using demo section content:", errorMessage);
    const demoContent = generateDemoSectionContent(sectionId, ideaTitle, description, industry);
    const quality = assessSectionQuality(sectionId, demoContent, ideaTitle, industry);
    return { content: demoContent, quality };
  }
}

export async function generateWebsiteContent(
  companyName: string,
  description: string,
  industry: string,
  requestedSections: string[] = ['hero', 'about', 'features', 'testimonials', 'pricing', 'contact'],
  businessPlan?: BusinessPlan
): Promise<WebsiteContent> {
  // Check if API key is available and valid for production use
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    console.log("🔒 Anthropic API key not available, using demo website content");
    return getDemoWebsiteContent(companyName, industry, businessPlan);
  }

  try {
    const contextInfo = [
      `Company: ${companyName}`,
      `Description: ${description}`,
      `Industry: ${industry}`,
      businessPlan ? `Business Plan Summary: ${businessPlan.executiveSummary}` : '',
      businessPlan ? `Solution: ${businessPlan.solutionDescription}` : ''
    ].filter(Boolean).join('\n');

    const prompt = `
      Generate compelling website copy for each section of a professional business website. Create content that converts visitors into customers.
      
      ${contextInfo}
      
      Generate content for these sections: ${requestedSections.join(', ')}
      
      Return JSON with this structure:
      {
        "sections": {
          "hero": {
            "id": "hero",
            "content": "compelling hero section copy (1-2 sentences)",
            "aiGenerated": true
          },
          "about": {
            "id": "about",
            "content": "about section copy (2-3 sentences)",
            "aiGenerated": true
          },
          "features": {
            "id": "features", 
            "content": "feature list separated by newlines (6 features max)",
            "aiGenerated": true
          },
          "testimonials": {
            "id": "testimonials",
            "content": "2 customer testimonials separated by double newlines",
            "aiGenerated": true
          },
          "pricing": {
            "id": "pricing",
            "content": "pricing section copy (1-2 sentences)", 
            "aiGenerated": true
          },
          "contact": {
            "id": "contact",
            "content": "contact section copy (1-2 sentences)",
            "aiGenerated": true
          }
        }
      }
      
      Make it professional, benefit-focused, and action-oriented. Use the business plan context when available.
    `;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: "You are an expert copywriter who creates high-converting website copy for businesses. Focus on benefits, clear value propositions, and compelling calls-to-action.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const textBlock = response.content[0];
    const text = textBlock.type === 'text' ? textBlock.text : '{}';
    const result = JSON.parse(text);
    return result as WebsiteContent;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("Anthropic quota exceeded, using demo website content");
      return getDemoWebsiteContent(companyName, industry, businessPlan);
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 Anthropic API error, using demo website content");
      return getDemoWebsiteContent(companyName, industry, businessPlan);
    } else if (errorMessage.includes("rate_limit")) {
      console.log("Rate limit hit, using demo website content");
      return getDemoWebsiteContent(companyName, industry, businessPlan);
    }
    console.log("API error, using demo website content:", errorMessage);
    return getDemoWebsiteContent(companyName, industry, businessPlan);
  }
}

export async function generatePitchDeck(
  ideaTitle: string,
  description: string,
  industry: string,
  businessPlan: BusinessPlan
): Promise<PitchDeck> {
  try {
    const prompt = `
      Create a compelling 12-slide pitch deck for this startup. Use the business plan content to create investor-ready slides.
      
      Startup: ${ideaTitle}
      Description: ${description}
      Industry: ${industry}
      
      Business Plan: ${JSON.stringify(businessPlan)}
      
      Create a pitch deck with exactly 12 slides in JSON format:
      
      Standard slide order:
      1. Title/Company Introduction
      2. Problem
      3. Solution
      4. Market Opportunity
      5. Product/Demo
      6. Business Model
      7. Traction/Validation
      8. Competition
      9. Marketing & Sales Strategy
      10. Team
      11. Financial Projections
      12. Funding Ask
      
      Return JSON structure:
      {
        "slides": [
          {
            "title": "slide title",
            "content": "bullet points and key information",
            "notes": "presenter notes and talking points"
          }
        ]
      }
      
      Make each slide concise, visual-friendly, and investor-focused. Include specific numbers and metrics.
    `;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: "You are a pitch deck expert who creates compelling investor presentations. Focus on clarity, visual appeal, and persuasive storytelling.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const textBlock = response.content[0];
    const text = textBlock.type === 'text' ? textBlock.text : '{}';
    const result = JSON.parse(text);
    return result as PitchDeck;
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("API error generating pitch deck:", errorMessage);
    
    // Return a basic demo pitch deck
    return {
      slides: [
        {
          title: `${ideaTitle}`,
          content: `${description}\n\n${industry} Industry`,
          notes: "Introduce your company with confidence and energy. State the problem you solve."
        },
        {
          title: "The Problem",
          content: businessPlan.problemStatement,
          notes: "Make the problem relatable and urgent. Use statistics if available."
        },
        {
          title: "Our Solution",
          content: businessPlan.solutionDescription,
          notes: "Clearly explain how your solution solves the problem uniquely."
        },
        {
          title: "Market Opportunity",
          content: businessPlan.marketAnalysis,
          notes: "Demonstrate the size and growth of the market opportunity."
        },
        {
          title: "Business Model",
          content: businessPlan.businessModel,
          notes: "Explain how you make money and your unit economics."
        },
        {
          title: "Marketing Strategy",
          content: businessPlan.marketingStrategy,
          notes: "Show your customer acquisition strategy and channels."
        },
        {
          title: "Operations",
          content: businessPlan.operationalPlan,
          notes: "Explain how you will execute and scale operations."
        },
        {
          title: "Team",
          content: businessPlan.managementTeam,
          notes: "Highlight team experience and why you're uniquely qualified."
        },
        {
          title: "Financial Projections",
          content: businessPlan.financialProjections,
          notes: "Present realistic projections with key assumptions."
        },
        {
          title: "Funding Requirements",
          content: businessPlan.fundingRequirements,
          notes: "Clearly state how much you're raising and use of funds."
        },
        {
          title: "Risks & Mitigation",
          content: businessPlan.riskAnalysis,
          notes: "Show you've thought through risks and have mitigation plans."
        },
        {
          title: "Timeline & Milestones",
          content: businessPlan.timeline,
          notes: "End with clear milestones and next steps. Strong call to action."
        }
      ]
    };
  }
}
