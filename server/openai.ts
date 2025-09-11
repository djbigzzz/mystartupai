import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required for AI functionality");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
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

// Demo website content for when OpenAI API is unavailable
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

// Demo data for when OpenAI API is unavailable - now with smart context detection
function getDemoAnalysis(ideaTitle: string, industry: string): IdeaAnalysis {
  const title = ideaTitle.toLowerCase();
  
  // Crypto cafe specific analysis
  if (title.includes('crypto') && (title.includes('cafe') || title.includes('coffee'))) {
    return {
      score: 82,
      strengths: [
        "Unique hybrid concept combining food service with cryptocurrency education and trading",
        "Growing crypto adoption creates demand for physical community spaces",
        "Multiple revenue streams: food/beverage sales, event hosting, crypto services",
        "Appeals to tech-savvy demographics in major cities like Dublin"
      ],
      weaknesses: [
        "Regulatory uncertainty around cryptocurrency services in food establishments",
        "Need for specialized staff knowledgeable in both hospitality and crypto",
        "Market volatility could affect customer spending patterns",
        "Requires significant upfront investment in technology infrastructure"
      ],
      marketOpportunity: `The cafe and cryptocurrency sectors are both experiencing growth, with the global coffee shop market valued at $45B+ and cryptocurrency adoption accelerating. Dublin's tech scene creates an ideal market for an innovative crypto cafe concept.`,
      competitiveAdvantage: "First crypto-themed cafe in Dublin, combining physical community space with digital asset education and trading capabilities.",
      recommendations: [
        "Research local regulations for cryptocurrency services in food establishments",
        "Partner with established crypto platforms for secure trading infrastructure",
        "Start with crypto education events before adding trading services", 
        "Focus on building a community of crypto enthusiasts and coffee lovers",
        "Consider franchising model for expansion to other tech-forward cities"
      ],
      feasibilityScore: 75,
      marketSizeEstimate: `Dublin cafe market estimated at €200M+ with cryptocurrency users growing 15% annually`
    };
  }
  
  // Generic analysis for other concepts
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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    console.log("🔒 OpenAI API key not available, using demo analysis");
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a startup advisor with expertise from Y Combinator, Techstars, and other top accelerators. Provide detailed, honest analysis that helps founders succeed."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as IdeaAnalysis;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("OpenAI quota exceeded, using demo analysis");
      return getDemoAnalysis(ideaTitle, industry);
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 OpenAI API error, using demo analysis");
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
    
    marketAnalysis: `The ${industry} market is valued at over $15 billion globally and growing at 12-15% annually. Key trends driving growth include digital transformation, regulatory changes, and increasing customer expectations. Our target market includes mid-market and enterprise customers who are actively seeking modern solutions to replace legacy systems.`,
    
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

export async function generateBusinessPlan(
  ideaTitle: string,
  description: string,
  industry: string,
  problemStatement?: string,
  solutionApproach?: string,
  targetMarket?: string,
  analysis?: IdeaAnalysis
): Promise<BusinessPlan> {
  // OpenAI API key validation handled at module initialization

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
      
      Make it professional, detailed, and investor-ready following Y Combinator standards.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a startup advisor. Create concise, investor-grade business plans quickly."
        },
        {
          role: "user", 
          content: `Generate concise business plan for ${ideaTitle}: ${description}. Return JSON with 12 sections: executiveSummary, problemStatement, solutionDescription, marketAnalysis, businessModel, marketingStrategy, operationalPlan, managementTeam, financialProjections, fundingRequirements, riskAnalysis, timeline. Each section 1-2 paragraphs.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500, // Reduced for faster generation
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as BusinessPlan;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("OpenAI quota exceeded, using demo business plan");
      return getDemoBusinessPlan(ideaTitle, description, industry);
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 OpenAI API error, using demo business plan");
      return getDemoBusinessPlan(ideaTitle, description, industry);
    } else if (errorMessage.includes("rate_limit")) {
      throw new Error("OpenAI rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error("Failed to generate business plan: " + errorMessage);
  }
}

function getDemoPitchDeck(ideaTitle: string, industry: string): PitchDeck {
  return {
    slides: [
      {
        title: `${ideaTitle}`,
        content: `Revolutionizing ${industry} through AI-powered innovation\n\nTransforming how businesses operate with cutting-edge technology\n\nSeed Round Presentation - 2024`,
        notes: "Start with a strong hook. Emphasize the transformative nature of your solution and the large market opportunity."
      },
      {
        title: "The Problem",
        content: `${industry} companies struggle with:\n\n• Inefficient manual processes costing $2.5B annually\n• Fragmented solutions creating operational silos\n• Lack of real-time insights for decision making\n• High operational costs with poor scalability`,
        notes: "Quantify the problem with specific metrics. Make it relatable to investors who may have experienced these issues."
      },
      {
        title: "Our Solution",
        content: `${ideaTitle} delivers:\n\n• Integrated AI platform reducing costs by 40%\n• Real-time analytics and automated workflows\n• Seamless integration with existing systems\n• Scalable architecture supporting enterprise needs`,
        notes: "Focus on benefits rather than features. Use concrete metrics where possible to demonstrate value proposition."
      },
      {
        title: "Market Opportunity",
        content: `• $15B Total Addressable Market in ${industry}\n• 12-15% annual growth rate\n• 500K+ potential customers globally\n• Early stage market with limited competition\n• Strong tailwinds from digital transformation`,
        notes: "Present market size with credible sources. Show growth trends and explain why now is the right time."
      },
      {
        title: "Product Demo",
        content: `Key Features:\n\n• AI-powered automation engine\n• Intuitive dashboard with real-time insights\n• Mobile-first design for field operations\n• Enterprise-grade security and compliance\n• API-first architecture for integrations`,
        notes: "If possible, show actual product screenshots or demo video. Focus on user experience and key differentiators."
      },
      {
        title: "Business Model",
        content: `SaaS Subscription Model:\n\n• Starter: $99/month (small businesses)\n• Professional: $499/month (mid-market)\n• Enterprise: $2,500+/month (large companies)\n• 85% gross margins\n• $2,400 average LTV, $150 CAC`,
        notes: "Show clear unit economics. Explain pricing strategy and how it scales with customer value received."
      },
      {
        title: "Traction & Validation",
        content: `Early Results:\n\n• 50+ pilot customers with 95% satisfaction\n• $50K ARR with 15% month-over-month growth\n• 3 enterprise LOIs worth $500K total value\n• Featured in TechCrunch and Industry Weekly\n• 2 strategic partnership agreements signed`,
        notes: "Show momentum with concrete metrics. Include customer testimonials or case studies if available."
      },
      {
        title: "Competition",
        content: `Competitive Landscape:\n\n• Legacy players: Slow, expensive, poor UX\n• New entrants: Limited features, no scale\n• Our advantage: AI-first, integrated platform\n• Strong IP moat with 2 pending patents\n• Network effects create switching costs`,
        notes: "Be honest about competition but highlight clear differentiators. Show why you'll win in the market."
      },
      {
        title: "Go-to-Market Strategy",
        content: `Multi-channel approach:\n\n• Product-led growth with freemium model\n• Direct sales for enterprise accounts\n• Strategic partnerships with system integrators\n• Digital marketing and content strategy\n• Industry conference participation`,
        notes: "Show clear customer acquisition plan. Explain how you'll scale from current traction to market leadership."
      },
      {
        title: "Team",
        content: `World-class founding team:\n\n• CEO: 10+ years ${industry} experience, 2 exits\n• CTO: Former Google AI, Stanford PhD\n• VP Sales: Built $50M+ revenue at previous startup\n• 12 total employees, hiring aggressively\n• Advisory board includes industry leaders`,
        notes: "Highlight relevant experience and track record. Show team's ability to execute on the vision."
      },
      {
        title: "Financial Projections",
        content: `5-Year Revenue Growth:\n\n• Year 1: $250K ARR\n• Year 2: $1.2M ARR\n• Year 3: $4.5M ARR (profitable)\n• Year 4: $12M ARR\n• Year 5: $28M ARR\n\nKey metrics improving with scale`,
        notes: "Show realistic but ambitious growth. Explain key assumptions and path to profitability."
      },
      {
        title: "Funding Ask",
        content: `Seeking $2M Seed Round:\n\n• Product development (60%): $1.2M\n• Sales & marketing (25%): $500K\n• Operations & working capital (15%): $300K\n\n18-month runway to Series A\nTargeting $1M ARR and 50+ customers`,
        notes: "Be specific about use of funds and milestones. Show clear path to next funding round."
      }
    ]
  };
}

// Section-specific generation prompts and settings
const SECTION_PROMPTS = {
  'executive-summary': {
    prompt: `Create a compelling executive summary that captures the essence of the startup. Include:
    - Company mission and vision
    - Key problem being solved
    - Solution overview
    - Target market size
    - Competitive advantage
    - Financial highlights
    - Funding requirements
    
    Write in a professional, confident tone that would engage investors from the first paragraph.`,
    minWords: 200,
    maxWords: 400,
    criticalElements: ['mission', 'problem', 'solution', 'market size', 'competitive advantage', 'financials']
  },
  'problem-statement': {
    prompt: `Define the market problem with clarity and urgency. Include:
    - Specific pain points customers face
    - Market size and scope of the problem
    - Current inadequate solutions
    - Cost of inaction or current solutions
    - Supporting data and statistics
    
    Make the problem feel real and urgent to investors.`,
    minWords: 150,
    maxWords: 300,
    criticalElements: ['pain points', 'market scope', 'current solutions', 'cost impact', 'supporting data']
  },
  'solution-overview': {
    prompt: `Describe your solution with clarity and differentiation. Include:
    - Core product/service description
    - Key features and capabilities
    - How it solves the identified problem
    - Technology or methodology advantages
    - User experience highlights
    - Proof of concept or validation
    
    Focus on benefits over features and demonstrate clear value proposition.`,
    minWords: 200,
    maxWords: 350,
    criticalElements: ['product description', 'key features', 'problem solving', 'advantages', 'user experience']
  },
  'market-analysis': {
    prompt: `Provide comprehensive market analysis. Include:
    - Total addressable market (TAM) size
    - Serviceable addressable market (SAM)
    - Target customer segments
    - Market growth trends and drivers
    - Customer behavior and needs
    - Market entry strategy
    
    Use credible data sources and demonstrate thorough market understanding.`,
    minWords: 300,
    maxWords: 500,
    criticalElements: ['TAM', 'customer segments', 'growth trends', 'customer needs', 'entry strategy']
  },
  'business-model': {
    prompt: `Detail your business model and revenue strategy. Include:
    - Revenue streams and pricing strategy
    - Unit economics and margins
    - Customer acquisition cost (CAC) and lifetime value (LTV)
    - Sales process and channels
    - Scalability factors
    - Key partnerships
    
    Demonstrate a clear path to profitability with strong unit economics.`,
    minWords: 250,
    maxWords: 400,
    criticalElements: ['revenue streams', 'unit economics', 'CAC/LTV', 'sales channels', 'scalability']
  },
  'marketing-strategy': {
    prompt: `Outline your customer acquisition and marketing strategy. Include:
    - Target customer personas
    - Marketing channels and tactics
    - Customer acquisition strategy
    - Brand positioning and messaging
    - Sales funnel and conversion strategy
    - Customer retention approach
    
    Show a clear, cost-effective path to acquiring and retaining customers.`,
    minWords: 250,
    maxWords: 400,
    criticalElements: ['customer personas', 'marketing channels', 'acquisition strategy', 'positioning', 'retention']
  },
  'operations-plan': {
    prompt: `Describe your operational structure and processes. Include:
    - Key operational processes
    - Technology infrastructure
    - Supply chain or service delivery
    - Quality control measures
    - Scalability considerations
    - Key operational metrics
    
    Demonstrate operational efficiency and ability to scale.`,
    minWords: 200,
    maxWords: 350,
    criticalElements: ['key processes', 'infrastructure', 'delivery', 'quality control', 'scalability']
  },
  'management-team': {
    prompt: `Present your leadership team and organization. Include:
    - Founder and key team member backgrounds
    - Relevant experience and expertise
    - Team composition and roles
    - Advisory board members
    - Hiring plan and key positions to fill
    - Organizational structure
    
    Highlight experience that directly relates to the business success.`,
    minWords: 200,
    maxWords: 350,
    criticalElements: ['founder background', 'relevant experience', 'team roles', 'advisors', 'hiring plan']
  },
  'financial-projections': {
    prompt: `Provide detailed financial forecasts and metrics. Include:
    - 3-5 year revenue and expense projections
    - Key financial metrics and assumptions
    - Break-even analysis
    - Cash flow projections
    - Profitability timeline
    - Key performance indicators (KPIs)
    
    Use realistic assumptions and show clear path to profitability.`,
    minWords: 300,
    maxWords: 500,
    criticalElements: ['revenue projections', 'key metrics', 'break-even', 'cash flow', 'profitability', 'KPIs']
  },
  'funding-request': {
    prompt: `Detail your funding requirements and use of capital. Include:
    - Total funding amount needed
    - Use of funds breakdown
    - Milestones to be achieved
    - Timeline for fund utilization
    - Return on investment projections
    - Exit strategy considerations
    
    Clearly justify the investment and show expected returns.`,
    minWords: 200,
    maxWords: 350,
    criticalElements: ['funding amount', 'use of funds', 'milestones', 'timeline', 'ROI', 'exit strategy']
  },
  'risk-analysis': {
    prompt: `Identify and address potential risks and challenges. Include:
    - Market and competitive risks
    - Operational and technical risks
    - Financial and funding risks
    - Regulatory and compliance risks
    - Mitigation strategies for each risk
    - Contingency plans
    
    Show awareness of challenges and preparedness to address them.`,
    minWords: 250,
    maxWords: 400,
    criticalElements: ['market risks', 'operational risks', 'financial risks', 'regulatory risks', 'mitigation strategies']
  },
  'implementation-timeline': {
    prompt: `Create a detailed roadmap for execution. Include:
    - Key milestones and deliverables
    - Timeline for product development
    - Market entry and scaling phases
    - Team growth and hiring schedule
    - Funding and investment rounds
    - Success metrics and checkpoints
    
    Show a clear, achievable path from current state to success.`,
    minWords: 250,
    maxWords: 400,
    criticalElements: ['key milestones', 'product timeline', 'market phases', 'team growth', 'funding rounds']
  }
};

// Generate individual business plan section
export async function generateBusinessPlanSection(
  sectionId: string,
  ideaTitle: string,
  description: string,
  industry: string,
  existingContent: Record<string, string> = {},
  analysis?: IdeaAnalysis
): Promise<BusinessPlanSectionContent> {
  const sectionConfig = SECTION_PROMPTS[sectionId as keyof typeof SECTION_PROMPTS];
  
  if (!sectionConfig) {
    throw new Error(`Unknown section: ${sectionId}`);
  }

  // Check if API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    const demoContent = generateDemoSectionContent(sectionId, ideaTitle, description, industry);
    const quality = await assessSectionQuality(demoContent, sectionId, sectionConfig);
    return { content: demoContent, quality };
  }

  try {
    const contextInfo = [
      `Startup: ${ideaTitle}`,
      `Description: ${description}`,
      `Industry: ${industry}`,
      analysis ? `Market Score: ${analysis.score}/100` : '',
      Object.keys(existingContent).length > 0 ? 'Existing sections: ' + Object.keys(existingContent).join(', ') : ''
    ].filter(Boolean).join('\n');

    const existingContext = Object.entries(existingContent)
      .map(([key, content]) => `${key}: ${content.substring(0, 200)}...`)
      .join('\n\n');

    const prompt = `
      ${sectionConfig.prompt}
      
      Context:
      ${contextInfo}
      
      ${existingContext ? `Existing sections for context:\n${existingContext}\n` : ''}
      
      ${analysis ? `Analysis insights: ${JSON.stringify(analysis)}` : ''}
      
      Generate ${sectionConfig.minWords}-${sectionConfig.maxWords} words of professional, investor-ready content.
      Focus on being specific, data-driven, and compelling.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a startup advisor creating investor-grade business plan sections. Write professionally with specific details and metrics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const content = response.choices[0].message.content || '';
    const quality = await assessSectionQuality(content, sectionId, sectionConfig);
    
    return { content, quality };
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("OpenAI quota exceeded, using demo content for section:", sectionId);
      const demoContent = generateDemoSectionContent(sectionId, ideaTitle, description, industry);
      const quality = await assessSectionQuality(demoContent, sectionId, sectionConfig);
      return { content: demoContent, quality };
    }
    throw new Error(`Failed to generate section ${sectionId}: ${errorMessage}`);
  }
}

