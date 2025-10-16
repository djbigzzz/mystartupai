import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { AuroraBackground } from "@/components/react-bits/aurora-background";
import { SplitText } from "@/components/react-bits/split-text";
import { Users, Target, MessageSquare, TrendingUp, ArrowLeft } from "lucide-react";

export default function CoFounderStrategist() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen relative">
      <AuroraBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <Button
          onClick={() => navigate('/co-founder-journey')}
          variant="ghost"
          className="text-white/80 hover:text-white mb-6"
          data-testid="button-back-to-journey"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Journey
        </Button>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">👨‍💼</div>
          <SplitText 
            text="The Strategist"
            className="text-5xl font-bold mb-4"
            delay={50}
          />
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Develop your go-to-market strategy, customer discovery plan, and feature roadmap.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Coming Soon: Strategy Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                The Strategist will help you develop a comprehensive go-to-market strategy with:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Customer Discovery</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Identify your ideal customer profile and create interview scripts to validate your assumptions.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Market Positioning</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Craft your unique value proposition and differentiation strategy against competitors.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">Feature Prioritization</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Build a roadmap that delivers maximum value with minimal time to market.
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    <h3 className="font-semibold text-white">Go-to-Market Plan</h3>
                  </div>
                  <p className="text-sm text-gray-400">
                    Design your launch strategy, pricing model, and early adoption tactics.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-yellow-400 font-semibold mb-2">🚧 Under Construction</p>
                <p className="text-sm text-gray-400">
                  This feature is being developed. For now, continue to The Builder to generate your business plan, pitch deck, and financial model.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/co-founder-journey')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  data-testid="button-continue-builder"
                >
                  Skip to The Builder →
                </Button>
                
                <Button
                  onClick={() => navigate('/co-founder-journey')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  data-testid="button-back-journey"
                >
                  Back to Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
