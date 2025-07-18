import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Home from "@/pages/landing-multi-agent";
import Dashboard from "@/pages/dashboard";
import SubmitIdea from "@/pages/submit-idea";
import BusinessPlan from "@/pages/business-plan";
import PitchDeck from "@/pages/pitch-deck";
import FinancialModelingPage from "@/pages/financial-modeling";
import MarketResearchPage from "@/pages/market-research";
import EventsNetworking from "@/pages/events-networking";
import CompletePlatform from "@/pages/complete-platform";
import WaitlistClean from "@/pages/waitlist-clean";
import DemoJourneyNew from "@/pages/demo-journey-new";
import AgenticDemoUnified from "@/pages/agentic-demo-unified";
import AppEntry from "@/pages/app-entry";
import AppDashboard from "@/pages/app-dashboard";
import Profile from "@/pages/profile";
import StartupProfile from "@/pages/startup-profile";
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
      <Route path="/platform" component={CompletePlatform} />
      <Route path="/waitlist" component={WaitlistClean} />
      <Route path="/demo" component={DemoJourneyNew} />
      <Route path="/agentic" component={AgenticDemoUnified} />
      <Route path="/app" component={AppEntry} />
      <Route path="/dashboard" component={AppDashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/startup-profile" component={StartupProfile} />
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
