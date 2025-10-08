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

  // Fetch credit balance
  const { data: creditBalance } = useQuery<{ credits: number; transactions: any[] }>({
    queryKey: ["/api/credits/balance"],
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
      {/* Site-wide low credits banner */}
      <LowCreditsBanner currentCredits={currentCredits} threshold={100} />
      
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
