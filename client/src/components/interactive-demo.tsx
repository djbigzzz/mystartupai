import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowRight,
  ArrowLeft,
  Brain,
  Lightbulb,
  FileText,
  Users,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Target,
  Search,
  BarChart3,
  DollarSign,
  Rocket,
  Globe,
  PieChart,
  Database,
  FileBarChart,
  Building2,
  Trophy,
  Zap,
  Eye,
  Star,
  Clock,
  MapPin,
  Award,
  UserCheck,
  Briefcase
} from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  type: 'input' | 'choice' | 'result';
  choices?: Choice[];
  resultContent?: React.ReactNode;
}

interface Choice {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface UserData {
  idea: string;
  industry: string;
  choices: { [stepId: number]: string };
}

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

function TypingText({ text, speed = 50, className = "" }: TypingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}

interface AnimatedResultProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
  color: string;
}

function AnimatedResult({ icon, title, content, delay, color }: AnimatedResultProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    setIsVisible(false);
  }, []);

  return (
    <div className={`transition-all duration-700 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`border-l-4 ${color} p-4 rounded-r bg-opacity-50`}>
        <div className="flex items-center mb-2">
          {icon}
          <span className="font-semibold ml-2 text-gray-900 dark:text-white">{title}</span>
        </div>
        {isVisible && (
          <TypingText 
            text={content}
            speed={30}
            className="text-sm text-gray-600 dark:text-gray-300"
          />
        )}
      </div>
    </div>
  );
}

export default function InteractiveDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    idea: "",
    industry: "",
    choices: {}
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const workflowSteps: WorkflowStep[] = [
    // Step 1: Idea Entry
    {
      id: 1,
      title: "Enter Your Startup Idea",
      description: "Share your startup concept and let our AI analyze its potential",
      type: 'input',
    },
    // Step 2: Market Research Choice
    {
      id: 2,
      title: "Choose Analysis Type",
      description: "Select how you'd like to analyze your idea",
      type: 'choice',
      choices: [
        {
          id: 'market-research',
          title: 'Market Research',
          description: 'Analyze market size, trends, and opportunities',
          icon: <Search className="w-6 h-6" />,
          color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
        },
        {
          id: 'competitive-analysis',
          title: 'Competitive Analysis',
          description: 'Research competitors and positioning',
          icon: <Target className="w-6 h-6" />,
          color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
        },
        {
          id: 'financial-analysis',
          title: 'Financial Analysis',
          description: 'Project revenue and business model',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100'
        }
      ]
    },
    // Step 3: Market Research Results
    {
      id: 3,
      title: "Market Research Analysis",
      description: "AI-generated insights about your market opportunity",
      type: 'result',
    },
    // Step 4: Competitor Analysis Choice
    {
      id: 4,
      title: "Deep Dive Analysis",
      description: "Get more detailed insights about your market",
      type: 'choice',
      choices: [
        {
          id: 'competitor-analysis',
          title: 'Competitor Analysis',
          description: 'Detailed competitive landscape mapping',
          icon: <Trophy className="w-6 h-6" />,
          color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100'
        },
        {
          id: 'customer-analysis',
          title: 'Customer Analysis',
          description: 'Target audience and persona research',
          icon: <Users className="w-6 h-6" />,
          color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-100'
        },
        {
          id: 'trend-analysis',
          title: 'Trend Analysis',
          description: 'Industry trends and future outlook',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100'
        }
      ]
    },
    // Step 5: Competitor Analysis Results
    {
      id: 5,
      title: "Competitive Landscape",
      description: "Detailed analysis of your competition and market positioning",
      type: 'result',
    },
    // Step 6: Business Plan Choice
    {
      id: 6,
      title: "Business Strategy",
      description: "Create comprehensive business documentation",
      type: 'choice',
      choices: [
        {
          id: 'business-plan',
          title: 'Business Plan Generation',
          description: 'Complete business plan with all sections',
          icon: <FileText className="w-6 h-6" />,
          color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
        },
        {
          id: 'financial-model',
          title: 'Financial Modeling',
          description: '5-year financial projections and metrics',
          icon: <BarChart3 className="w-6 h-6" />,
          color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
        },
        {
          id: 'mvp-plan',
          title: 'MVP Strategy',
          description: 'Minimum viable product roadmap',
          icon: <Rocket className="w-6 h-6" />,
          color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100'
        }
      ]
    },
    // Step 7: Business Plan Results
    {
      id: 7,
      title: "Business Plan Generated",
      description: "Your comprehensive business plan is ready",
      type: 'result',
    },
    // Step 8: Pitch Deck Choice
    {
      id: 8,
      title: "Investor Preparation",
      description: "Prepare materials for investor outreach",
      type: 'choice',
      choices: [
        {
          id: 'pitch-deck',
          title: 'Pitch Deck Generation',
          description: 'Investor-ready presentation slides',
          icon: <FileText className="w-6 h-6" />,
          color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100'
        },
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          description: 'Concise overview for investors',
          icon: <FileBarChart className="w-6 h-6" />,
          color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
        },
        {
          id: 'demo-materials',
          title: 'Demo Materials',
          description: 'Product demonstration assets',
          icon: <Eye className="w-6 h-6" />,
          color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100'
        }
      ]
    },
    // Step 9: Pitch Deck Results
    {
      id: 9,
      title: "Pitch Deck Created",
      description: "Professional investor presentation completed",
      type: 'result',
    },
    // Step 10: Investor Finding Choice
    {
      id: 10,
      title: "Investor Outreach",
      description: "Find and connect with the right investors",
      type: 'choice',
      choices: [
        {
          id: 'find-investors',
          title: 'Find Investors',
          description: 'Match with investors in your industry',
          icon: <UserCheck className="w-6 h-6" />,
          color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
        },
        {
          id: 'networking',
          title: 'Networking Events',
          description: 'Discover relevant networking opportunities',
          icon: <Users className="w-6 h-6" />,
          color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
        },
        {
          id: 'accelerators',
          title: 'Accelerator Programs',
          description: 'Find matching accelerator programs',
          icon: <Rocket className="w-6 h-6" />,
          color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100'
        }
      ]
    },
    // Step 11: Investor Matching Results
    {
      id: 11,
      title: "Investor Matches Found",
      description: "Connect with investors who are perfect for your startup",
      type: 'result',
    }
  ];

  const handleChoice = (choiceId: string) => {
    setIsProcessing(true);
    setUserData(prev => ({
      ...prev,
      choices: {
        ...prev.choices,
        [currentStep]: choiceId
      }
    }));

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(prev => prev + 1);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < workflowSteps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleIdeaSubmit = () => {
    if (userData.idea.trim()) {
      setIsProcessing(true);
      
      // Determine industry from idea text (simple keyword matching)
      const ideaLower = userData.idea.toLowerCase();
      let industry = "Technology";
      if (ideaLower.includes("food") || ideaLower.includes("delivery") || ideaLower.includes("restaurant")) {
        industry = "Food & Delivery";
      } else if (ideaLower.includes("health") || ideaLower.includes("medical") || ideaLower.includes("fitness")) {
        industry = "Healthcare";
      } else if (ideaLower.includes("education") || ideaLower.includes("learning") || ideaLower.includes("course")) {
        industry = "Education";
      } else if (ideaLower.includes("finance") || ideaLower.includes("payment") || ideaLower.includes("banking")) {
        industry = "Fintech";
      }

      setUserData(prev => ({ ...prev, industry }));

      setTimeout(() => {
        setIsProcessing(false);
        nextStep();
      }, 2000);
    }
  };

  const renderStepContent = () => {
    const step = workflowSteps[currentStep - 1];

    if (step.type === 'input') {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's your startup idea?
              </label>
              <Textarea
                placeholder="Example: A sustainable food delivery platform that connects eco-conscious consumers with local organic restaurants..."
                value={userData.idea}
                onChange={(e) => setUserData(prev => ({ ...prev, idea: e.target.value }))}
                className="min-h-[120px] resize-none"
                data-testid="input-startup-idea"
              />
            </div>

            <Button 
              onClick={handleIdeaSubmit} 
              disabled={!userData.idea.trim() || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              data-testid="button-submit-idea"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing your idea...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start AI Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </div>
        </div>
      );
    }

    if (step.type === 'choice') {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-4xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
          </div>

          {isProcessing ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Processing your choice...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {step.choices?.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className={`${choice.color} border-2 rounded-lg p-6 text-left transition-all duration-200 hover:shadow-lg hover:scale-105`}
                  data-testid={`button-choice-${choice.id}`}
                >
                  <div className="flex items-center mb-3">
                    {choice.icon}
                    <h4 className="font-semibold ml-3">{choice.title}</h4>
                  </div>
                  <p className="text-sm opacity-80">{choice.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (step.type === 'result') {
      return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
          </div>

          {renderResultContent()}

          <div className="mt-8 text-center">
            <Button 
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              data-testid="button-continue"
            >
              Continue to Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      );
    }
  };

  const renderResultContent = () => {
    const previousChoice = userData.choices[currentStep - 1];
    
    switch (currentStep) {
      case 3: // Analysis Results based on Step 2 choice
        if (previousChoice === 'market-research') {
          return (
            <div className="space-y-4">
              <AnimatedResult
                icon={<Globe className="w-5 h-5 text-blue-600" />}
                title="Market Size Analysis"
                content={`The ${userData.industry} market is valued at $${userData.industry === 'Healthcare' ? '350 billion' : userData.industry === 'Fintech' ? '179 billion' : userData.industry === 'Education' ? '400 billion' : userData.industry === 'Food & Delivery' ? '150 billion' : '250 billion'} globally, with your "${userData.idea.substring(0, 50)}..." concept targeting a growing segment.`}
                delay={500}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                title="Growth Trends"
                content={`${userData.industry} market analysis shows ${userData.industry === 'Healthcare' ? '8-12%' : userData.industry === 'Fintech' ? '15-20%' : userData.industry === 'Education' ? '10-15%' : userData.industry === 'Food & Delivery' ? '12-18%' : '10-15%'} annual growth in digital adoption. Your solution aligns with key trends: sustainability, AI integration, and user-centric design.`}
                delay={2000}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<Target className="w-5 h-5 text-purple-600" />}
                title="Market Opportunity"
                content={`Target audience analysis for your startup reveals ${userData.industry === 'Healthcare' ? 'aging population' : userData.industry === 'Fintech' ? 'underbanked consumers' : userData.industry === 'Education' ? 'lifelong learners' : userData.industry === 'Food & Delivery' ? 'eco-conscious diners' : 'digital natives'} as primary market. Addressable market estimated at $${userData.industry === 'Healthcare' ? '15B' : userData.industry === 'Fintech' ? '8B' : userData.industry === 'Education' ? '12B' : userData.industry === 'Food & Delivery' ? '4.5B' : '6B'}.`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'competitive-analysis') {
          return (
            <div className="space-y-4">
              <AnimatedResult
                icon={<Trophy className="w-5 h-5 text-orange-600" />}
                title="Competitive Landscape"
                content={`Direct competitor analysis for your "${userData.idea.substring(0, 40)}..." reveals 4 established players in ${userData.industry}. Key differentiation opportunity in user experience and pricing model.`}
                delay={500}
                color="border-orange-500 bg-orange-50 dark:bg-orange-900/20"
              />
              <AnimatedResult
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title="Market Share Analysis"
                content={`Top competitors control 45% market share in ${userData.industry}, leaving significant room for innovative solutions like yours. Customer satisfaction ratings show gaps your startup can fill.`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Zap className="w-5 h-5 text-green-600" />}
                title="Competitive Advantages"
                content={`Your startup's unique positioning in ${userData.industry} offers 6 key competitive advantages: innovative technology, superior UX, competitive pricing, faster delivery, better customer support, and sustainability focus.`}
                delay={3500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'financial-analysis') {
          return (
            <div className="space-y-4">
              <AnimatedResult
                icon={<DollarSign className="w-5 h-5 text-green-600" />}
                title="Revenue Projections"
                content={`Financial modeling for your ${userData.industry} startup projects $${userData.industry === 'Healthcare' ? '2.5M' : userData.industry === 'Fintech' ? '3.2M' : userData.industry === 'Education' ? '1.8M' : userData.industry === 'Food & Delivery' ? '4.1M' : '2.9M'} ARR by year 3 with current business model and market conditions.`}
                delay={500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
                title="Business Model Analysis"
                content={`Recommended revenue streams for "${userData.idea.substring(0, 35)}...": subscription model (60%), transaction fees (25%), premium features (15%). Strong unit economics with 65% gross margin.`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<PieChart className="w-5 h-5 text-purple-600" />}
                title="Investment Requirements"
                content={`Funding analysis suggests $${userData.industry === 'Healthcare' ? '1.2M' : userData.industry === 'Fintech' ? '2.1M' : userData.industry === 'Education' ? '800K' : userData.industry === 'Food & Delivery' ? '1.8M' : '1.5M'} seed round to reach Series A milestones. ROI projections show 15x potential return for early investors.`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        }
        break;

      case 5: // Deep Dive Analysis Results based on Step 4 choice
        if (previousChoice === 'competitor-analysis') {
          return (
            <div className="space-y-4">
              <AnimatedResult
                icon={<Trophy className="w-5 h-5 text-orange-600" />}
                title="Competitive Positioning Map"
                content={`Detailed analysis of ${userData.industry} competitors shows your "${userData.idea.substring(0, 30)}..." positioned in the high-value, low-competition quadrant. Premium pricing strategy recommended.`}
                delay={500}
                color="border-orange-500 bg-orange-50 dark:bg-orange-900/20"
              />
              <AnimatedResult
                icon={<Search className="w-5 h-5 text-blue-600" />}
                title="SWOT Analysis"
                content={`Strengths: innovative approach, strong tech team. Weaknesses: brand recognition. Opportunities: ${userData.industry} digital transformation. Threats: established player response.`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Zap className="w-5 h-5 text-green-600" />}
                title="Differentiation Strategy"
                content={`Recommended positioning: "The most user-friendly ${userData.industry.toLowerCase()} solution." Focus on simplicity, speed, and customer success to outperform existing solutions.`}
                delay={3500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'customer-analysis') {
          return (
            <div className="space-y-4">
              <AnimatedResult
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title="Customer Personas"
                content={`Primary persona for your ${userData.industry} startup: ${userData.industry === 'Healthcare' ? 'Health-conscious millennials' : userData.industry === 'Fintech' ? 'Young professionals' : userData.industry === 'Education' ? 'Lifelong learners' : userData.industry === 'Food & Delivery' ? 'Busy families' : 'Tech-savvy consumers'} aged 25-40, income $50K-$120K, values convenience and quality.`}
                delay={500}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Target className="w-5 h-5 text-green-600" />}
                title="Customer Journey Mapping"
                content={`Journey analysis reveals 5 key touchpoints where your solution creates value. Biggest pain point: current solutions are too complex. Your simplified approach addresses this perfectly.`}
                delay={2000}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<Eye className="w-5 h-5 text-purple-600" />}
                title="Customer Acquisition Strategy"
                content={`Recommended channels: digital marketing (40%), partnerships (30%), referrals (20%), content marketing (10%). CAC target: $${userData.industry === 'Healthcare' ? '85' : userData.industry === 'Fintech' ? '120' : userData.industry === 'Education' ? '45' : userData.industry === 'Food & Delivery' ? '35' : '75'}, LTV: $${userData.industry === 'Healthcare' ? '950' : userData.industry === 'Fintech' ? '1200' : userData.industry === 'Education' ? '380' : userData.industry === 'Food & Delivery' ? '280' : '650'}.`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'trend-analysis') {
          return (
            <div className="space-y-4">
              <AnimatedResult
                icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                title="Industry Trends Analysis"
                content={`${userData.industry} trends favor your "${userData.idea.substring(0, 35)}..." concept. Key drivers: AI adoption (↑45%), sustainability focus (↑67%), mobile-first approach (↑89%).`}
                delay={500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<Globe className="w-5 h-5 text-blue-600" />}
                title="Future Market Outlook"
                content={`5-year outlook for ${userData.industry}: market size projected to grow 23% annually. Emerging technologies and changing consumer behavior create perfect timing for your solution.`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Rocket className="w-5 h-5 text-purple-600" />}
                title="Innovation Opportunities"
                content={`Trend analysis identifies 4 key innovation gaps in ${userData.industry} that your startup can exploit: automation, personalization, real-time analytics, and seamless integration.`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        }
        break;

      case 7: // Business Strategy Results based on Step 6 choice
        if (previousChoice === 'business-plan') {
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Complete Business Plan Generated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Comprehensive business plan for "{userData.idea.substring(0, 60)}..." includes market analysis, financial projections, and go-to-market strategy.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Executive Summary</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{userData.industry} Market Analysis</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Revenue Model</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Marketing Strategy</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">5-Year Financial Projections</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Operations Plan</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Risk Assessment</span>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Growth Strategy</span>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (previousChoice === 'financial-model') {
          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Financial Model Complete</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  5-year financial projections for your {userData.industry} startup show strong growth potential and attractive unit economics.
                </p>
              </div>
              <AnimatedResult
                icon={<BarChart3 className="w-5 h-5 text-green-600" />}
                title="Revenue Projections"
                content={`Year 1: $${userData.industry === 'Healthcare' ? '150K' : userData.industry === 'Fintech' ? '200K' : userData.industry === 'Education' ? '120K' : userData.industry === 'Food & Delivery' ? '300K' : '180K'} → Year 5: $${userData.industry === 'Healthcare' ? '12M' : userData.industry === 'Fintech' ? '18M' : userData.industry === 'Education' ? '8M' : userData.industry === 'Food & Delivery' ? '25M' : '15M'} with 45% CAGR`}
                delay={500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<DollarSign className="w-5 h-5 text-blue-600" />}
                title="Unit Economics"
                content={`Customer LTV: $${userData.industry === 'Healthcare' ? '2,400' : userData.industry === 'Fintech' ? '3,200' : userData.industry === 'Education' ? '1,800' : userData.industry === 'Food & Delivery' ? '1,200' : '2,100'}, CAC: $${userData.industry === 'Healthcare' ? '180' : userData.industry === 'Fintech' ? '240' : userData.industry === 'Education' ? '120' : userData.industry === 'Food & Delivery' ? '80' : '150'}, LTV/CAC ratio: ${userData.industry === 'Healthcare' ? '13.3' : userData.industry === 'Fintech' ? '13.3' : userData.industry === 'Education' ? '15' : userData.industry === 'Food & Delivery' ? '15' : '14'}`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<PieChart className="w-5 h-5 text-purple-600" />}
                title="Break-even Analysis"
                content={`Break-even projected at month ${userData.industry === 'Healthcare' ? '18' : userData.industry === 'Fintech' ? '16' : userData.industry === 'Education' ? '14' : userData.industry === 'Food & Delivery' ? '12' : '15'} with ${userData.industry === 'Healthcare' ? '2,800' : userData.industry === 'Fintech' ? '3,500' : userData.industry === 'Education' ? '2,200' : userData.industry === 'Food & Delivery' ? '4,100' : '2,900'} active customers. Gross margin: 72%`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'mvp-plan') {
          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">MVP Strategy Ready</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Minimum viable product roadmap for "{userData.idea.substring(0, 45)}..." prioritizes core features for rapid market validation.
                </p>
              </div>
              <AnimatedResult
                icon={<Rocket className="w-5 h-5 text-purple-600" />}
                title="MVP Core Features"
                content={`Phase 1 (8 weeks): User registration, core ${userData.industry.toLowerCase()} functionality, basic dashboard. Estimated development cost: $${userData.industry === 'Healthcare' ? '85,000' : userData.industry === 'Fintech' ? '120,000' : userData.industry === 'Education' ? '65,000' : userData.industry === 'Food & Delivery' ? '95,000' : '80,000'}`}
                delay={500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
              <AnimatedResult
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title="Testing Strategy"
                content={`Beta testing with ${userData.industry === 'Healthcare' ? '50 healthcare professionals' : userData.industry === 'Fintech' ? '100 young professionals' : userData.industry === 'Education' ? '75 educators' : userData.industry === 'Food & Delivery' ? '150 local families' : '80 early adopters'} to validate product-market fit and gather feedback for iteration.`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Target className="w-5 h-5 text-green-600" />}
                title="Success Metrics"
                content={`MVP success criteria: ${userData.industry === 'Healthcare' ? '70% user retention' : userData.industry === 'Fintech' ? '60% transaction completion' : userData.industry === 'Education' ? '80% course completion' : userData.industry === 'Food & Delivery' ? '65% repeat orders' : '75% feature adoption'}, NPS > 50, and clear path to monetization within 6 months.`}
                delay={3500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
            </div>
          );
        }
        break;

      case 9: // Investor Preparation Results based on Step 8 choice
        if (previousChoice === 'pitch-deck') {
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Investor Pitch Deck Complete</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Professional 12-slide pitch deck for "{userData.idea.substring(0, 50)}..." tailored for {userData.industry} investors with compelling storytelling.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Problem Statement</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Solution Overview</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">{userData.industry} Market Opportunity</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Business Model</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Competitive Analysis</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Traction & Milestones</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">5-Year Financial Projections</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Go-to-Market Strategy</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Team & Advisory Board</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Funding Ask: $${userData.industry === 'Healthcare' ? '2.5M' : userData.industry === 'Fintech' ? '3.2M' : userData.industry === 'Education' ? '1.8M' : userData.industry === 'Food & Delivery' ? '2.8M' : '2.5M'}</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Use of Funds & ROI</span>
                  </div>
                  <div className="flex items-center p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900 dark:text-white">Call to Action</span>
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (previousChoice === 'executive-summary') {
          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Executive Summary Ready</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Concise 2-page executive summary for your {userData.industry} startup highlighting key value propositions and investment opportunity.
                </p>
              </div>
              <AnimatedResult
                icon={<FileBarChart className="w-5 h-5 text-blue-600" />}
                title="Investment Opportunity"
                content={`Executive summary positions "${userData.idea.substring(0, 40)}..." as a high-growth opportunity in the $${userData.industry === 'Healthcare' ? '4.2T' : userData.industry === 'Fintech' ? '179B' : userData.industry === 'Education' ? '7.3T' : userData.industry === 'Food & Delivery' ? '150B' : '3.8T'} ${userData.industry} market with 15x ROI potential.`}
                delay={500}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Target className="w-5 h-5 text-green-600" />}
                title="Key Value Propositions"
                content={`Summary highlights 3 core differentiators: innovative ${userData.industry.toLowerCase()} technology, superior user experience, and strong market timing with proven demand signals.`}
                delay={2000}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                title="Growth Metrics"
                content={`Executive summary showcases projected $${userData.industry === 'Healthcare' ? '12M' : userData.industry === 'Fintech' ? '18M' : userData.industry === 'Education' ? '8M' : userData.industry === 'Food & Delivery' ? '25M' : '15M'} ARR by year 5, 65% gross margins, and clear path to ${userData.industry === 'Healthcare' ? '$50M' : userData.industry === 'Fintech' ? '$75M' : userData.industry === 'Education' ? '$35M' : userData.industry === 'Food & Delivery' ? '$100M' : '$60M'} valuation.`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'demo-materials') {
          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Demo Materials Package</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Comprehensive demo package including product walkthrough, use case scenarios, and interactive prototypes for your {userData.industry} solution.
                </p>
              </div>
              <AnimatedResult
                icon={<Eye className="w-5 h-5 text-orange-600" />}
                title="Product Demonstration"
                content={`Interactive demo showcasing core features of "${userData.idea.substring(0, 35)}..." with realistic ${userData.industry.toLowerCase()} use cases and customer journey flows.`}
                delay={500}
                color="border-orange-500 bg-orange-50 dark:bg-orange-900/20"
              />
              <AnimatedResult
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title="Customer Use Cases"
                content={`Demo materials include 5 real-world scenarios showing how ${userData.industry === 'Healthcare' ? 'healthcare professionals' : userData.industry === 'Fintech' ? 'young professionals' : userData.industry === 'Education' ? 'educators and students' : userData.industry === 'Food & Delivery' ? 'families and restaurants' : 'target customers'} benefit from your solution.`}
                delay={2000}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<Rocket className="w-5 h-5 text-green-600" />}
                title="Interactive Prototype"
                content={`High-fidelity clickable prototype demonstrates key user flows, shows ${userData.industry.toLowerCase()} specific features, and validates product-market fit for investor presentations.`}
                delay={3500}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
            </div>
          );
        }
        break;

      case 11: // Investor Outreach Results based on Step 10 choice
        if (previousChoice === 'find-investors') {
          return (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Perfect Investor Matches Found</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI-powered matching identified 3 investors perfect for "{userData.idea.substring(0, 45)}..." based on industry focus, stage, and investment history.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-green-900 dark:text-green-100">{userData.industry === 'Healthcare' ? 'Dr. Sarah Chen' : userData.industry === 'Fintech' ? 'Marcus Rivera' : userData.industry === 'Education' ? 'Elena Patel' : userData.industry === 'Food & Delivery' ? 'James Wong' : 'Alexandra Kim'}</h4>
                      <p className="text-xs text-green-700 dark:text-green-300">{userData.industry} Series A Specialist</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-green-800 dark:text-green-200">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{userData.industry === 'Healthcare' ? 'Boston, MA' : userData.industry === 'Fintech' ? 'San Francisco, CA' : userData.industry === 'Education' ? 'Austin, TX' : userData.industry === 'Food & Delivery' ? 'Seattle, WA' : 'New York, NY'}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>{userData.industry} Focus</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>${userData.industry === 'Healthcare' ? '2M - 8M' : userData.industry === 'Fintech' ? '1M - 5M' : userData.industry === 'Education' ? '500K - 3M' : userData.industry === 'Food & Delivery' ? '1M - 6M' : '1M - 5M'} Range</span>
                    </div>
                  </div>
                  <Badge className="mt-2 bg-green-600 text-white text-xs">96% Match</Badge>
                </div>

                <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">{userData.industry === 'Healthcare' ? 'HealthTech Ventures' : userData.industry === 'Fintech' ? 'FinServ Capital' : userData.industry === 'Education' ? 'EduTech Partners' : userData.industry === 'Food & Delivery' ? 'FoodTech Fund' : 'Innovation Capital'}</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Early Stage VC</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>Silicon Valley, CA</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>{userData.industry} Specialists</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>${userData.industry === 'Healthcare' ? '3M - 15M' : userData.industry === 'Fintech' ? '2M - 10M' : userData.industry === 'Education' ? '1M - 8M' : userData.industry === 'Food & Delivery' ? '2M - 12M' : '2M - 10M'} Range</span>
                    </div>
                  </div>
                  <Badge className="mt-2 bg-blue-600 text-white text-xs">89% Match</Badge>
                </div>

                <div className="p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">{userData.industry === 'Healthcare' ? 'MedTech Angels' : userData.industry === 'Fintech' ? 'Fintech Collective' : userData.industry === 'Education' ? 'Learning Ventures' : userData.industry === 'Food & Delivery' ? 'Restaurant Tech Fund' : 'Tech Angels Group'}</h4>
                      <p className="text-xs text-purple-700 dark:text-purple-300">Angel Network</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-purple-800 dark:text-purple-200">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>Chicago, IL</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>{userData.industry} Angels</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      <span>${userData.industry === 'Healthcare' ? '250K - 2M' : userData.industry === 'Fintech' ? '500K - 3M' : userData.industry === 'Education' ? '100K - 1M' : userData.industry === 'Food & Delivery' ? '250K - 2M' : '250K - 2M'} Range</span>
                    </div>
                  </div>
                  <Badge className="mt-2 bg-purple-600 text-white text-xs">85% Match</Badge>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-gray-900 dark:text-white">Investor Matching Complete</span>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Found 3 highly compatible investors for your {userData.industry} startup. Ready to connect and schedule meetings!
                </p>
              </div>
            </div>
          );
        } else if (previousChoice === 'networking') {
          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Networking Opportunities</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Curated networking events and conferences perfect for connecting with {userData.industry} investors and industry leaders.
                </p>
              </div>
              <AnimatedResult
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title="Upcoming Events"
                content={`${userData.industry === 'Healthcare' ? 'HealthTech Innovation Summit' : userData.industry === 'Fintech' ? 'Fintech World Conference' : userData.industry === 'Education' ? 'EdTech Leaders Forum' : userData.industry === 'Food & Delivery' ? 'FoodTech Connect' : 'Tech Innovation Conference'} (March 15-17) - 200+ investors, 500+ startups. Perfect for "${userData.idea.substring(0, 30)}..." networking.`}
                delay={500}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
              <AnimatedResult
                icon={<MapPin className="w-5 h-5 text-green-600" />}
                title="Local Meetups"
                content={`Found 8 relevant {userData.industry.toLowerCase()} meetups in your area. Next event: "${userData.industry} Startup Pitch Night" - March 8th, 6 PM. 15+ investors attending, great for early connections.`}
                delay={2000}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<Briefcase className="w-5 h-5 text-purple-600" />}
                title="Industry Connections"
                content={`Connected to ${userData.industry} Entrepreneur Network (${userData.industry === 'Healthcare' ? '2,400' : userData.industry === 'Fintech' ? '3,200' : userData.industry === 'Education' ? '1,800' : userData.industry === 'Food & Delivery' ? '1,600' : '2,100'} members). Access to investor intro requests, mentorship program, and exclusive dealflow events.`}
                delay={3500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
            </div>
          );
        } else if (previousChoice === 'accelerators') {
          return (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Accelerator Programs</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Top accelerator programs with strong {userData.industry} focus and investor networks perfect for your startup's growth stage.
                </p>
              </div>
              <AnimatedResult
                icon={<Rocket className="w-5 h-5 text-purple-600" />}
                title="Perfect Match Programs"
                content={`${userData.industry === 'Healthcare' ? 'HealthTech Accelerator' : userData.industry === 'Fintech' ? 'Fintech Innovation Lab' : userData.industry === 'Education' ? 'EdTech Accelerator' : userData.industry === 'Food & Delivery' ? 'FoodTech Incubator' : 'TechStars'} - 95% match for "${userData.idea.substring(0, 25)}..." Applications due April 1st.`}
                delay={500}
                color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              />
              <AnimatedResult
                icon={<DollarSign className="w-5 h-5 text-green-600" />}
                title="Funding & Resources"
                content={`Selected programs offer $${userData.industry === 'Healthcare' ? '150K' : userData.industry === 'Fintech' ? '250K' : userData.industry === 'Education' ? '100K' : userData.industry === 'Food & Delivery' ? '125K' : '150K'} initial funding + $${userData.industry === 'Healthcare' ? '2M' : userData.industry === 'Fintech' ? '3M' : userData.industry === 'Education' ? '1.5M' : userData.industry === 'Food & Delivery' ? '2.5M' : '2M'} average follow-on from their investor network. 6-month intensive program.`}
                delay={2000}
                color="border-green-500 bg-green-50 dark:bg-green-900/20"
              />
              <AnimatedResult
                icon={<Users className="w-5 h-5 text-blue-600" />}
                title="Network Access"
                content={`Accelerator alumni network includes ${userData.industry === 'Healthcare' ? '400' : userData.industry === 'Fintech' ? '600' : userData.industry === 'Education' ? '300' : userData.industry === 'Food & Delivery' ? '350' : '500'}+ {userData.industry.toLowerCase()} founders, 150+ mentors, and direct access to 75+ VCs for Demo Day presentations.`}
                delay={3500}
                color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              />
            </div>
          );
        }
        break;

      default:
        return null;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-8" data-testid="interactive-demo">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Platform Workflow Demo
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Step {currentStep} of {workflowSteps.length}
          </div>
        </div>
        <Progress value={(currentStep / workflowSteps.length) * 100} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Idea Entry</span>
          <span>Analysis</span>
          <span>Business Plan</span>
          <span>Investor Ready</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex justify-center mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          data-testid="button-previous-step"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {workflowSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index + 1 === currentStep
                  ? 'bg-blue-600'
                  : index + 1 < currentStep
                  ? 'bg-green-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              data-testid={`progress-indicator-${index + 1}`}
            />
          ))}
        </div>

        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
        <Sparkles className="w-5 h-5 text-blue-600" />
      </div>
    </div>
  );
}