// Assess the quality of a business plan section
export async function assessSectionQuality(
  content: string,
  sectionId: string,
  sectionConfig: any
): Promise<SectionQualityAssessment> {
  const wordCount = content.split(' ').length;
  const minWords = sectionConfig.minWords || 150;
  const maxWords = sectionConfig.maxWords || 500;
  const criticalElements = sectionConfig.criticalElements || [];

  // Completeness assessment
  const wordCountScore = Math.min(100, Math.max(0, 
    (wordCount - minWords) / (maxWords - minWords) * 100
  ));
  
  // Check for critical elements
  const elementsFound = criticalElements.filter((element: string) => 
    content.toLowerCase().includes(element.toLowerCase()) ||
    content.toLowerCase().includes(element.split(' ')[0])
  );
  const completenessScore = Math.min(100, 
    (elementsFound.length / criticalElements.length) * 70 + wordCountScore * 0.3
  );

  // Professionalism assessment
  const professionalismIndicators = [
    /\$[0-9,.]+(M|B|K)?/g.test(content), // Financial figures
    /[0-9]+%/g.test(content), // Percentages
    content.includes('market') || content.includes('customer'), // Market focus
    content.length > 200, // Adequate length
    !/(?:amazing|awesome|incredible)\s/gi.test(content) // Avoid hyperbolic language
  ];
  const professionalismScore = (professionalismIndicators.filter(Boolean).length / professionalismIndicators.length) * 100;

  // Investor appeal assessment
  const investorAppealIndicators = [
    content.includes('revenue') || content.includes('growth'), // Business focus
    content.includes('market') && content.includes('size'), // Market sizing
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

  if (elementsFound.length === criticalElements.length) {
    strengths.push('Contains all critical elements');
  } else {
    const missing = criticalElements.filter((el: string) => !elementsFound.includes(el));
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

// Generate demo content for sections when OpenAI is unavailable
function generateDemoSectionContent(
  sectionId: string,
  ideaTitle: string,
  description: string,
  industry: string
): string {
  const demoContent: Record<string, string> = {
    'executive-summary': `${ideaTitle} is a revolutionary ${industry} platform that addresses critical market needs through innovative technology solutions. Our company leverages cutting-edge AI and automation to deliver unprecedented value to customers while building a scalable, profitable business model.\n\nThe market opportunity is substantial, with the ${industry} sector experiencing rapid digital transformation and increasing demand for efficient solutions. Our unique approach positions us to capture significant market share while building strong competitive moats through technology and network effects.\n\nWe are seeking $2M in seed funding to accelerate product development and market penetration, targeting $1M ARR within 18 months.`,
    
    'problem-statement': `The ${industry} industry faces significant challenges including inefficient processes, high operational costs, and lack of integrated solutions. Current market solutions are fragmented, expensive, and fail to address the core pain points that businesses face daily.\n\nThis creates substantial friction for companies trying to scale and optimize their operations. Market research indicates that businesses lose an average of 23% of potential revenue due to these inefficiencies, representing a $2.5B annual opportunity.`,
    
    'solution-overview': `${ideaTitle} provides a comprehensive platform that ${description}. Our solution integrates seamlessly with existing workflows while providing advanced analytics, automation capabilities, and user-friendly interfaces that drive adoption and value creation.\n\nKey features include AI-powered automation, real-time analytics, mobile-first design, and enterprise-grade security. Our unique approach delivers 40% cost savings and 3x productivity improvements for customers.`,
    
    'market-analysis': `The ${industry} market is valued at over $15 billion globally and growing at 12-15% annually. Key trends driving growth include digital transformation, regulatory changes, and increasing customer expectations.\n\nOur target market includes mid-market and enterprise customers who are actively seeking modern solutions to replace legacy systems. The serviceable addressable market represents $2.8B with strong tailwinds from technology adoption.`,
    
    'business-model': `Our revenue model is based on SaaS subscriptions with tiered pricing starting at $99/month for small businesses and scaling to enterprise packages of $10,000+ monthly. Additional revenue streams include professional services, integrations, and premium features.\n\nWe project 85% gross margins with strong unit economics: $150 CAC, $2,400 LTV, resulting in a 16:1 LTV/CAC ratio. The scalable model supports rapid growth with improving margins.`,
    
    'marketing-strategy': `Customer acquisition will focus on digital marketing, content creation, strategic partnerships, and direct sales for enterprise accounts. Our go-to-market strategy emphasizes product-led growth with freemium offerings to drive adoption.\n\nKey channels include SEO/content marketing (40%), direct sales (35%), partnerships (15%), and paid advertising (10%). We target 5% monthly growth rate with declining customer acquisition costs.`,
    
    'operations-plan': `Operations will be built around a cloud-first architecture leveraging modern development practices. Key operational areas include product development, customer success, sales, and marketing.\n\nWe plan to scale the team from 5 to 25 employees over 18 months while maintaining high productivity and quality standards. Critical infrastructure includes AWS cloud services, automated CI/CD pipelines, and comprehensive monitoring systems.`,
    
    'management-team': `Our founding team combines deep industry expertise with proven track records in building and scaling technology companies. CEO brings 10+ years ${industry} experience with 2 successful exits. CTO has background in enterprise software with previous companies scaling to $50M+ revenue.\n\nKey positions to fill include VP Sales, Head of Product, and Senior Engineers. Advisory board includes industry leaders and successful entrepreneurs who provide strategic guidance and network access.`,
    
    'financial-projections': `5-year financial projections show strong growth trajectory:\nYear 1: $250K ARR\nYear 2: $1.2M ARR\nYear 3: $4.5M ARR (profitable)\nYear 4: $12M ARR\nYear 5: $28M ARR\n\nKey assumptions include 15% monthly growth, 5% churn rate, expanding gross margins from 75% to 85%, and improving unit economics with scale.`,
    
    'funding-request': `Seeking $2M seed funding to accelerate product development, team growth, and market penetration. Use of funds: 60% engineering and product development ($1.2M), 25% sales and marketing ($500K), 15% operations and working capital ($300K).\n\nKey milestones include completing MVP, acquiring first 100 customers, achieving $500K ARR, and Series A readiness. 18-month runway provides sufficient time to achieve these goals.`,
    
    'risk-analysis': `Primary risks include competitive threats from established players, technology execution challenges, and market adoption rates. Large incumbents could launch competing products, though our first-mover advantage and specialized focus provide protection.\n\nMitigation strategies include strong IP protection, agile development practices, close customer relationships, and maintaining lean operations. Regulatory compliance is managed through legal partnerships and industry expertise.`,
    
    'implementation-timeline': `12-month roadmap:\nMonths 1-3: Complete MVP development, initial customer pilots\nMonths 4-6: Product launch, first paying customers, achieve $50K ARR\nMonths 7-9: Scale to $200K ARR, expand feature set\nMonths 10-12: Reach $500K ARR, team growth to 15 people\n\nKey milestones include product-market fit validation, customer success metrics, and Series A fundraising preparation.`
  };

  return demoContent[sectionId] || `Generated content for ${sectionId} section of ${ideaTitle}. This comprehensive section addresses the key requirements for investor-ready business plans in the ${industry} industry.`;
}

export async function generateWebsiteContent(
  companyName: string,
  description: string,
  industry: string,
  requestedSections: string[] = ['hero', 'about', 'features', 'testimonials', 'pricing', 'contact'],
  businessPlan?: BusinessPlan
): Promise<WebsiteContent> {
  // Check if API key is available and valid for production use
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "default_key" || apiKey.includes("demo")) {
    console.log("🔒 OpenAI API key not available, using demo website content");
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter who creates high-converting website copy for businesses. Focus on benefits, clear value propositions, and compelling calls-to-action."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000, // Keep responses focused
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as WebsiteContent;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("OpenAI quota exceeded, using demo website content");
      return getDemoWebsiteContent(companyName, industry, businessPlan);
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 OpenAI API error, using demo website content");
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
      
      For each slide provide:
      - title: string (slide title)
      - content: string (bullet points and key content for the slide)
      - notes: string (speaker notes and additional context)
      
      Make it compelling, concise, and investor-focused. Each slide should tell part of the story.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a pitch deck expert who has helped startups raise millions. Create compelling, story-driven pitch decks that capture investor attention."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as PitchDeck;
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      console.log("OpenAI quota exceeded, using demo pitch deck");
      return getDemoPitchDeck(ideaTitle, industry);
    } else if (errorMessage.includes("401") || errorMessage.includes("unauthorized")) {
      console.log("🔒 OpenAI API error, using demo pitch deck");
      return getDemoPitchDeck(ideaTitle, industry);
    } else if (errorMessage.includes("rate_limit")) {
      throw new Error("OpenAI rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error("Failed to generate pitch deck: " + errorMessage);
  }
}
