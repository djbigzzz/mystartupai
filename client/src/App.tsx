import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import Home from "@/pages/marketing-home";
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

import Profile from "@/pages/profile";
import StartupProfile from "@/pages/startup-profile";
import AnalyticsDemo from "@/pages/analytics-demo";
import BusinessPlansDemo from "@/pages/business-plans-demo";
import InvestorsDemo from "@/pages/investors-demo";
import FundingDemo from "@/pages/funding-demo";
import CompanySetupDemo from "@/pages/company-setup-demo";
import WebsiteBuilderDemo from "@/pages/website-builder-demo";
import LegalDemo from "@/pages/legal-demo";
import ScheduleDemo from "@/pages/schedule-demo";
import ExportCenter from "@/pages/export-center";
import InvestorReadyDemo from "@/pages/investor-ready-demo";
import AIShowcase from "@/pages/ai-showcase";
import MVPBuilder from "@/pages/mvp-builder";
import InvestorMatching from "@/pages/investor-matching";
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
      <Route path="/dashboard" component={Dashboard} />

      <Route path="/profile" component={Profile} />
      <Route path="/startup-profile" component={StartupProfile} />
      <Route path="/analytics" component={AnalyticsDemo} />
      <Route path="/business-plans" component={BusinessPlansDemo} />
      <Route path="/investors" component={InvestorsDemo} />
      <Route path="/funding" component={FundingDemo} />
      <Route path="/company-setup" component={CompanySetupDemo} />
      <Route path="/website-builder" component={WebsiteBuilderDemo} />
      <Route path="/legal" component={LegalDemo} />
      <Route path="/schedule" component={ScheduleDemo} />
      <Route path="/export" component={ExportCenter} />
      <Route path="/investor-demo" component={InvestorReadyDemo} />
      <Route path="/ai-showcase" component={AIShowcase} />
      <Route path="/mvp-builder" component={MVPBuilder} />
      <Route path="/investor-matching" component={InvestorMatching} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
