import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, CreditCard, Wallet } from 'lucide-react';
import { CREDIT_PACKAGES } from '../../../shared/constants';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { SiSolana } from 'react-icons/si';
import { Connection, Transaction, PublicKey } from '@solana/web3.js';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits: number;
  requiredCredits: number;
  featureName: string;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  currentCredits,
  requiredCredits,
  featureName,
}: InsufficientCreditsModalProps) {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'SOL' | 'USDC'>('SOL');

  const shortfall = requiredCredits - currentCredits;

  // Quick top-up packages that cover the shortfall
  const recommendedPackages = [
    { key: 'QUICK_500', ...CREDIT_PACKAGES.QUICK_500 },
    { key: 'QUICK_1000', ...CREDIT_PACKAGES.QUICK_1000 },
    { key: 'BASIC', ...CREDIT_PACKAGES.BASIC },
    { key: 'ENTERPRISE_10K', ...CREDIT_PACKAGES.ENTERPRISE_10K },
    { key: 'ENTERPRISE_25K', ...CREDIT_PACKAGES.ENTERPRISE_25K },
  ].filter(pkg => pkg.credits >= shortfall);

  // Create Solana payment request
  const createSolanaPayment = useMutation({
    mutationFn: async (data: { packageType: string; paymentMethod: string }) => {
      return await apiRequest('/api/payments/solana/create-payment', {
        method: 'POST',
        body: data,
      } as RequestInit & { body?: any });
    },
    onError: (error: Error) => {
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to create payment request',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  // Verify Solana transaction
  const verifySolanaPayment = useMutation({
    mutationFn: async (data: { signature: string; packageType: string; paymentMethod: string }) => {
      return await apiRequest('/api/payments/solana/verify', {
        method: 'POST',
        body: data,
      } as RequestInit & { body?: any });
    },
    onSuccess: () => {
      toast({
        title: '🎉 Credits Added!',
        description: 'Your credits have been added. You can now proceed.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setIsProcessing(false);
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Payment Verification Failed',
        description: error.message || 'Unable to verify payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  // Handle Phantom wallet payment
  const handlePhantomPayment = async (packageKey: string) => {
    try {
      setIsProcessing(true);
      setSelectedPackage(packageKey);

      // Check if Phantom is installed
      const provider = (window as any).phantom?.solana;
      if (!provider?.isPhantom) {
        toast({
          title: 'Phantom Not Found',
          description: 'Please install Phantom wallet extension',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Connect wallet
      await provider.connect();

      // Create payment request
      const paymentData = await createSolanaPayment.mutateAsync({
        packageType: packageKey,
        paymentMethod: paymentMethod,
      });

      // Deserialize transaction using browser-compatible base64 decoding
      const transactionBytes = Uint8Array.from(atob(paymentData.serializedTransaction), c => c.charCodeAt(0));
      const transaction = Transaction.from(transactionBytes);

      // Send transaction via Phantom
      const { signature } = await provider.signAndSendTransaction(transaction);

      // Wait for blockchain confirmation
      const connection = new Connection(
        import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
      );
      await connection.confirmTransaction(signature, 'confirmed');

      // Verify payment with backend
      await verifySolanaPayment.mutateAsync({
        signature,
        packageType: packageKey,
        paymentMethod: paymentMethod,
      });
    } catch (error: any) {
      console.error('Phantom payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Transaction was not completed',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-insufficient-credits">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">Insufficient Credits</DialogTitle>
              <DialogDescription className="mt-1">
                You need {requiredCredits} credits to use {featureName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Balance:</span>
            <span className="font-semibold">{currentCredits} credits</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Required:</span>
            <span className="font-semibold">{requiredCredits} credits</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shortfall:</span>
            <span className="font-semibold text-orange-500">{shortfall} credits needed</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Quick Top-Up Options</h3>
          
          {/* Payment Method Selection */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={paymentMethod === 'SOL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('SOL')}
              className="flex-1"
              data-testid="button-select-sol"
            >
              <SiSolana className="w-4 h-4 mr-2" />
              SOL
            </Button>
            <Button
              variant={paymentMethod === 'USDC' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod('USDC')}
              className="flex-1"
              data-testid="button-select-usdc"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              USDC
            </Button>
          </div>

          <div className="grid gap-3">
            {recommendedPackages.map((pkg) => (
              <div
                key={pkg.key}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{pkg.name}</h4>
                      {pkg.credits >= shortfall && (
                        <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded">
                          Covers shortfall
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.credits.toLocaleString()} credits • ${pkg.priceUSD}
                      {paymentMethod === 'SOL' && ` (${pkg.priceSol} SOL)`}
                    </p>
                  </div>
                  <Button
                    onClick={() => handlePhantomPayment(pkg.key)}
                    disabled={isProcessing}
                    className="ml-4"
                    data-testid={`button-quick-buy-${pkg.key.toLowerCase()}`}
                  >
                    {isProcessing && selectedPackage === pkg.key ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            data-testid="button-cancel-purchase"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
