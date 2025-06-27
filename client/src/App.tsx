import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Home from "@/pages/landing-new";
import Dashboard from "@/pages/dashboard";
import SubmitIdea from "@/pages/submit-idea";
import BusinessPlan from "@/pages/business-plan";
import PitchDeck from "@/pages/pitch-deck";
import FinancialModelingPage from "@/pages/financial-modeling";
import MarketResearchPage from "@/pages/market-research";
import EventsNetworking from "@/pages/events-networking";
import CompletePlatform from "@/pages/complete-platform";
import Waitlist from "@/pages/waitlist";
import DemoJourney from "@/pages/demo-journey";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/submit-idea" component={SubmitIdea} />
      <Route path="/business-plan" component={BusinessPlan} />
      <Route path="/pitch-deck" component={PitchDeck} />
      <Route path="/financial-modeling" component={FinancialModelingPage} />
      <Route path="/market-research" component={MarketResearchPage} />
      <Route path="/events-networking" component={EventsNetworking} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/platform" component={CompletePlatform} />
      <Route path="/waitlist" component={Waitlist} />
      <Route path="/demo" component={DemoJourney} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
