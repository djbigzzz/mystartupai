import { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InsufficientCreditsModal } from '@/components/insufficient-credits-modal';
import { LowCreditsBanner } from '@/components/low-credits-banner';

interface CreditContextType {
  currentCredits: number;
  showInsufficientCreditsModal: (requiredCredits: number, featureName: string) => void;
  closeInsufficientCreditsModal: () => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export function CreditProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);
  const [featureName, setFeatureName] = useState('');

  // Check if user is authenticated
  const { data: user } = useQuery<any>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch credit balance only if authenticated
  const { data: creditBalance } = useQuery<{ credits: number; transactions: any[] }>({
    queryKey: ["/api/credits/balance"],
    enabled: !!user,
    refetchInterval: 30000,
  });

  const currentCredits = creditBalance?.credits || 0;

  const showInsufficientCreditsModal = (required: number, feature: string) => {
    setRequiredCredits(required);
    setFeatureName(feature);
    setIsModalOpen(true);
  };

  const closeInsufficientCreditsModal = () => {
    setIsModalOpen(false);
    setRequiredCredits(0);
    setFeatureName('');
  };

  return (
    <CreditContext.Provider value={{ currentCredits, showInsufficientCreditsModal, closeInsufficientCreditsModal }}>
      {/* Site-wide low credits banner - only show for authenticated users */}
      {user && <LowCreditsBanner currentCredits={currentCredits} threshold={100} />}
      
      {children}
      
      <InsufficientCreditsModal
        isOpen={isModalOpen}
        onClose={closeInsufficientCreditsModal}
        currentCredits={currentCredits}
        requiredCredits={requiredCredits}
        featureName={featureName}
      />
    </CreditContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
}
