import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useState } from 'react';

interface LowCreditsBannerProps {
  currentCredits: number;
  threshold?: number;
}

export function LowCreditsBanner({ currentCredits, threshold = 100 }: LowCreditsBannerProps) {
  const [, setLocation] = useLocation();
  const [isDismissed, setIsDismissed] = useState(false);

  if (currentCredits >= threshold || isDismissed) {
    return null;
  }

  return (
    <div className="bg-orange-500/10 border-l-4 border-orange-500 dark:bg-orange-500/20 dark:border-orange-400">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Low Credits Warning
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                You have {currentCredits} credits remaining. Top up now to continue using AI features.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setLocation('/purchase-credits')}
              className="bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600"
              data-testid="button-top-up-credits"
            >
              Top Up Credits
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="text-orange-700 hover:text-orange-900 dark:text-orange-300 dark:hover:text-orange-100"
              data-testid="button-dismiss-banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
