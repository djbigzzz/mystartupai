import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Brain,
  Lightbulb,
  FileText,
  Users,
  Code,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Target,
  Search,
  BarChart3,
  DollarSign,
  Rocket,
  Clock,
  Zap,
  Globe,
  PieChart,
  Database,
  FileBarChart
} from "lucide-react";

interface DemoSlide {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  duration: number;
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

interface AnimatedInsightProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  delay: number;
  color: string;
}

function AnimatedInsight({ icon, title, content, delay, color }: AnimatedInsightProps) {
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
          <span className="font-semibold ml-2">{title}</span>
        </div>
        {isVisible && (
          <TypingText 
            text={content}
            speed={30}
            className="text-sm opacity-80"
          />
        )}
      </div>
    </div>
  );
}

export default function InteractiveDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const slides: DemoSlide[] = [
    {
      id: "ai-analysis",
      title: "AI-Powered Startup Analysis",
      description: "Watch our AI analyze your startup idea and provide comprehensive insights in real-time",
      duration: 6000,
      component: (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <div className="relative">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Analysis Engine</h3>
              <TypingText 
                text="Analyzing: Sustainable Food Delivery Platform"
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-4">
            <AnimatedInsight
              icon={<Search className="w-5 h-5 text-blue-600" />}
              title="Market Research"
              content="Analyzing $150B global food delivery market. Growth rate: 20% annually. Sustainability segment shows 45% higher customer retention."
              delay={500}
              color="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            />

            <AnimatedInsight
              icon={<Target className="w-5 h-5 text-green-600" />}
              title="Competitive Landscape"
              content="Identified 8 direct competitors. Key differentiation opportunity: carbon-neutral delivery with local sourcing partnerships."
              delay={2000}
              color="border-green-500 bg-green-50 dark:bg-green-900/20"
            />

            <AnimatedInsight
              icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
              title="Revenue Projections"
              content="Estimated TAM: $2.1B. Commission-based model with projected break-even at 18 months based on similar platforms."
              delay={3500}
              color="border-orange-500 bg-orange-50 dark:bg-orange-900/20"
            />

            <AnimatedInsight
              icon={<Users className="w-5 h-5 text-purple-600" />}
              title="Target Audience"
              content="Primary: Urban millennials aged 25-40, household income $50K+. Secondary: Eco-conscious Gen Z consumers."
              delay={5000}
              color="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/30 rounded-lg">
            <div className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analysis complete - Ready for business planning
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "business-plan-generation",
      title: "Intelligent Business Plan Creation",
      description: "AI generates comprehensive business plans with industry-specific insights and strategies",
      duration: 5500,
      component: (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Business Plan Generator</h3>
              <TypingText 
                text="Creating comprehensive business strategy..."
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <PlanSection title="Executive Summary" completed delay={500} />
              <PlanSection title="Market Analysis" completed delay={1500} />
              <PlanSection title="Business Model" completed delay={2500} />
              <PlanSection title="Marketing Strategy" inProgress delay={3500} />
            </div>
            <div className="space-y-3">
              <PlanSection title="Financial Projections" pending delay={0} />
              <PlanSection title="Operations Plan" pending delay={0} />
              <PlanSection title="Risk Assessment" pending delay={0} />
              <PlanSection title="Growth Strategy" pending delay={0} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generation Progress</span>
              <span className="text-sm font-medium text-blue-600">50%</span>
            </div>
            <Progress value={50} className="h-2 mb-2" />
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Zap className="w-3 h-3 mr-1" />
              <TypingText text="AI crafting marketing strategy based on target audience analysis..." />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "financial-modeling",
      title: "AI Financial Modeling",
      description: "Advanced AI creates detailed financial projections and scenario planning",
      duration: 5000,
      component: (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Financial Model Generator</h3>
              <TypingText 
                text="Building 5-year financial projections..."
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <FinancialMetric
                icon={<DollarSign className="w-5 h-5 text-green-600" />}
                title="Revenue Projections"
                value="Year 1: $250K → Year 3: $2.1M"
                delay={1000}
              />
              <FinancialMetric
                icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                title="Growth Rate"
                value="Monthly: 15% | Annual: 180%"
                delay={2000}
              />
              <FinancialMetric
                icon={<PieChart className="w-5 h-5 text-purple-600" />}
                title="Break-even Analysis"
                value="Month 18 at 2,500 orders/day"
                delay={3000}
              />
            </div>
            <div className="space-y-4">
              <FinancialMetric
                icon={<Target className="w-5 h-5 text-orange-600" />}
                title="Unit Economics"
                value="AOV: $45 | CAC: $28 | LTV: $340"
                delay={1500}
              />
              <FinancialMetric
                icon={<Database className="w-5 h-5 text-red-600" />}
                title="Funding Requirement"
                value="Seed: $500K | Series A: $2M"
                delay={2500}
              />
              <FinancialMetric
                icon={<FileBarChart className="w-5 h-5 text-indigo-600" />}
                title="Market Capture"
                value="0.01% TAM by Year 3"
                delay={3500}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Scenario Analysis</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Conservative</Badge>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Bull Case: +40% growth</span>
              <span>Base Case: Shown above</span>
              <span>Bear Case: -25% growth</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "mvp-generation",
      title: "MVP Code Generation",
      description: "AI generates production-ready MVP code tailored to your specific business model",
      duration: 4500,
      component: (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <Code className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">MVP Builder</h3>
              <TypingText 
                text="Generating full-stack application..."
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <Rocket className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Food Delivery</h4>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Selected Template</p>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center opacity-50">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-600 dark:text-gray-400">SaaS Platform</h4>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center opacity-50">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="font-medium text-gray-600 dark:text-gray-400">E-commerce</h4>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <CodeGenerationStep 
              title="Project Architecture" 
              status="completed" 
              delay={500}
              description="React frontend, Node.js backend, PostgreSQL database"
            />
            <CodeGenerationStep 
              title="User Authentication" 
              status="completed" 
              delay={1500}
              description="JWT-based auth with Google OAuth integration"
            />
            <CodeGenerationStep 
              title="Order Management System" 
              status="in-progress" 
              delay={2500}
              description="Real-time order tracking and restaurant management"
            />
            <CodeGenerationStep 
              title="Payment Integration" 
              status="pending" 
              delay={0}
              description="Stripe payment processing with escrow"
            />
            <CodeGenerationStep 
              title="Delivery Tracking" 
              status="pending" 
              delay={0}
              description="Real-time GPS tracking and ETA calculation"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Generated Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">React</Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Node.js</Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">PostgreSQL</Badge>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Stripe</Badge>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Socket.io</Badge>
              <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">Maps API</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "pitch-deck",
      title: "AI Pitch Deck Creation",
      description: "Intelligent pitch deck generation with investor-focused content and design",
      duration: 5000,
      component: (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-4xl">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pitch Deck Generator</h3>
              <TypingText 
                text="Creating investor-ready presentation..."
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <PitchSlide title="Problem Statement" completed delay={500} />
              <PitchSlide title="Solution Overview" completed delay={1000} />
              <PitchSlide title="Market Opportunity" completed delay={1500} />
              <PitchSlide title="Business Model" inProgress delay={2000} />
              <PitchSlide title="Competitive Analysis" pending delay={0} />
            </div>
            <div className="space-y-3">
              <PitchSlide title="Financial Projections" pending delay={0} />
              <PitchSlide title="Go-to-Market Strategy" pending delay={0} />
              <PitchSlide title="Team & Advisory" pending delay={0} />
              <PitchSlide title="Funding Ask" pending delay={0} />
              <PitchSlide title="Use of Funds" pending delay={0} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deck Generation Progress</span>
              <span className="text-sm font-medium text-purple-600">40%</span>
            </div>
            <Progress value={40} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                <span>AI optimizing for Series A investors</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Est. completion: 2 min</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Component for business plan sections
  function PlanSection({ title, completed = false, inProgress = false, pending = false, delay }: {
    title: string;
    completed?: boolean;
    inProgress?: boolean;
    pending?: boolean;
    delay: number;
  }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (delay > 0) {
        const timeout = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timeout);
      } else {
        setIsVisible(true);
      }
    }, [delay]);

    useEffect(() => {
      setIsVisible(delay === 0);
    }, [delay]);

    let bgColor = "bg-gray-50 dark:bg-gray-800";
    let icon = <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded mr-3"></div>;

    if (completed && isVisible) {
      bgColor = "bg-green-50 dark:bg-green-900/20";
      icon = <CheckCircle className="w-5 h-5 text-green-600 mr-3" />;
    } else if (inProgress && isVisible) {
      bgColor = "bg-blue-50 dark:bg-blue-900/20";
      icon = (
        <div className="w-5 h-5 border-2 border-blue-600 rounded mr-3 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className={`flex items-center p-3 ${bgColor} rounded transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-30'
      }`}>
        {icon}
        <span className={`text-sm font-medium ${
          pending ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
        }`}>
          {title}
        </span>
      </div>
    );
  }

  // Component for financial metrics
  function FinancialMetric({ icon, title, value, delay }: {
    icon: React.ReactNode;
    title: string;
    value: string;
    delay: number;
  }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timeout = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
      setIsVisible(false);
    }, []);

    return (
      <div className={`p-3 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-500 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      }`}>
        <div className="flex items-center mb-2">
          {icon}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        </div>
        {isVisible && (
          <TypingText 
            text={value}
            speed={40}
            className="text-xs text-gray-600 dark:text-gray-400"
          />
        )}
      </div>
    );
  }

  // Component for code generation steps
  function CodeGenerationStep({ title, status, delay, description }: {
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
    delay: number;
    description: string;
  }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (delay > 0) {
        const timeout = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timeout);
      } else {
        setIsVisible(true);
      }
    }, [delay]);

    useEffect(() => {
      setIsVisible(delay === 0);
    }, [delay]);

    let icon;
    if (status === 'completed' && isVisible) {
      icon = <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (status === 'in-progress' && isVisible) {
      icon = (
        <div className="w-5 h-5 border-2 border-blue-600 rounded flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      );
    } else {
      icon = <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded"></div>;
    }

    return (
      <div className={`flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-30'
      }`}>
        <div className="flex items-center">
          {icon}
          <div className="ml-3">
            <span className={`text-sm font-medium ${
              status === 'pending' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
            }`}>
              {title}
            </span>
            {isVisible && status !== 'pending' && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <TypingText text={description} speed={20} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Component for pitch deck slides
  function PitchSlide({ title, completed = false, inProgress = false, pending = false, delay }: {
    title: string;
    completed?: boolean;
    inProgress?: boolean;
    pending?: boolean;
    delay: number;
  }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (delay > 0) {
        const timeout = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timeout);
      } else {
        setIsVisible(true);
      }
    }, [delay]);

    useEffect(() => {
      setIsVisible(delay === 0);
    }, [delay]);

    let bgColor = "bg-gray-50 dark:bg-gray-800";
    let icon = <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded mr-3"></div>;

    if (completed && isVisible) {
      bgColor = "bg-green-50 dark:bg-green-900/20";
      icon = <CheckCircle className="w-4 h-4 text-green-600 mr-3" />;
    } else if (inProgress && isVisible) {
      bgColor = "bg-purple-50 dark:bg-purple-900/20";
      icon = (
        <div className="w-4 h-4 border-2 border-purple-600 rounded mr-3 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className={`flex items-center p-2.5 ${bgColor} rounded text-sm transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-30'
      }`}>
        {icon}
        <span className={`font-medium ${
          pending ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
        }`}>
          {title}
        </span>
      </div>
    );
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSlide((current) => (current + 1) % slides.length);
            return 0;
          }
          return prev + (100 / (slides[currentSlide].duration / 100));
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl p-8" data-testid="interactive-demo">
      {/* Demo Content */}
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {slides[currentSlide].title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Slide Content */}
        <div className="mb-8 flex justify-center w-full">
          {slides[currentSlide].component}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <Button variant="outline" size="sm" onClick={prevSlide} data-testid="button-prev-slide">
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button 
            size="sm" 
            onClick={togglePlayPause}
            className={isPlaying ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"}
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={nextSlide} data-testid="button-next-slide">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center space-x-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              data-testid={`indicator-slide-${index}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Slide Titles */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              data-testid={`button-slide-${index}`}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {slide.title}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
        <Sparkles className="w-5 h-5 text-blue-600" />
      </div>
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
        <Brain className="w-5 h-5 text-purple-600" />
      </div>
    </div>
  );
}