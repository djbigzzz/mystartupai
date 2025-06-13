import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
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

export interface PitchDeck {
  slides: {
    title: string;
    content: string;
    notes: string;
  }[];
}

export async function analyzeStartupIdea(
  ideaTitle: string,
  description: string,
  industry: string,
  stage: string
): Promise<IdeaAnalysis> {
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
    throw new Error("Failed to analyze startup idea: " + (error as Error).message);
  }
}

export async function generateBusinessPlan(
  ideaTitle: string,
  description: string,
  industry: string,
  stage: string,
  analysis: IdeaAnalysis
): Promise<BusinessPlan> {
  try {
    const prompt = `
      Generate a comprehensive business plan for this startup idea. Use the analysis provided to create a detailed, investor-ready business plan.
      
      Startup Idea: ${ideaTitle}
      Description: ${description}
      Industry: ${industry}
      Stage: ${stage}
      
      Analysis insights: ${JSON.stringify(analysis)}
      
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
          content: "You are an expert business plan writer who has helped hundreds of startups raise funding. Create detailed, professional business plans that investors love."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as BusinessPlan;
  } catch (error) {
    throw new Error("Failed to generate business plan: " + (error as Error).message);
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
    throw new Error("Failed to generate pitch deck: " + (error as Error).message);
  }
}
