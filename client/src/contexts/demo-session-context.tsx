import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DemoSessionData } from "@/components/demo-personalization-modal";

interface DemoSessionContextType {
  isPersonalized: boolean;
  sessionData: DemoSessionData | null;
  artifacts: Record<string, any>;
  setSessionData: (data: DemoSessionData | null) => void;
  updateArtifact: (type: string, artifact: any) => void;
  getArtifact: (type: string) => any;
  clearSession: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DemoSessionContext = createContext<DemoSessionContextType | undefined>(undefined);

const STORAGE_KEY = "mystartup-demo-session";

interface DemoSessionProviderProps {
  children: ReactNode;
}

export function DemoSessionProvider({ children }: DemoSessionProviderProps) {
  const [sessionData, setSessionDataState] = useState<DemoSessionData | null>(null);
  const [artifacts, setArtifacts] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load session data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSessionDataState(parsed.sessionData || null);
        setArtifacts(parsed.artifacts || {});
      }
    } catch (error) {
      console.error("Failed to load demo session from storage:", error);
    }
  }, []);

  // Save to localStorage whenever session data or artifacts change
  useEffect(() => {
    if (sessionData || Object.keys(artifacts).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          sessionData,
          artifacts
        }));
      } catch (error) {
        console.error("Failed to save demo session to storage:", error);
      }
    }
  }, [sessionData, artifacts]);

  const setSessionData = (data: DemoSessionData | null) => {
    setSessionDataState(data);
    if (!data) {
      setArtifacts({});
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear demo session from storage:", error);
      }
    }
  };

  const updateArtifact = (type: string, artifact: any) => {
    setArtifacts(prev => ({
      ...prev,
      [type]: artifact
    }));
  };

  const getArtifact = (type: string) => {
    return artifacts[type];
  };

  const clearSession = () => {
    setSessionData(null);
  };

  const value: DemoSessionContextType = {
    isPersonalized: !!sessionData,
    sessionData,
    artifacts,
    setSessionData,
    updateArtifact,
    getArtifact,
    clearSession,
    isLoading,
    setIsLoading
  };

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (context === undefined) {
    throw new Error("useDemoSession must be used within a DemoSessionProvider");
  }
  return context;
}

export function usePersonalizedContent() {
  const { isPersonalized, sessionData } = useDemoSession();
  
  return {
    isPersonalized,
    ideaTitle: sessionData?.ideaTitle || "Your Startup",
    description: sessionData?.description || "An innovative solution to market challenges",
    industry: sessionData?.industry || "Technology",
    targetMarket: sessionData?.targetMarket || "Target customers",
    problemStatement: sessionData?.problemStatement || "A significant market problem",
    solutionApproach: sessionData?.solutionApproach || "Our innovative solution approach",
    revenueModel: sessionData?.revenueModel || "Sustainable revenue model",
    competitiveAdvantage: sessionData?.competitiveAdvantage || "Unique competitive advantage"
  };
}