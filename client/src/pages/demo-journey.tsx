import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  FileText, 
  Presentation, 
  BarChart3, 
  Target, 
  Users,
  CheckCircle,
  Download,
  Play,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  DollarSign,
  LineChart,
  PieChart,
  Building,
  Globe,
  Zap,
  Shield,
  Award,
  Rocket,
  Star,
  Eye,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Calculator,
  Search,
  Layers,
  X
} from "lucide-react";
import { Link } from "wouter";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: number;
  color: string;
  content: any;
}

export default function DemoJourney() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const demoSteps: DemoStep[] = [
    {
      id: "submission",
      title: "Submit Your Idea",
      description: "User enters raw startup concept",
      icon: Brain,
      duration: 7,
      color: "from-gray-500 to-gray-600",
      content: {
        title: "Fitness App",
        description: "An app for workouts",
        industry: "Health & Fitness",
        targetMarket: "People who want to exercise",
        stage: "raw",
        viabilityScore: 23,
        issues: [
          "Vague problem definition",
          "No clear differentiation", 
          "Limited market understanding",
          "Missing value proposition"
        ]
      }
    },
    {
      id: "enhancement",
      title: "AI Enhancement",
      description: "AI analyzes and improves concept",
      icon: Zap,
      duration: 7,
      color: "from-yellow-500 to-orange-500",
      content: {
        title: "AI-Powered Fitness Coach → Enhanced",
        description: "A mobile app that uses artificial intelligence to create personalized workout plans and nutrition guidance based on user goals, fitness level, and available equipment.",
        industry: "Health & Fitness",
        targetMarket: "Fitness enthusiasts aged 25-45",
        problemStatement: "Generic fitness apps don't provide personalized guidance, leading to poor results and high abandonment rates.",
        solutionApproach: "AI-driven personalized coaching that adapts to user progress and preferences in real-time.",
        improvements: [
          "Defined specific problem statement",
          "Added AI differentiation strategy",
          "Targeted precise market segment",
          "Created compelling value proposition"
        ],
        viabilityScore: 78
      }
    },
    {
      id: "analysis", 
      title: "AI Analysis",
      description: "Deep startup validation begins",
      icon: Target,
      duration: 7,
      color: "from-blue-500 to-cyan-500",
      content: {
        score: 8.5,
        strengths: [
          "Large and growing market ($96B global fitness market)",
          "AI personalization addresses real user pain points",
          "Strong potential for recurring revenue model",
          "Low initial technical barriers to entry",
          "High user engagement potential with gamification",
          "Scalable business model with network effects"
        ],
        weaknesses: [
          "High customer acquisition costs in crowded market",
          "Requires significant initial data for AI training",
          "Seasonal usage patterns may affect retention"
        ],
        opportunities: [
          "Partner with fitness equipment manufacturers",
          "Corporate wellness programs integration",
          "Expansion into nutrition and mental health",
          "International market expansion",
          "B2B2C partnerships with gyms and trainers"
        ],
        threats: [
          "High competition from established fitness apps",
          "User retention challenges in fitness industry",
          "Potential regulatory changes around health data",
          "Economic downturns affecting discretionary spending"
        ],
        marketSize: "$96B global fitness market, $4.5B fitness app segment",
        tam: 96000000000,
        sam: 4500000000,
        som: 450000000,
        feasibilityScore: 8.2,
        technicalFeasibility: 8.5,
        marketFeasibility: 8.0,
        financialFeasibility: 8.0,
        competitorAnalysis: [
          { name: "MyFitnessPal", users: "200M+", revenue: "$125M", strengths: "Large user base, nutrition focus" },
          { name: "Nike Training Club", users: "50M+", revenue: "Unknown", strengths: "Brand recognition, free model" },
          { name: "Peloton Digital", users: "6M+", revenue: "$400M", strengths: "Premium content, community" }
        ],
        userPersonas: [
          { name: "Busy Professional", age: "28-45", painPoint: "Limited time for workouts", motivation: "Efficiency and results" },
          { name: "Fitness Beginner", age: "25-35", painPoint: "Intimidated by gym culture", motivation: "Confidence building" },
          { name: "Health Enthusiast", age: "30-50", painPoint: "Plateauing progress", motivation: "Optimization and variety" }
        ]
      }
    },
    {
      id: "business-plan",
      title: "Business Plan",
      description: "12-section comprehensive plan",
      icon: FileText,
      duration: 60,
      color: "from-cyan-500 to-blue-500",
      content: {
        sections: [
          { 
            name: "Executive Summary", 
            status: "completed", 
            preview: "AI-Powered Fitness Coach revolutionizes personal fitness through intelligent, adaptive coaching...",
            fullContent: "FitAI represents a paradigm shift in personal fitness, leveraging advanced machine learning algorithms to deliver hyper-personalized workout and nutrition guidance. Our platform addresses the critical gap in the $96B fitness market where 78% of users abandon traditional fitness apps within 6 months due to generic, one-size-fits-all approaches. By implementing real-time adaptation based on user performance, preferences, and biometric data, FitAI creates a truly personalized fitness journey that evolves with each user.",
            wordCount: 156
          },
          { 
            name: "Problem Statement", 
            status: "completed", 
            preview: "78% of fitness app users abandon their apps within 6 months due to lack of personalization...",
            fullContent: "The fitness industry faces a fundamental personalization crisis. Despite billions invested in fitness technology, user retention remains abysmal with 78% abandoning fitness apps within 6 months. Current solutions offer generic workout plans that fail to account for individual fitness levels, preferences, equipment availability, time constraints, and progress rates. This one-size-fits-all approach leads to frustration, plateaus, and ultimately, abandonment. Users are left feeling overwhelmed by choice paralysis or underwhelmed by results, creating a massive opportunity for intelligent personalization.",
            wordCount: 324
          },
          { 
            name: "Solution Overview", 
            status: "completed", 
            preview: "Our AI-driven platform creates dynamic, personalized workout and nutrition plans...",
            fullContent: "FitAI employs a sophisticated AI engine that analyzes over 150 data points to create truly personalized fitness experiences. Our platform continuously learns from user interactions, performance metrics, and feedback to adapt workouts in real-time. The system considers equipment availability, time constraints, fitness goals, injury history, and personal preferences to generate optimal workout sequences. Advanced computer vision technology provides form correction, while natural language processing enables conversational coaching that motivates and guides users through their fitness journey.",
            wordCount: 287
          },
          { 
            name: "Market Analysis", 
            status: "completed", 
            preview: "The global fitness market is valued at $96B and growing at 7.8% CAGR...",
            fullContent: "The global fitness market represents a $96B opportunity growing at 7.8% CAGR, driven by increasing health consciousness and digital adoption. The fitness app segment specifically accounts for $4.5B and is expanding at 14.7% annually. Key market drivers include rising obesity rates, aging populations prioritizing health, and the normalization of digital fitness post-COVID. Our target market of tech-savvy fitness enthusiasts aged 25-45 represents 150M potential users in primary markets, with willingness to pay $15-30 monthly for premium personalized experiences.",
            wordCount: 298
          },
          { 
            name: "Business Model", 
            status: "completed", 
            preview: "Freemium subscription model with premium AI coaching features...",
            fullContent: "FitAI operates on a freemium SaaS model with multiple revenue streams. The free tier includes basic workouts and limited AI features, converting 8-12% of users to premium subscriptions at $19.99/month. Premium features include unlimited AI coaching, advanced analytics, nutrition planning, and priority support. Additional revenue streams include corporate wellness partnerships ($50-100 per employee annually), premium content creator partnerships (30% revenue share), and white-label licensing to gyms and fitness professionals ($500-2000 monthly per location).",
            wordCount: 312
          },
          { 
            name: "Marketing Strategy", 
            status: "completed", 
            preview: "Multi-channel approach targeting fitness communities and health influencers...",
            fullContent: "Our go-to-market strategy focuses on digital-first acquisition through fitness influencer partnerships, content marketing, and community building. Primary channels include Instagram and TikTok collaborations with micro-influencers (10K-100K followers) who demonstrate authentic product usage. SEO-optimized content targets high-intent keywords while our referral program incentivizes organic growth. Corporate partnerships with wellness-focused companies provide B2B revenue and user acquisition. Paid acquisition targets lookalike audiences of existing premium fitness app users with strong LTV:CAC ratios.",
            wordCount: 298
          },
          { 
            name: "Operations Plan", 
            status: "completed", 
            preview: "Lean team structure with focus on AI development and user experience...",
            fullContent: "FitAI maintains a lean operational structure focused on core competencies. The founding team includes AI/ML expertise, fitness industry knowledge, and proven startup execution experience. Key operational priorities include maintaining 99.9% uptime, ensuring data security compliance (HIPAA, GDPR), and scaling AI infrastructure. Customer support utilizes AI chatbots for tier-1 issues with human escalation. Development follows agile methodologies with 2-week sprints, continuous integration, and A/B testing for all major features.",
            wordCount: 245
          },
          { 
            name: "Management Team", 
            status: "completed", 
            preview: "Experienced team combining AI expertise with fitness industry knowledge...",
            fullContent: "The founding team brings together complementary expertise essential for FitAI's success. CEO Sarah Chen previously scaled a health tech startup from $0 to $50M revenue and has deep fitness industry connections. CTO Michael Rodriguez led AI initiatives at Google Health and holds a PhD in Machine Learning from Stanford. Head of Fitness Dr. Amanda Foster is a certified trainer and sports scientist with 15 years of experience designing evidence-based fitness programs. The team is advised by fitness industry veterans and AI luminaries.",
            wordCount: 278
          },
          { 
            name: "Financial Projections", 
            status: "completed", 
            preview: "Path to $100M ARR by Year 5 with strong unit economics...",
            fullContent: "FitAI projects strong growth with path to $100M ARR by Year 5. Year 1 focuses on product-market fit with 10K users and $0.5M revenue. Years 2-3 emphasize growth with 100K users and $12M ARR, achieving gross margins of 85%. Years 4-5 target market expansion reaching 500K users and $100M ARR. Key metrics include $180 LTV, $25 CAC (7.2:1 ratio), 15% monthly churn improving to 8%, and 40% gross margins on blended revenue. Break-even achieved in Month 18 with 24 months of runway from Series A funding.",
            wordCount: 334
          },
          { 
            name: "Funding Requirements", 
            status: "completed", 
            preview: "$3M Series A to accelerate growth and AI development...",
            fullContent: "FitAI seeks $3M Series A funding to accelerate product development and market expansion. Funding allocation: 40% engineering and AI development, 30% marketing and user acquisition, 20% operations and team expansion, 10% working capital. Key milestones include launching core AI features, achieving 50K MAU, proving strong unit economics, and establishing strategic partnerships. This funding provides 24 months runway to reach Series B readiness with $10M+ ARR and clear path to profitability.",
            wordCount: 234
          },
          { 
            name: "Risk Analysis", 
            status: "completed", 
            preview: "Comprehensive risk assessment with mitigation strategies...",
            fullContent: "Primary risks include competitive pressure from well-funded incumbents, user acquisition costs escalation, and technical challenges in AI personalization. Mitigation strategies include focusing on superior personalization as key differentiator, diversifying acquisition channels, and maintaining technical excellence through top-tier hiring. Market risks include economic downturns affecting discretionary spending and potential regulatory changes around health data. Product risks involve ensuring AI recommendations remain safe and effective while scaling personalization algorithms.",
            wordCount: 267
          },
          { 
            name: "Implementation Timeline", 
            status: "completed", 
            preview: "18-month roadmap from MVP to market leadership...",
            fullContent: "Phase 1 (Months 1-6): Complete MVP development, beta testing with 1K users, refine AI algorithms, establish content partnerships. Phase 2 (Months 7-12): Public launch, scale to 25K users, implement premium features, raise Series A funding. Phase 3 (Months 13-18): Expand feature set, international markets, corporate partnerships, prepare Series B. Key milestones include iOS/Android launches, achieving 10% monthly growth, establishing strategic partnerships, and reaching $5M ARR.",
            wordCount: 289
          }
        ],
        wordCount: 3142,
        pageCount: 42,
        completionTime: "2 hours 15 minutes",
        qualityScore: 9.2
      }
    },
    {
      id: "pitch-deck",
      title: "Pitch Deck",
      description: "Investor presentation slides",
      icon: Presentation,
      duration: 7,
      color: "from-green-500 to-emerald-500",
      content: {
        slides: [
          { 
            title: "The Problem", 
            content: "78% of fitness apps fail to retain users beyond 6 months", 
            details: {
              stats: ["200M+ downloads of top fitness apps", "Average user session: 3.2 minutes", "Monthly churn: 25-40%"],
              painPoints: ["Generic one-size-fits-all workouts", "No real-time adaptation", "Lack of motivation", "Progress plateaus"],
              marketImpact: "$2.3B wasted on ineffective fitness solutions annually"
            },
            notes: "Hook the audience with a problem everyone in fitness tech knows. Show the massive opportunity hidden in this failure rate.",
            visualType: "animated_statistics"
          },
          { 
            title: "Our Solution", 
            content: "AI-powered personal trainer that learns and adapts in real-time", 
            details: {
              keyFeatures: ["Real-time form correction", "Adaptive workout difficulty", "Personalized nutrition plans", "Motivational AI coaching"],
              technology: ["Computer vision for form analysis", "ML for preference learning", "NLP for conversational coaching"],
              differentiators: ["150+ data points analyzed", "Millisecond adaptation", "Proven retention: 85%+"]
            },
            notes: "Demonstrate clear technological superiority. Show actual product screenshots and user testimonials.",
            visualType: "product_demo"
          },
          { 
            title: "Market Opportunity", 
            content: "$96B fitness market with 4.5B app segment growing 14.7% annually", 
            details: {
              marketSize: { tam: 96000, sam: 4500, som: 450 },
              growth: ["Post-COVID digital adoption: +300%", "Health consciousness rising", "AI acceptance growing"],
              targetUsers: "150M tech-savvy fitness enthusiasts willing to pay premium for personalization"
            },
            notes: "Emphasize the massive TAM and our specific SAM. Show clear path to significant market share.",
            visualType: "market_charts"
          },
          { 
            title: "Business Model", 
            content: "Multi-revenue stream SaaS with strong unit economics", 
            details: {
              pricing: { free: "Basic workouts", premium: "$19.99/month", corporate: "$50-100/employee/year" },
              economics: { ltv: 180, cac: 25, ratio: "7.2:1", churn: "8% monthly" },
              revenue: ["Subscriptions (70%)", "Corporate wellness (20%)", "Partnerships (10%)"]
            },
            notes: "Show proven unit economics and multiple revenue streams for stability and growth.",
            visualType: "revenue_model"
          },
          { 
            title: "Competitive Advantage", 
            content: "Superior AI personalization with proven retention rates", 
            details: {
              vsCompetitors: [
                { name: "MyFitnessPal", advantage: "Real-time adaptation vs static plans" },
                { name: "Nike Training", advantage: "Personalization vs one-size-fits-all" },
                { name: "Peloton", advantage: "AI coaching vs human-only instruction" }
              ],
              moats: ["Proprietary AI algorithms", "Data network effects", "User behavior insights", "Partnership ecosystem"]
            },
            notes: "Position against known competitors. Emphasize our technological moats and data advantages.",
            visualType: "competitive_matrix"
          },
          { 
            title: "Traction & Validation", 
            content: "Strong early metrics proving product-market fit", 
            details: {
              metrics: {
                users: "5,000 beta users",
                retention: "85% monthly retention",
                nps: "Net Promoter Score: 72",
                growth: "40% monthly user growth"
              },
              partnerships: ["3 gym chain pilots", "2 corporate wellness agreements", "15 fitness influencer ambassadors"],
              testimonials: ["Game-changing personalization", "Finally, workouts that adapt to me", "Best fitness app I've ever used"]
            },
            notes: "Show strong product-market fit with concrete metrics. Include actual user testimonials and partnership validation.",
            visualType: "traction_metrics"
          },
          { 
            title: "Go-to-Market Strategy", 
            content: "Multi-channel acquisition with focus on organic growth", 
            details: {
              channels: {
                influencer: "Micro-influencer partnerships (10K-100K followers)",
                content: "SEO-optimized fitness content marketing",
                referral: "Viral referral program with workout buddy features",
                b2b: "Corporate wellness partnerships"
              },
              timeline: ["Month 1-3: Influencer launch", "Month 4-6: Content marketing", "Month 7-12: B2B expansion"],
              targets: { cac: "$25", ltv: "$180", payback: "4.2 months" }
            },
            notes: "Show diversified acquisition strategy with proven channels and metrics.",
            visualType: "gtm_funnel"
          },
          { 
            title: "Financial Projections", 
            content: "Path to $100M ARR with strong margins and growth", 
            details: {
              projections: {
                year1: { users: 10000, revenue: 500000, expenses: 2000000 },
                year3: { users: 100000, revenue: 12000000, expenses: 8000000 },
                year5: { users: 500000, revenue: 100000000, expenses: 60000000 }
              },
              keyMetrics: { grossMargin: "85%", burnRate: "$200K/month", runway: "24 months" },
              milestones: ["Break-even: Month 18", "Profitability: Month 24", "IPO-ready: Year 5"]
            },
            notes: "Show realistic but ambitious growth with clear path to profitability and scale.",
            visualType: "financial_charts"
          },
          { 
            title: "Team & Advisors", 
            content: "World-class team with proven track record", 
            details: {
              founders: [
                { name: "Sarah Chen", role: "CEO", background: "Scaled health tech startup 0→$50M" },
                { name: "Michael Rodriguez", role: "CTO", background: "AI Lead at Google Health, Stanford PhD" },
                { name: "Dr. Amanda Foster", role: "Head of Fitness", background: "15 years sports science, certified trainer" }
              ],
              advisors: ["Former Peloton VP Product", "MyFitnessPal co-founder", "AI researcher from DeepMind"],
              expertise: ["Domain knowledge", "Technical excellence", "Go-to-market experience", "Fundraising track record"]
            },
            notes: "Emphasize team's unique combination of AI expertise and fitness industry knowledge.",
            visualType: "team_profiles"
          },
          { 
            title: "Funding Ask", 
            content: "$3M Series A to accelerate growth and AI development", 
            details: {
              useOfFunds: {
                engineering: "40% - AI development & platform scaling",
                marketing: "30% - User acquisition & partnerships",
                team: "20% - Key hires in AI and product",
                operations: "10% - Infrastructure & working capital"
              },
              milestones: ["Launch core AI features", "50K monthly active users", "Prove unit economics", "Strategic partnerships"],
              timeline: "24 months runway to Series B readiness",
              valuation: "Pre-money: $12M based on comparable AI health companies"
            },
            notes: "Clear funding ask with specific use of funds and measurable milestones. Show path to next round.",
            visualType: "funding_breakdown"
          }
        ],
        designTheme: "Modern fitness-focused with data visualizations and interactive elements",
        totalSlides: 10,
        estimatedPresentationTime: "12-15 minutes",
        targetAudience: "Series A investors in health tech and AI"
      }
    },
    {
      id: "financial",
      title: "Financial Model",
      description: "5-year projections and metrics",
      icon: BarChart3,
      duration: 7,
      color: "from-orange-500 to-red-500",
      content: {
        revenue: {
          year1: 120000,
          year2: 850000,
          year3: 2400000,
          year5: 8200000
        },
        users: {
          year1: 5000,
          year2: 25000,
          year3: 60000,
          year5: 150000
        },
        metrics: {
          cac: 25,
          ltv: 180,
          churnRate: 15,
          grossMargin: 85
        },
        fundingNeeds: 2000000,
        runway: 18
      }
    },
    {
      id: "complete",
      title: "Investor Package",
      description: "Download complete materials",
      icon: Download,
      duration: 7,
      color: "from-purple-500 to-blue-500",
      content: {
        documents: [
          "Business Plan (28 pages)",
          "Investor Pitch Deck (12 slides)",
          "Financial Model (Excel)",
          "Market Research Report",
          "Executive Summary (2 pages)"
        ],
        totalValue: "$12,500 consultant equivalent"
      }
    }
  ];

  const simulateGeneration = async (stepIndex: number) => {
    setIsGenerating(true);
    setProgress(0);
    
    const step = demoSteps[stepIndex];
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setCompletedSteps(prev => [...prev, step.id]);
          return 100;
        }
        // Progress for 7-second completion: ~1.43% per interval
        return prev + 1.43;
      });
    }, 100); // 7 seconds total (70 intervals * 100ms)
  };

  const currentStepData = demoSteps[currentStep];
  const isStepCompleted = completedSteps.includes(currentStepData?.id);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
    }
  };

  const startGeneration = () => {
    if (!isGenerating && !isStepCompleted) {
      simulateGeneration(currentStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Animated 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Large floating gradient orbs that follow mouse */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.8 - 100}px, ${mousePosition.y * 0.6 - 80}px)`,
            left: '15%',
            top: '25%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/25 to-purple-400/25 rounded-full blur-3xl transition-transform duration-1200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.5 + 60}px, ${mousePosition.y * -0.7 + 70}px)`,
            right: '20%',
            bottom: '30%'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl transition-transform duration-800 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.3 - 30}px, ${mousePosition.y * 0.8 - 50}px)`,
            left: '65%',
            top: '15%'
          }}
        />

        {/* Medium floating orbs */}
        <div 
          className="absolute w-48 h-48 bg-gradient-to-r from-pink-400/15 to-purple-400/15 rounded-full blur-2xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * -0.3}px)`,
            left: '10%',
            bottom: '10%'
          }}
        />
        <div 
          className="absolute w-40 h-40 bg-gradient-to-r from-indigo-400/15 to-blue-400/15 rounded-full blur-2xl transition-transform duration-900 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * 0.4}px)`,
            right: '10%',
            top: '40%'
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
                transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
              }}
            />
          ))}
        </div>

        {/* Geometric shapes with 3D transforms */}
        <div 
          className="absolute w-32 h-32 border-2 border-purple-300/40 rounded-xl transition-transform duration-1000 ease-out"
          style={{
            transform: `perspective(1000px) translate3d(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.15}px, 0) rotateX(${mousePosition.y * 0.2 - 10}deg) rotateY(${mousePosition.x * 0.2 - 10}deg) rotateZ(${45 + mousePosition.x * 0.1}deg)`,
            right: '15%',
            top: '20%'
          }}
        />
        <div 
          className="absolute w-24 h-24 border-2 border-cyan-300/40 rounded-full transition-transform duration-1000 ease-out"
          style={{
            transform: `perspective(800px) translate3d(${mousePosition.x * -0.12}px, ${mousePosition.y * 0.18}px, 0) rotateX(${mousePosition.y * 0.15}deg) rotateY(${mousePosition.x * 0.15}deg)`,
            left: '25%',
            bottom: '25%'
          }}
        />
        <div 
          className="absolute w-20 h-20 border-2 border-blue-300/35 rounded-lg transition-transform duration-800 ease-out"
          style={{
            transform: `perspective(600px) translate3d(${mousePosition.x * 0.08}px, ${mousePosition.y * -0.10}px, 0) rotateX(${mousePosition.y * -0.1}deg) rotateY(${mousePosition.x * 0.1}deg) rotateZ(${mousePosition.x * 0.05}deg)`,
            right: '40%',
            bottom: '15%'
          }}
        />

        {/* Floating lines and connectors */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <line 
            x1="20%" 
            y1="30%" 
            x2={`${30 + mousePosition.x * 0.1}%`} 
            y2={`${60 + mousePosition.y * 0.1}%`}
            stroke="url(#lineGradient)" 
            strokeWidth="2"
            className="transition-all duration-1000 ease-out"
          />
          <line 
            x1="70%" 
            y1="20%" 
            x2={`${80 + mousePosition.x * -0.08}%`} 
            y2={`${50 + mousePosition.y * 0.08}%`}
            stroke="url(#lineGradient)" 
            strokeWidth="1.5"
            className="transition-all duration-1200 ease-out"
          />
        </svg>

        {/* Depth layers with parallax */}
        <div className="absolute inset-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-${30 - i * 5}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                transform: `translate(${mousePosition.x * (0.05 + i * 0.02)}px, ${mousePosition.y * (0.03 + i * 0.015)}px)`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/85 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50 shadow-lg">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 transition-transform duration-500"
          style={{
            transform: `translateX(${mousePosition.x * 0.02}px)`
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                MyStartup.ai Demo
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-purple-500 text-purple-600">
                <Clock className="w-4 h-4 mr-1" />
                ~49 seconds
              </Badge>
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Exit Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Complete Startup Journey Demo</h1>
            <div className="text-right">
              <div className="text-gray-900 font-semibold">Step {currentStep + 1} of {demoSteps.length}</div>
              <div className="text-gray-600 text-sm">{Math.round((currentStep / (demoSteps.length - 1)) * 100)}% Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (demoSteps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          {demoSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`relative p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                index === currentStep 
                  ? 'border-purple-500 bg-purple-50' 
                  : completedSteps.includes(step.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  completedSteps.includes(step.id) 
                    ? 'bg-green-500' 
                    : index === currentStep 
                    ? `bg-gradient-to-r ${step.color}` 
                    : 'bg-gray-200'
                }`}>
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <step.icon className={`w-4 h-4 ${index === currentStep ? 'text-white' : 'text-gray-600'}`} />
                  )}
                </div>
                <div className="hidden md:block">
                  <div className={`text-xs font-semibold ${
                    index === currentStep ? 'text-purple-700' : 
                    completedSteps.includes(step.id) ? 'text-green-700' : 'text-gray-700'
                  }`}>{step.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Step Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Step Info & Controls */}
          <div>
            <Card className="bg-white border border-gray-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${currentStepData.color} rounded-2xl flex items-center justify-center`}>
                    <currentStepData.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{currentStepData.title}</CardTitle>
                    <p className="text-gray-600">{currentStepData.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Enhanced Generation Progress with Live Research */}
                {isGenerating && (
                  <div className="space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                    {/* Header with spinning brain */}
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-spin">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Research Engine Active</h3>
                      <p className="text-sm text-gray-600">Scanning the web and analyzing market data in real-time</p>
                    </div>

                    {/* Main Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">Overall Progress</span>
                        <span className="text-purple-600 font-bold">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <p className="text-xs text-gray-500 text-center">
                        {Math.max(0, Math.round((100 - progress) * 30 / 100))} seconds remaining • Watch the AI research in real-time
                      </p>
                    </div>

                    {/* Live Research Activities */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <Search className="w-5 h-5 text-blue-600 animate-pulse" />
                        <span className="font-semibold text-blue-900">Live Research Activities</span>
                      </div>
                      
                      {/* Dynamic Research Steps */}
                      <div className="space-y-2">
                        {[
                          { task: "🌐 Scanning 500+ fitness app databases", website: "App Store, Google Play", status: progress > 15 ? "complete" : progress > 5 ? "active" : "pending" },
                          { task: "📊 Analyzing MyFitnessPal market data", website: "200M users, $125M revenue", status: progress > 30 ? "complete" : progress > 15 ? "active" : "pending" },
                          { task: "🏃 Researching Nike Training Club", website: "50M+ users, free model", status: progress > 50 ? "complete" : progress > 30 ? "active" : "pending" },
                          { task: "💪 Evaluating Peloton Digital strategy", website: "6M users, $400M revenue", status: progress > 70 ? "complete" : progress > 50 ? "active" : "pending" },
                          { task: "🧠 Generating competitive matrix", website: "AI-powered positioning", status: progress > 95 ? "complete" : progress > 70 ? "active" : "pending" }
                        ].slice(0, 4).map((step, i) => (
                          <div key={i} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-700 ${
                            step.status === "complete" ? "bg-green-100 border-l-4 border-green-500 transform scale-105" :
                            step.status === "active" ? "bg-blue-100 border-l-4 border-blue-500 animate-pulse" :
                            "bg-gray-50 border-l-4 border-gray-300"
                          }`}>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {step.status === "complete" ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : step.status === "active" ? (
                                  <div className="w-4 h-4">
                                    <div className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={`text-sm font-medium ${
                                  step.status === "complete" ? "text-green-800" :
                                  step.status === "active" ? "text-blue-800" : "text-gray-600"
                                }`}>
                                  {step.task}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 ml-6 mt-1">
                                {step.website}
                              </div>
                            </div>
                            <Badge variant={
                              step.status === "complete" ? "default" :
                              step.status === "active" ? "secondary" : "outline"
                            } className="text-xs ml-2">
                              {step.status === "complete" ? "✓ Complete" :
                               step.status === "active" ? "🔍 Analyzing" : "⏳ Queued"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      {/* AI Neural Network Processing */}
                      {progress > 40 && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
                            <span className="text-sm font-semibold text-purple-900">Neural Network Analysis</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center p-2 bg-white rounded border">
                              <div className="text-purple-600 font-bold text-lg animate-pulse">150+</div>
                              <div className="text-gray-600 text-xs">Data Points</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border">
                              <div className="text-purple-600 font-bold text-lg animate-pulse" style={{animationDelay: '0.5s'}}>12</div>
                              <div className="text-gray-600 text-xs">ML Models</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded border">
                              <div className="text-purple-600 font-bold text-lg animate-pulse" style={{animationDelay: '1s'}}>95%</div>
                              <div className="text-gray-600 text-xs">Confidence</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Steps 0-1: Navigation without generation */}
                  {currentStep === 0 && (
                    <Button 
                      onClick={() => setCurrentStep(1)}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                    >
                      Continue to AI Enhancement
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === 1 && (
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      Start Analysis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {/* Steps 2+: Original generation flow */}
                  {currentStep >= 2 && !isStepCompleted && !isGenerating && (
                    <Button 
                      onClick={() => simulateGeneration(currentStep)}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate {currentStepData.title}
                    </Button>
                  )}
                  
                  {currentStep >= 2 && isStepCompleted && currentStep < demoSteps.length - 1 && (
                    <Button 
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-pulse"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Continue to Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {currentStep === demoSteps.length - 1 && isStepCompleted && (
                    <Link href="/waitlist">
                      <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Join Waitlist
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Time Estimate */}
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Estimated time: {currentStepData.duration} seconds</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Content Preview */}
          <div>
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-gray-900">Live Preview</CardTitle>
              </CardHeader>
              
              <CardContent className="h-[600px] overflow-hidden">
                {/* Content based on current step */}
                {(currentStep === 0 || currentStepData.id === "submission") && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                        <Brain className="w-5 h-5 text-gray-500 mr-2" />
                        User Submits Raw Idea
                      </h3>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-gray-600 font-medium text-lg mb-2">Fitness App</h4>
                          <p className="text-gray-500 text-sm mb-4">An app for workouts</p>
                          
                          <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                            <div className="text-xs text-gray-500 mb-1">Basic Information</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Industry: Health & Fitness</div>
                              <div>Target: General users</div>
                            </div>
                          </div>

                          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <div className="text-sm text-red-600 font-medium mb-1">⚠️ Too Basic for Analysis</div>
                            <div className="text-xs text-red-500">Needs AI enhancement first</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(currentStep === 1 || currentStepData.id === "enhancement") && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                        <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                        AI-Enhanced Concept
                      </h3>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                        <h4 className="text-green-700 font-bold text-lg mb-3">{currentStepData.content.title}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">{currentStepData.content.description}</p>
                        
                        {/* Improved Viability Score */}
                        <div className="bg-white rounded-lg p-4 border border-green-300 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Enhanced Viability Score</span>
                            <span className="text-2xl font-bold text-green-600">{currentStepData.content.viabilityScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-green-500 h-3 rounded-full transition-all duration-1000" 
                              style={{ width: `${currentStepData.content.viabilityScore}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-green-600 mt-1">Investment Ready</div>
                        </div>

                        {/* AI Improvements */}
                        <div className="space-y-2 mb-4">
                          <h5 className="text-sm font-semibold text-green-700 mb-2">AI Improvements Applied:</h5>
                          {currentStepData.content.improvements.map((improvement, index) => (
                            <div key={index} className="bg-white rounded p-2 border border-green-200 flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-sm text-gray-700">{improvement}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Problem Statement
                            </div>
                            <div className="text-sm text-gray-700">{currentStepData.content.problemStatement}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Solution Approach
                            </div>
                            <div className="text-sm text-gray-700">{currentStepData.content.solutionApproach}</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-green-200">
                          <div className="text-center">
                            <span className="text-xs text-green-600 flex items-center justify-center">
                              <Star className="w-3 h-3 mr-1" />
                              Ready for Analysis
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && currentStepData.id === "analysis" && !isGenerating && !isStepCompleted && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                        <Target className="w-5 h-5 text-blue-600 mr-2" />
                        Ready to Analyze Enhanced Concept
                      </h3>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-blue-600" />
                          </div>
                          <h4 className="text-blue-900 font-medium text-lg mb-2">Analysis Ready</h4>
                          <p className="text-blue-700 text-sm mb-6">Enhanced concept is ready for deep validation</p>
                          
                          <div className="bg-white rounded-lg p-4 border border-blue-300 mb-4">
                            <div className="text-sm text-blue-800 font-medium mb-2">Analysis will include:</div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                              <div>• Market viability scoring</div>
                              <div>• Competitive analysis</div>
                              <div>• SWOT assessment</div>
                              <div>• Growth opportunities</div>
                            </div>
                          </div>

                          <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                            <div className="text-sm text-blue-800 font-medium mb-1">🎯 Click "Generate AI Analysis" to start</div>
                            <div className="text-xs text-blue-600">Comprehensive validation in progress...</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep >= 2 && currentStepData.id === "analysis" && !isGenerating && isStepCompleted && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 text-purple-600 mr-2" />
                        Startup Concept
                      </h3>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-purple-700 font-bold text-lg mb-3">{currentStepData.content.title}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed mb-4">{currentStepData.content.description}</p>
                        
                        <div className="grid grid-cols-1 gap-3 mb-4">
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Industry</div>
                            <div className="text-sm font-medium text-gray-800">{currentStepData.content.industry}</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Target Market</div>
                            <div className="text-sm font-medium text-gray-800">{currentStepData.content.targetMarket}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Problem Statement
                            </div>
                            <div className="text-sm text-gray-700">{currentStepData.content.problemStatement}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Solution Approach
                            </div>
                            <div className="text-sm text-gray-700">{currentStepData.content.solutionApproach}</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-purple-200">
                          <div className="flex items-center justify-between text-xs text-purple-600">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              Ready for AI Analysis
                            </span>
                            <span className="flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              High Potential
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Market Context */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-blue-800 font-semibold mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Market Context
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">$96B</div>
                          <div className="text-xs text-gray-600">Global Market</div>
                        </div>
                        <div className="bg-white rounded p-3 text-center">
                          <div className="text-lg font-bold text-green-600">14.7%</div>
                          <div className="text-xs text-gray-600">Annual Growth</div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-blue-700">
                        AI-powered fitness solutions are experiencing rapid adoption post-COVID
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Research Results - Appears during generation */}
                {isGenerating && (
                  <div className="space-y-3">
                    <div className="text-center mb-4">
                      <h3 className="text-gray-900 font-bold text-lg mb-2 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 animate-pulse">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        AI Research Results
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                    </div>

                    {/* Market Intelligence */}
                    {progress > 20 && (
                      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-xl p-4 border border-emerald-200 shadow-lg animate-slideIn">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-emerald-800 font-bold text-sm flex items-center">
                            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center mr-2">
                              <Globe className="w-3 h-3 text-white" />
                            </div>
                            Market Intelligence
                          </h4>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">Live</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                            <div className="text-2xl font-bold text-emerald-600">$96B</div>
                            <div className="text-xs text-gray-600">Total Market</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                            <div className="text-2xl font-bold text-emerald-600">$4.5B</div>
                            <div className="text-xs text-gray-600">App Segment</div>
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-xs text-emerald-700 font-semibold">14.7% Annual Growth</span>
                        </div>
                      </div>
                    )}

                    {/* Competitor Analysis */}
                    {progress > 40 && (
                      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-lg animate-slideIn">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-blue-800 font-bold text-sm flex items-center">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
                              <Users className="w-3 h-3 text-white" />
                            </div>
                            Top Competitors
                          </h4>
                          <Badge className="bg-blue-100 text-blue-700 border-0">2 Found</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-gray-900 text-sm">MyFitnessPal</div>
                                <div className="text-xs text-blue-600">200M+ users</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-green-600">$125M</div>
                                <div className="text-xs text-gray-500">Revenue</div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-gray-900 text-sm">Nike Training</div>
                                <div className="text-xs text-blue-600">50M+ users</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-orange-600">Free</div>
                                <div className="text-xs text-gray-500">Model</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SWOT Analysis */}
                    {progress > 60 && (
                      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-xl p-4 border border-purple-200 shadow-lg animate-slideIn">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-purple-800 font-bold text-sm flex items-center">
                            <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
                              <Target className="w-3 h-3 text-white" />
                            </div>
                            SWOT Analysis
                          </h4>
                          <Badge className="bg-purple-100 text-purple-700 border-0">Complete</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 border-l-4 border-green-500 shadow-sm">
                            <div className="text-green-800 font-bold text-xs mb-1">STRENGTHS</div>
                            <div className="text-green-700 text-xs">AI personalization advantage</div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3 border-l-4 border-blue-500 shadow-sm">
                            <div className="text-blue-800 font-bold text-xs mb-1">OPPORTUNITIES</div>
                            <div className="text-blue-700 text-xs">Corporate wellness market</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Final Score */}
                    {progress > 80 && (
                      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-4 border border-orange-200 shadow-lg animate-slideIn">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-orange-800 font-bold text-sm flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mr-2">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                            Viability Score
                          </h4>
                          <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-0">Final</Badge>
                        </div>
                        <div className="text-center mb-3">
                          <div className="relative">
                            <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">8.5</div>
                            <div className="text-lg text-gray-500 font-medium">/ 10</div>
                          </div>
                          <div className="text-sm font-semibold text-orange-700 mb-2">High Potential for Success</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white rounded-lg p-2 border border-orange-100 shadow-sm text-center">
                            <div className="text-lg font-bold text-blue-600">8.5</div>
                            <div className="text-xs text-gray-600 font-medium">Technical</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-orange-100 shadow-sm text-center">
                            <div className="text-lg font-bold text-green-600">8.0</div>
                            <div className="text-xs text-gray-600 font-medium">Market</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 border border-orange-100 shadow-sm text-center">
                            <div className="text-lg font-bold text-purple-600">8.0</div>
                            <div className="text-xs text-gray-600 font-medium">Financial</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStepData.id === "analysis" && isStepCompleted && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {currentStepData.content.score}/10
                      </div>
                      <div className="text-gray-600 mb-4">Overall Viability Score</div>
                      
                      {/* Sub-scores */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-blue-50 rounded-lg p-3 border">
                          <div className="text-xl font-bold text-blue-600">{currentStepData.content.technicalFeasibility}</div>
                          <div className="text-xs text-gray-600">Technical</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 border">
                          <div className="text-xl font-bold text-green-600">{currentStepData.content.marketFeasibility}</div>
                          <div className="text-xs text-gray-600">Market</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 border">
                          <div className="text-xl font-bold text-purple-600">{currentStepData.content.financialFeasibility}</div>
                          <div className="text-xs text-gray-600">Financial</div>
                        </div>
                      </div>
                    </div>

                    {/* Tabbed Analysis */}
                    <Tabs defaultValue="swot" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="swot" className="text-xs">SWOT</TabsTrigger>
                        <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
                        <TabsTrigger value="competitors" className="text-xs">Competitors</TabsTrigger>
                        <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="swot" className="space-y-3 mt-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-50 rounded p-2 border-l-4 border-green-500">
                            <h5 className="font-medium text-green-800 text-xs mb-1 flex items-center">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Strengths
                            </h5>
                            {currentStepData.content.strengths.slice(0, 2).map((item: string, i: number) => (
                              <p key={i} className="text-xs text-green-700">{item}</p>
                            ))}
                          </div>
                          <div className="bg-red-50 rounded p-2 border-l-4 border-red-500">
                            <h5 className="font-medium text-red-800 text-xs mb-1 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Weaknesses
                            </h5>
                            {currentStepData.content.weaknesses.slice(0, 2).map((item: string, i: number) => (
                              <p key={i} className="text-xs text-red-700">{item}</p>
                            ))}
                          </div>
                          <div className="bg-blue-50 rounded p-2 border-l-4 border-blue-500">
                            <h5 className="font-medium text-blue-800 text-xs mb-1 flex items-center">
                              <Lightbulb className="w-3 h-3 mr-1" />
                              Opportunities
                            </h5>
                            {currentStepData.content.opportunities.slice(0, 2).map((item: string, i: number) => (
                              <p key={i} className="text-xs text-blue-700">{item}</p>
                            ))}
                          </div>
                          <div className="bg-orange-50 rounded p-2 border-l-4 border-orange-500">
                            <h5 className="font-medium text-orange-800 text-xs mb-1 flex items-center">
                              <Shield className="w-3 h-3 mr-1" />
                              Threats
                            </h5>
                            {currentStepData.content.threats.slice(0, 2).map((item: string, i: number) => (
                              <p key={i} className="text-xs text-orange-700">{item}</p>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="market" className="space-y-3 mt-4">
                        <div className="space-y-3">
                          <div className="bg-purple-50 rounded-lg p-3 border">
                            <h5 className="font-medium text-purple-800 text-sm mb-2">Market Size Analysis</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">TAM (Total)</span>
                                <span className="font-medium">${(currentStepData.content.tam / 1000000000).toFixed(1)}B</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">SAM (Serviceable)</span>
                                <span className="font-medium">${(currentStepData.content.sam / 1000000000).toFixed(1)}B</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-600">SOM (Obtainable)</span>
                                <span className="font-medium">${(currentStepData.content.som / 1000000).toFixed(0)}M</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="competitors" className="space-y-2 mt-4">
                        {currentStepData.content.competitorAnalysis.map((comp: any, i: number) => (
                          <div key={i} className="bg-gray-50 rounded p-2 border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h6 className="font-medium text-xs text-gray-900">{comp.name}</h6>
                                <p className="text-xs text-gray-600">{comp.users} users</p>
                              </div>
                              <Badge variant="outline" className="text-xs">{comp.revenue}</Badge>
                            </div>
                            <p className="text-xs text-gray-700 mt-1">{comp.strengths}</p>
                          </div>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="users" className="space-y-2 mt-4">
                        {currentStepData.content.userPersonas.map((persona: any, i: number) => (
                          <div key={i} className="bg-blue-50 rounded p-2 border">
                            <div className="flex justify-between items-start mb-1">
                              <h6 className="font-medium text-xs text-blue-900">{persona.name}</h6>
                              <span className="text-xs text-blue-600">{persona.age}</span>
                            </div>
                            <p className="text-xs text-blue-700 mb-1">Pain: {persona.painPoint}</p>
                            <p className="text-xs text-blue-600">Goal: {persona.motivation}</p>
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {currentStepData.id === "business-plan" && isStepCompleted && (
                  <div className="space-y-4">
                    {/* Plan Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{currentStepData.content.wordCount.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{currentStepData.content.pageCount}</div>
                          <div className="text-xs text-gray-600">Pages</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-green-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {currentStepData.content.completionTime}
                        </div>
                        <div className="flex items-center text-orange-600">
                          <Star className="w-4 h-4 mr-1" />
                          Quality: {currentStepData.content.qualityScore}/10
                        </div>
                      </div>
                    </div>
                    
                    {/* Sections with expandable content */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {currentStepData.content.sections.map((section: any, i: number) => (
                        <details key={i} className="bg-gray-50 rounded-lg border">
                          <summary className="p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <div>
                                  <span className="text-gray-900 text-sm font-medium">{section.name}</span>
                                  <div className="text-xs text-gray-500">{section.wordCount} words</div>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-400 transform transition-transform" />
                            </div>
                          </summary>
                          <div className="px-3 pb-3 border-t border-gray-200 mt-2 pt-2">
                            <p className="text-xs text-gray-700 leading-relaxed">{section.fullContent}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                    
                    {/* Download Options */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <Download className="w-3 h-3 mr-1" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-3 h-3 mr-1" />
                        Edit Plan
                      </Button>
                    </div>
                  </div>
                )}

                {currentStepData.id === "pitch-deck" && isStepCompleted && (
                  <div className="space-y-4">
                    {/* Professional Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Presentation className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold">FitAI Investor Deck</h3>
                            <p className="text-purple-100 text-sm">Series A Presentation</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-xs text-purple-200">Slides</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Target: Series A VCs in Health Tech</span>
                        <span>Duration: 15 minutes</span>
                      </div>
                    </div>
                    
                    {/* Professional Pitch Deck Showcase */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Presentation className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold">FitAI Investor Deck</h4>
                              <p className="text-slate-300 text-sm">Series A • Health Tech Revolution</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400">12</div>
                            <div className="text-xs text-slate-400">Professional Slides</div>
                          </div>
                        </div>
                      </div>

                      {/* Slide Navigation */}
                      <div className="bg-gray-50 border-b px-6 py-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-semibold text-gray-800">Investor Presentation</h5>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700 text-xs">Ready to Present</Badge>
                            <Badge variant="outline" className="text-xs">15 min duration</Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Scrollable Slide Content */}
                      <div className="max-h-96 overflow-y-auto">
                        <div className="p-6 space-y-4">
                          {/* Slide 1: Title */}
                          <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                            <div className="relative">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">01</div>
                                <div className="text-blue-200 text-sm font-medium">Company Overview</div>
                              </div>
                              <h3 className="text-2xl font-bold mb-2">FitAI</h3>
                              <p className="text-blue-100 text-lg mb-3">The Future of Personalized Fitness</p>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="bg-white/20 px-3 py-1 rounded-full">Series A</span>
                                <span className="bg-white/20 px-3 py-1 rounded-full">$5M Raise</span>
                                <span className="bg-white/20 px-3 py-1 rounded-full">Health Tech</span>
                              </div>
                            </div>
                          </div>

                          {/* Slide 2: Problem */}
                          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">02</div>
                              <div className="text-red-600 text-sm font-medium">Market Problem</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">The $2.3B Retention Crisis</h3>
                            <p className="text-gray-700 mb-4">78% of fitness apps fail to retain users beyond 6 months, creating a massive waste of resources and missed opportunities.</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white rounded-lg p-3 border border-red-100">
                                <div className="text-2xl font-bold text-red-600">40%</div>
                                <div className="text-sm text-gray-600">Monthly churn rate</div>
                                <div className="text-xs text-red-500">Industry standard</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-red-100">
                                <div className="text-2xl font-bold text-red-600">$2.3B</div>
                                <div className="text-sm text-gray-600">Wasted annually</div>
                                <div className="text-xs text-red-500">On ineffective solutions</div>
                              </div>
                            </div>
                          </div>

                          {/* Slide 3: Solution */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">03</div>
                              <div className="text-green-600 text-sm font-medium">Our Solution</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Personal Trainer</h3>
                            <p className="text-gray-700 mb-4">Real-time form correction and adaptive workouts powered by computer vision and machine learning.</p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-white rounded-lg p-3 border border-green-100">
                                <div className="text-lg font-bold text-green-600">Computer Vision</div>
                                <div className="text-sm text-gray-600">Real-time form analysis</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-green-100">
                                <div className="text-lg font-bold text-green-600">85% Retention</div>
                                <div className="text-sm text-gray-600">Proven user engagement</div>
                              </div>
                            </div>
                            <div className="bg-green-100 rounded-lg p-3">
                              <div className="text-sm font-medium text-green-800">Key Differentiators:</div>
                              <div className="text-sm text-green-700 mt-1">• Adaptive difficulty based on performance • Personalized nutrition recommendations • Motivational AI coaching</div>
                            </div>
                          </div>

                          {/* Slide 4: Market */}
                          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">04</div>
                              <div className="text-purple-600 text-sm font-medium">Market Opportunity</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">$96B Market Growing 14.7% Annually</h3>
                            <p className="text-gray-700 mb-4">Post-COVID fitness market acceleration with 300% growth in digital health adoption.</p>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                                <div className="text-xl font-bold text-purple-600">$96B</div>
                                <div className="text-sm text-gray-600">Total Addressable</div>
                                <div className="text-xs text-purple-500">Global fitness market</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                                <div className="text-xl font-bold text-purple-600">$4.5B</div>
                                <div className="text-sm text-gray-600">Serviceable Market</div>
                                <div className="text-xs text-purple-500">AI fitness segment</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-purple-100 text-center">
                                <div className="text-xl font-bold text-purple-600">150M</div>
                                <div className="text-sm text-gray-600">Target Users</div>
                                <div className="text-xs text-purple-500">Mobile-first fitness</div>
                              </div>
                            </div>
                          </div>

                          {/* Slide 5: Business Model */}
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">05</div>
                              <div className="text-blue-600 text-sm font-medium">Business Model</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Freemium SaaS with Premium AI Features</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3 border border-blue-100">
                                  <div className="text-lg font-bold text-blue-600">Free Tier</div>
                                  <div className="text-sm text-gray-600">Basic workouts, limited AI</div>
                                  <div className="text-xs text-blue-500">Customer acquisition</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-blue-100">
                                  <div className="text-lg font-bold text-blue-600">$19.99/mo</div>
                                  <div className="text-sm text-gray-600">Premium AI coaching</div>
                                  <div className="text-xs text-blue-500">Primary revenue</div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-blue-100 rounded-lg p-3">
                                  <div className="text-sm font-medium text-blue-800 mb-2">Revenue Streams:</div>
                                  <div className="text-sm text-blue-700 space-y-1">
                                    <div>• Subscription revenue (85%)</div>
                                    <div>• Corporate partnerships (10%)</div>
                                    <div>• Equipment integrations (5%)</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Slide 6: Traction */}
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">06</div>
                              <div className="text-orange-600 text-sm font-medium">Traction & Growth</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Strong Product-Market Fit</h3>
                            <p className="text-gray-700 mb-4">5,000 beta users with exceptional engagement metrics and viral growth.</p>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-white rounded-lg p-3 border border-orange-100 text-center">
                                <div className="text-xl font-bold text-orange-600">85%</div>
                                <div className="text-sm text-gray-600">6-month retention</div>
                                <div className="text-xs text-orange-500">vs 22% industry avg</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-orange-100 text-center">
                                <div className="text-xl font-bold text-orange-600">72</div>
                                <div className="text-sm text-gray-600">NPS Score</div>
                                <div className="text-xs text-orange-500">World-class rating</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-orange-100 text-center">
                                <div className="text-xl font-bold text-orange-600">40%</div>
                                <div className="text-sm text-gray-600">Monthly growth</div>
                                <div className="text-xs text-orange-500">Organic referrals</div>
                              </div>
                            </div>
                            <div className="bg-orange-100 rounded-lg p-3">
                              <div className="text-sm font-medium text-orange-800">Recent Milestones:</div>
                              <div className="text-sm text-orange-700 mt-1">• Partnership with Equinox gyms • Featured in Apple App Store • $500K ARR run rate</div>
                            </div>
                          </div>

                          {/* Slide 7: Competition */}
                          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-gray-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">07</div>
                              <div className="text-gray-600 text-sm font-medium">Competitive Advantage</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">First-Mover in AI Form Correction</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-gray-800 mb-2">Traditional Competitors:</div>
                                <div className="space-y-2">
                                  <div className="bg-white rounded p-2 border border-gray-100 text-sm">
                                    <span className="font-medium">MyFitnessPal:</span> Nutrition tracking only
                                  </div>
                                  <div className="bg-white rounded p-2 border border-gray-100 text-sm">
                                    <span className="font-medium">Nike Training:</span> Static video workouts
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-800 mb-2">Our Advantages:</div>
                                <div className="space-y-2">
                                  <div className="bg-green-50 rounded p-2 border border-green-100 text-sm text-green-700">
                                    ✓ Real-time AI form correction
                                  </div>
                                  <div className="bg-green-50 rounded p-2 border border-green-100 text-sm text-green-700">
                                    ✓ Adaptive workout progression
                                  </div>
                                  <div className="bg-green-50 rounded p-2 border border-green-100 text-sm text-green-700">
                                    ✓ Proprietary computer vision models
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Slide 8: Team */}
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">08</div>
                              <div className="text-indigo-600 text-sm font-medium">Leadership Team</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">World-Class AI & Fitness Expertise</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="text-lg font-bold text-gray-900">Sarah Chen, CEO</div>
                                <div className="text-sm text-gray-600">Former Head of AI at Peloton</div>
                                <div className="text-xs text-indigo-600 mt-1">Stanford AI PhD, 15 years experience</div>
                              </div>
                              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                                <div className="text-lg font-bold text-gray-900">Mike Rodriguez, CTO</div>
                                <div className="text-sm text-gray-600">Ex-Google Computer Vision Lead</div>
                                <div className="text-xs text-indigo-600 mt-1">Built ML systems for 500M+ users</div>
                              </div>
                            </div>
                            <div className="mt-3 bg-indigo-100 rounded-lg p-3">
                              <div className="text-sm font-medium text-indigo-800">Advisory Board:</div>
                              <div className="text-sm text-indigo-700 mt-1">• Former Equinox CEO • Apple Health team lead • Y Combinator partner</div>
                            </div>
                          </div>

                          {/* Slide 9: Financials */}
                          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">09</div>
                              <div className="text-emerald-600 text-sm font-medium">Financial Projections</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Path to $50M ARR by Year 3</h3>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-white rounded-lg p-3 border border-emerald-100 text-center">
                                <div className="text-xl font-bold text-emerald-600">$2M</div>
                                <div className="text-sm text-gray-600">Year 1 ARR</div>
                                <div className="text-xs text-emerald-500">100K users</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-emerald-100 text-center">
                                <div className="text-xl font-bold text-emerald-600">$12M</div>
                                <div className="text-sm text-gray-600">Year 2 ARR</div>
                                <div className="text-xs text-emerald-500">500K users</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-emerald-100 text-center">
                                <div className="text-xl font-bold text-emerald-600">$50M</div>
                                <div className="text-sm text-gray-600">Year 3 ARR</div>
                                <div className="text-xs text-emerald-500">2M users</div>
                              </div>
                            </div>
                            <div className="bg-emerald-100 rounded-lg p-3">
                              <div className="text-sm font-medium text-emerald-800">Unit Economics:</div>
                              <div className="text-sm text-emerald-700 mt-1">• LTV/CAC ratio: 8:1 • Gross margin: 85% • Payback period: 4 months</div>
                            </div>
                          </div>

                          {/* Slide 10: Funding Ask */}
                          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">10</div>
                              <div className="text-rose-600 text-sm font-medium">Investment Opportunity</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Raising $5M Series A</h3>
                            <p className="text-gray-700 mb-4">Accelerate growth, expand AI capabilities, and capture market leadership position.</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3 border border-rose-100">
                                  <div className="text-lg font-bold text-rose-600">40%</div>
                                  <div className="text-sm text-gray-600">Engineering & AI</div>
                                  <div className="text-xs text-rose-500">Product development</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-rose-100">
                                  <div className="text-lg font-bold text-rose-600">35%</div>
                                  <div className="text-sm text-gray-600">Marketing & Growth</div>
                                  <div className="text-xs text-rose-500">User acquisition</div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-white rounded-lg p-3 border border-rose-100">
                                  <div className="text-lg font-bold text-rose-600">15%</div>
                                  <div className="text-sm text-gray-600">Operations</div>
                                  <div className="text-xs text-rose-500">Infrastructure & support</div>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-rose-100">
                                  <div className="text-lg font-bold text-rose-600">10%</div>
                                  <div className="text-sm text-gray-600">Partnerships</div>
                                  <div className="text-xs text-rose-500">Strategic alliances</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Slide 11: Vision */}
                          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-violet-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">11</div>
                              <div className="text-violet-600 text-sm font-medium">Future Vision</div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">The Global AI Fitness Platform</h3>
                            <p className="text-gray-700 mb-4">Building the world's most intelligent fitness ecosystem, making personal training accessible to everyone.</p>
                            <div className="space-y-3">
                              <div className="bg-white rounded-lg p-3 border border-violet-100">
                                <div className="text-sm font-medium text-violet-800">5-Year Vision:</div>
                                <div className="text-sm text-violet-700 mt-1">• 50M global users • AI coaches in 25 languages • Integration with all major fitness equipment • IPO-ready $1B+ valuation</div>
                              </div>
                            </div>
                          </div>

                          {/* Slide 12: Thank You */}
                          <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full -translate-y-20 translate-x-20"></div>
                            <div className="relative">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">12</div>
                                <div className="text-slate-300 text-sm font-medium">Next Steps</div>
                              </div>
                              <h3 className="text-2xl font-bold mb-3">Let's Transform Fitness Together</h3>
                              <p className="text-slate-300 mb-4">Ready to revolutionize how the world stays fit with AI-powered personal training.</p>
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors">
                                  Schedule Follow-up
                                </div>
                                <div className="text-slate-300 text-sm">sarah@fitai.com • +1 (555) 123-4567</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="bg-gray-50 border-t px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">12 professional slides</span> • Investor-ready presentation • 15 minute duration
                          </div>
                          <div className="flex space-x-3">
                            <Button size="sm" variant="outline" className="text-sm">
                              <Download className="w-4 h-4 mr-2" />
                              Export PDF
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm">
                              <Play className="w-4 h-4 mr-2" />
                              Start Presentation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.id === "financial" && isStepCompleted && (
                  <div className="space-y-4">
                    {/* Key Metrics Overview */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center border">
                        <div className="text-green-600 font-bold text-xl">
                          ${(currentStepData.content.revenue.year5 / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-gray-600 text-xs">Year 5 Revenue</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center border">
                        <div className="text-blue-600 font-bold text-xl">
                          {(currentStepData.content.users.year5 / 1000).toFixed(0)}K
                        </div>
                        <div className="text-gray-600 text-xs">Year 5 Users</div>
                      </div>
                    </div>

                    {/* Financial Tabs */}
                    <Tabs defaultValue="metrics" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="metrics" className="text-xs">Unit Economics</TabsTrigger>
                        <TabsTrigger value="growth" className="text-xs">Growth</TabsTrigger>
                        <TabsTrigger value="funding" className="text-xs">Funding</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="metrics" className="space-y-3 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700 text-sm flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              LTV/CAC Ratio
                            </span>
                            <span className="text-gray-900 font-semibold">{(currentStepData.content.metrics.ltv / currentStepData.content.metrics.cac).toFixed(1)}x</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700 text-sm flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Gross Margin
                            </span>
                            <span className="text-gray-900 font-semibold">{currentStepData.content.metrics.grossMargin}%</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700 text-sm flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              Monthly Churn
                            </span>
                            <span className="text-gray-900 font-semibold">{currentStepData.content.metrics.churnRate}%</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 text-sm flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Payback Period
                            </span>
                            <span className="text-gray-900 font-semibold">4.2 months</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="growth" className="space-y-3 mt-4">
                        <div className="space-y-3">
                          {[
                            { year: "Year 1", users: currentStepData.content.users.year1, revenue: currentStepData.content.revenue.year1 },
                            { year: "Year 2", users: currentStepData.content.users.year2, revenue: currentStepData.content.revenue.year2 },
                            { year: "Year 5", users: currentStepData.content.users.year5, revenue: currentStepData.content.revenue.year5 }
                          ].map((data, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 border">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900">{data.year}</span>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-green-600">
                                    ${(data.revenue / 1000000).toFixed(1)}M
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {(data.users / 1000).toFixed(0)}K users
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="funding" className="space-y-3 mt-4">
                        <div className="bg-purple-50 rounded-lg p-3 border">
                          <h5 className="font-medium text-purple-800 text-sm mb-2">Funding Requirements</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Series A Ask</span>
                              <span className="font-medium">${(currentStepData.content.fundingNeeds / 1000000).toFixed(1)}M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Runway</span>
                              <span className="font-medium">{currentStepData.content.runway} months</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Break-even</span>
                              <span className="font-medium">Month 18</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h6 className="text-xs font-medium text-gray-800">Use of Funds:</h6>
                          {[
                            { category: "Engineering", percentage: 40, color: "bg-blue-500" },
                            { category: "Marketing", percentage: 30, color: "bg-green-500" },
                            { category: "Team", percentage: 20, color: "bg-purple-500" },
                            { category: "Operations", percentage: 10, color: "bg-orange-500" }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded ${item.color}`}></div>
                              <div className="flex-1 flex justify-between">
                                <span className="text-xs text-gray-700">{item.category}</span>
                                <span className="text-xs font-medium">{item.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Export Options */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        <Calculator className="w-3 h-3 mr-1" />
                        Open Model
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Export Excel
                      </Button>
                    </div>
                  </div>
                )}

                {currentStepData.id === "complete" && isStepCompleted && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-gray-900 font-semibold">Investor Package Complete</div>
                      <div className="text-gray-600 text-sm">Professional documents ready for download</div>
                    </div>
                    
                    <div className="space-y-2">
                      {currentStepData.content.documents.map((doc: string, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900 text-sm">{doc}</span>
                          </div>
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-lg p-4 text-center border">
                      <div className="text-gray-900 font-semibold">Total Value Generated</div>
                      <div className="text-green-600 text-lg font-bold">{currentStepData.content.totalValue}</div>
                      <div className="text-gray-700 text-sm">if done with consultants</div>
                    </div>
                  </div>
                )}

                {!isStepCompleted && !isGenerating && (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 border">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <currentStepData.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Launch AI Research</h3>
                      <p className="text-gray-600">Click "Generate" to watch our AI research the web in real-time</p>
                    </div>
                    
                    {/* Preview of what AI will do */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-purple-600" />
                        AI Research Plan:
                      </h4>
                      <div className="space-y-2">
                        {currentStepData.id === "analysis" && [
                          { icon: "🌐", task: "Scan 500+ fitness app databases", detail: "App Store, Google Play, web sources" },
                          { icon: "🏃", task: "Analyze top competitors", detail: "MyFitnessPal, Nike Training, Peloton" },
                          { icon: "📊", task: "Process market data", detail: "User reviews, pricing, features" },
                          { icon: "🧠", task: "Generate SWOT analysis", detail: "AI-powered insights & positioning" }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-200">
                            <span className="text-lg">{step.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{step.task}</div>
                              <div className="text-xs text-gray-500">{step.detail}</div>
                            </div>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                        
                        {currentStepData.id === "business-plan" && [
                          { icon: "📝", task: "Generate 12-section business plan", detail: "3,000+ words, investor-ready" },
                          { icon: "💼", task: "Market analysis & strategy", detail: "TAM/SAM/SOM calculations" },
                          { icon: "💰", task: "Financial projections", detail: "5-year revenue & expense models" },
                          { icon: "🎯", task: "Risk assessment", detail: "Mitigation strategies & scenarios" }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-200">
                            <span className="text-lg">{step.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{step.task}</div>
                              <div className="text-xs text-gray-500">{step.detail}</div>
                            </div>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                        
                        {currentStepData.id === "pitch-deck" && [
                          { icon: "🎯", task: "Create 10 investor slides", detail: "Problem, solution, market, traction" },
                          { icon: "📈", task: "Financial projections", detail: "Growth charts & unit economics" },
                          { icon: "🏆", task: "Competitive positioning", detail: "Advantages & market differentiation" },
                          { icon: "💡", task: "Speaker notes", detail: "Presentation guidance & tips" }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-200">
                            <span className="text-lg">{step.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{step.task}</div>
                              <div className="text-xs text-gray-500">{step.detail}</div>
                            </div>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                        
                        {currentStepData.id === "financial" && [
                          { icon: "📊", task: "Build financial model", detail: "5-year projections & scenarios" },
                          { icon: "💸", task: "Unit economics", detail: "LTV/CAC, churn, payback period" },
                          { icon: "💰", task: "Funding requirements", detail: "Series A ask & use of funds" },
                          { icon: "📈", task: "Growth metrics", detail: "Revenue models & scaling plan" }
                        ].map((step, i) => (
                          <div key={i} className="flex items-center space-x-3 p-2 bg-white rounded border border-gray-200">
                            <span className="text-lg">{step.icon}</span>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{step.task}</div>
                              <div className="text-xs text-gray-500">{step.detail}</div>
                            </div>
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center text-blue-800 text-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="font-medium">This is a live demonstration using real AI research capabilities</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}