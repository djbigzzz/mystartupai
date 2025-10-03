import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { CREDIT_PACKAGES } from '@shared/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Coins, Check, Loader2, Wallet, Clock, ArrowUpRight, ArrowDownRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      signTransaction(transaction: any): Promise<any>;
      signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
      publicKey?: { toString(): string };
    };
  }
}

interface CreditTransaction {
  id: number;
  type: string;
  amount: number;
  balance: number;
  description: string;
  paymentMethod?: string;
  paymentAmount?: string;
  currency?: string;
  featureUsed?: string;
  createdAt: string;
}

interface PaymentRequest {
  url: string;
  reference: string;
  amount: string;
  packageType: string;
  paymentMethod: string;
  recipient: string;
}

export default function PurchaseCreditsPage() {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<'BASIC' | 'PRO' | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'SOL' | 'USDC'>('SOL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current credit balance
  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['/api/credits/balance'],
  });

  // Fetch transaction history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['/api/credits/history'],
  });

  // Create Solana payment request
  const createSolanaPayment = useMutation({
    mutationFn: async (data: { packageType: string; paymentMethod: string }) => {
      return await apiRequest('/api/payments/solana/create-payment', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (data) => {
      setPaymentRequest(data);
      generateQRCode(data.url);
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
      });
    },
    onSuccess: () => {
      toast({
        title: '🎉 Payment Successful!',
        description: 'Your credits have been added to your account.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/history'] });
      setIsPaymentModalOpen(false);
      resetPaymentState();
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

  // Generate QR code for Solana Pay using a QR code API
  const generateQRCode = async (url: string) => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
      setQrCodeDataUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Handle package selection
  const handleSelectPackage = (packageType: 'BASIC' | 'PRO') => {
    setSelectedPackage(packageType);
    setIsPaymentModalOpen(true);
  };

  // Reset payment state
  const resetPaymentState = () => {
    setSelectedPackage(null);
    setPaymentRequest(null);
    setQrCodeDataUrl('');
    setIsProcessing(false);
    setPaymentMethod('SOL');
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Handle Phantom wallet payment
  const handlePhantomPayment = async () => {
    if (!paymentRequest || !selectedPackage) return;

    try {
      setIsProcessing(true);

      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: 'Phantom Not Found',
          description: 'Please install the Phantom wallet extension.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      await window.solana.connect();
      const publicKey = window.solana.publicKey?.toString();

      if (!publicKey) {
        throw new Error('Failed to get wallet public key');
      }

      // Poll for payment confirmation
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const statusResponse = await apiRequest(
            `/api/payments/solana/status/${paymentRequest.reference}`,
            { method: 'GET' }
          );

          if (statusResponse.status === 'confirmed') {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            verifySolanaPayment.mutate({
              signature: statusResponse.signature,
              packageType: selectedPackage,
              paymentMethod,
            });
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000);

      toast({
        title: 'Awaiting Payment',
        description: 'Please complete the transaction in your Phantom wallet.',
      });
    } catch (error) {
      console.error('Phantom payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  // Auto-trigger Solana payment creation when modal opens
  useEffect(() => {
    if (isPaymentModalOpen && selectedPackage && !paymentRequest) {
      createSolanaPayment.mutate({
        packageType: selectedPackage,
        paymentMethod,
      });
    }
  }, [isPaymentModalOpen, selectedPackage]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const currentBalance = balanceData?.balance || 0;
  const transactions = (historyData?.transactions || []) as CreditTransaction[];

  const packageIcons = {
    FREEMIUM: Sparkles,
    BASIC: Zap,
    PRO: TrendingUp,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Coins className="h-5 w-5" />
            <span className="text-sm font-medium">Current Balance: {currentBalance.toLocaleString()} credits</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Purchase Credits
          </h1>
          <p className="text-muted-foreground">Choose a plan and supercharge your startup journey</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => {
            const Icon = packageIcons[key as keyof typeof packageIcons];
            const isFreemium = key === 'FREEMIUM';
            const isPro = key === 'PRO';
            
            return (
              <Card 
                key={key}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  isPro ? 'border-primary shadow-primary/20' : ''
                }`}
                data-testid={`card-${key.toLowerCase()}`}
              >
                {isPro && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${isPro ? 'text-primary' : 'text-muted-foreground'}`} />
                    {isFreemium && (
                      <Badge variant="secondary" className="text-xs">Current Plan</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${pkg.priceUSD}</span>
                    {!isFreemium && pkg.solPrice && (
                      <span className="text-sm text-muted-foreground">≈{pkg.solPrice} SOL</span>
                    )}
                  </div>
                  <CardDescription className="text-lg font-semibold text-foreground">
                    {pkg.credits.toLocaleString()} Credits
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  {isFreemium ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                      data-testid="button-current-plan"
                    >
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSelectPackage(key as 'BASIC' | 'PRO')}
                      className={`w-full ${isPro ? 'bg-primary' : ''}`}
                      data-testid={`button-select-${key.toLowerCase()}`}
                    >
                      Select Plan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Your recent credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    data-testid={`transaction-${tx.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {tx.type === 'CREDIT' ? (
                        <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <ArrowDownRight className="h-4 w-4 text-blue-500" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy • HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-blue-500'}`}>
                        {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Balance: {tx.balance.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={(open) => {
          if (!open) resetPaymentState();
          setIsPaymentModalOpen(open);
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription>
                {selectedPackage && `${CREDIT_PACKAGES[selectedPackage].name} Package • ${CREDIT_PACKAGES[selectedPackage].credits.toLocaleString()} credits`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Payment Method Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === 'SOL' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    setPaymentMethod('SOL');
                    if (selectedPackage) {
                      createSolanaPayment.mutate({
                        packageType: selectedPackage,
                        paymentMethod: 'SOL',
                      });
                    }
                  }}
                  data-testid="button-sol"
                >
                  Pay with SOL
                </Button>
                <Button
                  variant={paymentMethod === 'USDC' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    setPaymentMethod('USDC');
                    if (selectedPackage) {
                      createSolanaPayment.mutate({
                        packageType: selectedPackage,
                        paymentMethod: 'USDC',
                      });
                    }
                  }}
                  data-testid="button-usdc"
                >
                  Pay with USDC
                </Button>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <div className="flex flex-col items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="bg-white p-3 rounded-lg">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Solana Pay QR Code" 
                      className="w-48 h-48"
                      data-testid="img-qr-code"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Scan with your Solana wallet
                  </p>
                </div>
              )}

              {/* Phantom Wallet Button */}
              <Button
                onClick={handlePhantomPayment}
                disabled={isProcessing || !paymentRequest}
                className="w-full"
                size="lg"
                data-testid="button-phantom-payment"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Pay with Phantom Wallet
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
