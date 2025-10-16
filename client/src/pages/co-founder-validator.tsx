import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Sparkles,
  Target,
  Users,
  DollarSign,
  RefreshCcw
} from "lucide-react";
import { useLocation } from "wouter";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { SplitText } from "@/components/react-bits/split-text";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  idea: string;
  score: number;
  verdict: 'GO' | 'REFINE' | 'PIVOT';
  marketSize: string;
  competition: string;
  feasibility: string;
  risks: string[];
  opportunities: string[];
  recommendations: string[];
}

export default function CoFounderValidator() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [ideaDescription, setIdeaDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch validation result if exists
  const { data: validationResult } = useQuery<ValidationResult>({
    queryKey: ['/api/journey/validation'],
  });

  // Validate idea mutation
  const validateMutation = useMutation({
    mutationFn: async (idea: string) => {
      setIsAnalyzing(true);
      const response = await apiRequest('/api/journey/validate', {
        method: 'POST',
        body: { idea },
      });
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/journey/validation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/journey/progress'] });
      setIsAnalyzing(false);
      toast({
        title: "Validation Complete! 🎯",
        description: `Your idea scored ${data.score}/100`,
      });
    },
    onError: () => {
      setIsAnalyzing(false);
      toast({
        title: "Validation Failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleValidate = () => {
    if (!ideaDescription.trim()) {
      toast({
        title: "Idea Required",
        description: "Please describe your startup idea first",
        variant: "destructive",
      });
      return;
    }
    validateMutation.mutate(ideaDescription);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'GO':
        return 'text-green-400 border-green-400 bg-green-400/10';
      case 'REFINE':
        return 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
      case 'PIVOT':
        return 'text-red-400 border-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 border-gray-400 bg-gray-400/10';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'GO':
        return <CheckCircle2 className="w-8 h-8" />;
      case 'REFINE':
        return <AlertTriangle className="w-8 h-8" />;
      case 'PIVOT':
        return <XCircle className="w-8 h-8" />;
      default:
        return <Search className="w-8 h-8" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* ReactBits Aurora Background */}
      <AuroraBackground 
        className="opacity-25"
        colors={[
          "rgba(59, 130, 246, 0.5)",
          "rgba(139, 92, 246, 0.4)",
          "rgba(96, 165, 250, 0.5)",
        ]}
        speed={0.002}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/co-founder-journey')}
          className="mb-6 text-white hover:bg-white/10"
          data-testid="button-back"
        >
          ← Back to Journey
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">👩‍🔬</span>
            <SplitText
              text="The Validator"
              tag="h1"
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"
              splitType="chars"
              delay={30}
            />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Is your idea worth pursuing? Let's find out with data-driven validation.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Idea Input */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Your Startup Idea
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe your startup idea in detail... What problem does it solve? Who is your target customer? What makes it unique?"
                  className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  disabled={isAnalyzing}
                  data-testid="input-idea-description"
                />
                
                <Button
                  onClick={handleValidate}
                  disabled={isAnalyzing || !ideaDescription.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  data-testid="button-validate-idea"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Validate This Idea
                    </>
                  )}
                </Button>

                {validationResult && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300">
                      💡 Tip: You can refine your idea description and re-validate to improve your score
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Validation Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { icon: Target, label: 'Market Size & Growth', color: 'text-blue-400' },
                    { icon: Users, label: 'Target Audience Clarity', color: 'text-purple-400' },
                    { icon: TrendingUp, label: 'Competitive Advantage', color: 'text-pink-400' },
                    { icon: DollarSign, label: 'Revenue Potential', color: 'text-green-400' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Validation Results */}
          <div className="space-y-6">
            {validationResult ? (
              <>
                {/* Score & Verdict */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6" data-testid="validation-score">
                      <div className={`text-7xl font-bold mb-2 ${getScoreColor(validationResult.score)}`} data-testid="text-validation-score">
                        {validationResult.score}
                        <span className="text-3xl text-gray-400">/100</span>
                      </div>
                      <Progress value={validationResult.score} className="h-3 mb-4" data-testid="progress-validation-score" />
                      
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 ${getVerdictColor(validationResult.verdict)}`} data-testid="badge-verdict">
                        {getVerdictIcon(validationResult.verdict)}
                        <span className="text-2xl font-bold">{validationResult.verdict}</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <h3 className="font-semibold text-white mb-2">📊 Market Size</h3>
                        <p className="text-gray-300">{validationResult.marketSize}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">🎯 Competition</h3>
                        <p className="text-gray-300">{validationResult.competition}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">⚙️ Feasibility</h3>
                        <p className="text-gray-300">{validationResult.feasibility}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risks & Opportunities */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Risks to Consider
                      </h3>
                      <ul className="space-y-1">
                        {(validationResult.risks || []).map((risk, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Opportunities
                      </h3>
                      <ul className="space-y-1">
                        {(validationResult.opportunities || []).map((opp, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Recommendations
                      </h3>
                      <ul className="space-y-1">
                        {(validationResult.recommendations || []).map((rec, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps - Always Show */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">🎯 Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {validationResult.score >= 60 ? (
                      <>
                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <p className="text-green-400 font-semibold mb-2">✅ Validation Passed!</p>
                          <p className="text-sm text-gray-300">
                            Your idea has strong potential. You've unlocked the next co-founder stages to build your startup.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Button
                            onClick={() => navigate('/co-founder-journey')}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            data-testid="button-proceed-strategist"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Continue to The Strategist →
                          </Button>
                          
                          <p className="text-xs text-gray-400 text-center">
                            Generate business plan, pitch deck & financial model
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 font-semibold mb-2">
                            {validationResult.verdict === 'REFINE' ? '🔄 Refinement Needed' : '⚠️ Pivot Required'}
                          </p>
                          <p className="text-sm text-gray-300">
                            {validationResult.verdict === 'REFINE' 
                              ? 'Your idea has potential but needs refinement. Score 60+ to unlock the next stages.'
                              : 'Significant changes needed. Consider pivoting your approach to improve viability.'}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Current Score:</span>
                            <span className={`font-bold ${validationResult.score >= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                              {validationResult.score}/100
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">Required to Unlock:</span>
                            <span className="font-bold text-gray-400">60/100</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <p className="text-sm font-semibold text-white mb-3">🔒 What You'll Unlock at 60+:</p>
                          <div className="space-y-2">
                            {[
                              { icon: '👨‍💼', label: 'The Strategist', desc: 'Customer discovery & planning' },
                              { icon: '🏗️', label: 'The Builder', desc: 'Business plan, pitch deck & financials' },
                              { icon: '🚀', label: 'The Growth Hacker', desc: 'Investor matching & scaling' }
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-2 rounded bg-white/5 opacity-60">
                                <span className="text-lg">{item.icon}</span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-300">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setIdeaDescription(validationResult.idea);
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          data-testid="button-refine-idea"
                        >
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Refine Your Idea & Re-Validate
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() => navigate('/co-founder-journey')}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      data-testid="button-back-journey"
                    >
                      ← Back to Journey
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">
                      Ready to Validate?
                    </h3>
                    <p className="text-gray-400">
                      Describe your idea and get instant AI-powered validation
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
