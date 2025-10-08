import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { CREDIT_PACKAGES } from '@shared/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Coins, Check, Loader2, Wallet, Clock, ArrowUpRight, ArrowDownRight, Sparkles, Zap, TrendingUp, CreditCard, Crown, Building, Rocket, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { Logo } from '@/components/logo';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
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
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'SOL' | 'USDC'>('SOL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch user data to get current plan
  const { data: userData } = useQuery({
    queryKey: ['/api/auth/me'],
  });

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
      } as RequestInit & { body?: any });
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
      } as RequestInit & { body?: any });
    },
    onSuccess: () => {
      toast({
        title: '🎉 Payment Successful!',
        description: 'Your credits have been added to your account.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
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

  // Reactivate subscription mutation
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/subscriptions/reactivate', {
        method: 'POST',
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Subscription Reactivated! 🎉',
        description: data.message || 'Your subscription has been reactivated and will continue as normal.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/balance'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Reactivation Failed',
        description: error.message || 'Failed to reactivate subscription',
        variant: 'destructive',
      });
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
  const handleSelectPackage = (packageType: string) => {
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

      // Connect to Phantom
      const resp = await window.solana.connect();
      const publicKey = resp.publicKey.toString();

      if (!publicKey) {
        throw new Error('Failed to get wallet public key');
      }

      toast({
        title: 'Wallet Connected',
        description: 'Please approve the transaction in Phantom...',
      });

      // Request backend to create a transaction for this wallet
      const txResponse = await apiRequest('/api/payments/solana/create-transaction', {
        method: 'POST',
        body: {
          fromPubkey: publicKey,
          reference: paymentRequest.reference,
          packageType: selectedPackage,
          paymentMethod,
        },
      } as RequestInit & { body?: any });

      if (!txResponse.serializedTransaction) {
        throw new Error('Failed to create transaction');
      }

      // Deserialize the transaction from base64 (browser-compatible)
      const binaryString = atob(txResponse.serializedTransaction);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create Transaction object from bytes
      const transaction = Transaction.from(bytes);
      
      // Send the Transaction object to Phantom
      const { signature } = await (window.solana as any).signAndSendTransaction(transaction);

      if (!signature) {
        throw new Error('Transaction was not signed or sent');
      }

      toast({
        title: 'Transaction Sent!',
        description: 'Waiting for confirmation...',
      });

      // Wait for transaction confirmation on Solana blockchain
      const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
      const rpcUrl = network === 'mainnet-beta' 
        ? 'https://api.mainnet-beta.solana.com'
        : 'https://api.devnet.solana.com';
      
      const connection = new Connection(rpcUrl, 'confirmed');
      
      // Wait for confirmation (with timeout)
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed on blockchain');
      }

      toast({
        title: 'Transaction Confirmed!',
        description: 'Verifying payment...',
      });

      // Now verify the payment with backend
      verifySolanaPayment.mutate({
        signature,
        packageType: selectedPackage,
        paymentMethod,
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
      setIsProcessing(false); // Reset processing state when creating new payment
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

  const currentBalance = (balanceData as any)?.credits || 0;
  const transactions = ((historyData as any)?.transactions || []) as CreditTransaction[];
  const currentPlan = (userData as any)?.currentPlan || 'FREEMIUM';
  const subscriptionStatus = (userData as any)?.subscriptionStatus || null;
  const nextBillingDate = (userData as any)?.nextBillingDate || null;
  const creditsResetDate = (userData as any)?.creditsResetDate || null;
  const monthlyCreditsUsed = (userData as any)?.monthlyCreditsUsed || 0;

  const packageIcons = {
    FREEMIUM: Sparkles,
    CORE: CreditCard,
    PRO: Crown,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/5 web3:from-background web3:via-primary/20 web3:to-secondary/10">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Logo size="md" showText={true} className="cursor-pointer" />
          </Link>
          <Button variant="ghost" className="gap-2" data-testid="button-back-to-dashboard" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 text-primary dark:text-primary-foreground web3:border-primary/50 web3:shadow-lg web3:shadow-primary/20">
              <Coins className="h-5 w-5" />
              <span className="text-sm font-semibold">Balance: {currentBalance.toLocaleString()} credits</span>
            </div>
            {subscriptionStatus === 'active' && monthlyCreditsUsed > 0 && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-500">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-semibold">Overage: {monthlyCreditsUsed.toLocaleString()} credits</span>
              </div>
            )}
          </div>
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent dark:from-primary dark:via-accent dark:to-primary web3:from-primary web3:via-secondary web3:to-accent web3:animate-pulse">
            {subscriptionStatus === 'active' || subscriptionStatus === 'cancel_at_period_end' ? 'Manage Subscription' : 'Choose Your Plan'}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            {subscriptionStatus === 'active' && nextBillingDate 
              ? `Next billing: ${format(new Date(nextBillingDate), 'MMM dd, yyyy')}` 
              : 'Supercharge your startup journey with AI-powered tools'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => {
            const Icon = packageIcons[key as keyof typeof packageIcons] || Coins;
            const isCurrentPlan = key === currentPlan;
            const isPro = key === 'PRO';
            
            return (
              <Card 
                key={key}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-sm ${
                  isPro ? 'border-2 border-primary shadow-xl shadow-primary/30 dark:shadow-primary/20 web3:border-primary/70 web3:shadow-2xl web3:shadow-primary/40' : 'border border-border/50 hover:border-primary/50'
                } ${
                  isCurrentPlan ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background' : ''
                }`}
                data-testid={`card-${key.toLowerCase()}`}
              >
                {isPro && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                    POPULAR
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-8 w-8 ${isPro ? 'text-primary' : 'text-muted-foreground'}`} />
                    {isCurrentPlan && (
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${pkg.priceUSD}</span>
                    {key !== 'FREEMIUM' && (
                      <span className="text-sm text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription className="text-lg font-semibold text-foreground">
                    {pkg.credits.toLocaleString()} {key !== 'FREEMIUM' ? 'Credits/month' : 'Credits'}
                  </CardDescription>
                  {key !== 'FREEMIUM' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      + unlimited overage usage tracked monthly
                    </p>
                  )}
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
                  {isCurrentPlan ? (
                    subscriptionStatus === 'cancel_at_period_end' ? (
                      <Button 
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => reactivateSubscriptionMutation.mutate()}
                        disabled={reactivateSubscriptionMutation.isPending}
                        data-testid="button-reactivate-plan"
                      >
                        {reactivateSubscriptionMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        disabled
                        data-testid="button-current-plan"
                      >
                        Current Plan
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={() => handleSelectPackage(key)}
                      className={`w-full ${isPro ? 'bg-primary' : ''}`}
                      data-testid={`button-select-${key.toLowerCase()}`}
                      disabled={key === 'FREEMIUM'}
                    >
                      {key === 'FREEMIUM' ? 'Free Plan' : 'Subscribe Now'}
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
                {selectedPackage && `${(CREDIT_PACKAGES as any)[selectedPackage].name} Package • ${(CREDIT_PACKAGES as any)[selectedPackage].credits.toLocaleString()} credits`}
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
                    setIsProcessing(false); // Reset processing state
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
                    setIsProcessing(false); // Reset processing state
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
