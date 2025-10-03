import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { CREDIT_PACKAGES } from '@shared/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Coins, Check, Loader2, Wallet, QrCode, CreditCard, Clock, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
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
    paypal?: any;
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
  const paypalButtonRef = useRef<HTMLDivElement>(null);
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
        title: 'Payment Successful!',
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

  // Create PayPal order
  const createPayPalOrder = useMutation({
    mutationFn: async (packageType: string) => {
      return await apiRequest('/api/payments/paypal/create-order', {
        method: 'POST',
        body: { packageType },
      });
    },
  });

  // Capture PayPal payment
  const capturePayPalPayment = useMutation({
    mutationFn: async (data: { orderId: string; packageType: string }) => {
      return await apiRequest('/api/payments/paypal/capture', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Payment Successful!',
        description: 'Your credits have been added to your account.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits/history'] });
      setIsPaymentModalOpen(false);
      resetPaymentState();
    },
    onError: (error: Error) => {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to complete payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  // Generate QR code for Solana Pay using a QR code API
  const generateQRCode = async (url: string) => {
    try {
      // Use a free QR code API service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
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

  // Handle Solana Pay tab selection
  const handleSolanaPayTab = () => {
    if (selectedPackage && !paymentRequest) {
      createSolanaPayment.mutate({
        packageType: selectedPackage,
        paymentMethod,
      });
    }
  };

  // Handle payment method toggle (SOL/USDC)
  const handlePaymentMethodChange = (method: 'SOL' | 'USDC') => {
    setPaymentMethod(method);
    if (selectedPackage) {
      createSolanaPayment.mutate({
        packageType: selectedPackage,
        paymentMethod: method,
      });
    }
  };

  // Pay with Phantom wallet
  const handlePayWithWallet = async () => {
    if (!window.solana) {
      toast({
        title: 'Phantom Wallet Not Found',
        description: 'Please install Phantom wallet to continue.',
        variant: 'destructive',
      });
      window.open('https://phantom.app/', '_blank');
      return;
    }

    if (!paymentRequest) return;

    setIsProcessing(true);

    try {
      // Connect to Phantom
      const response = await window.solana.connect();
      const publicKey = new PublicKey(response.publicKey.toString());

      // Parse Solana Pay URL
      const url = new URL(paymentRequest.url);
      const recipient = new PublicKey(url.searchParams.get('recipient')!);
      const amount = new BigNumber(url.searchParams.get('amount')!);
      const reference = new PublicKey(url.searchParams.get('reference')!);

      // Create transaction
      const connection = new Connection(
        import.meta.env.VITE_SOLANA_RPC || 'https://api.devnet.solana.com',
        'confirmed'
      );

      // Create a simple transfer instruction
      const { Transaction: SolanaTransaction, SystemProgram } = await import('@solana/web3.js');
      const transaction = new SolanaTransaction();
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount.times(1e9).toNumber(), // Convert SOL to lamports
        })
      );

      // Add reference as a key
      transaction.add({
        keys: [{ pubkey: reference, isSigner: false, isWritable: false }],
        programId: new PublicKey('11111111111111111111111111111111'),
        data: Buffer.from([]),
      } as any);

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send transaction
      const signed = await window.solana.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());

      toast({
        title: 'Transaction Sent',
        description: 'Waiting for confirmation...',
      });

      // Start polling for confirmation
      startTransactionPolling(signature);
    } catch (error: any) {
      console.error('Wallet payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to complete wallet payment',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  // Start polling for transaction confirmation
  const startTransactionPolling = (signature: string) => {
    let attempts = 0;
    const maxAttempts = 60; // Poll for up to 1 minute

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;

      if (attempts > maxAttempts) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        toast({
          title: 'Verification Timeout',
          description: 'Transaction is taking longer than expected. Please check your transaction history.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      try {
        await verifySolanaPayment.mutateAsync({
          signature,
          packageType: selectedPackage!,
          paymentMethod,
        });

        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        setIsProcessing(false);
      } catch (error) {
        // Continue polling if verification fails
      }
    }, 1000); // Poll every second
  };

  // Initialize PayPal button
  useEffect(() => {
    if (!isPaymentModalOpen || !selectedPackage || !paypalButtonRef.current) return;

    // Load PayPal SDK
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sandbox'}&currency=USD`;
      script.async = true;
      script.onload = () => renderPayPalButton();
      document.body.appendChild(script);
    } else {
      renderPayPalButton();
    }
  }, [isPaymentModalOpen, selectedPackage]);

  // Render PayPal button
  const renderPayPalButton = () => {
    if (!window.paypal || !paypalButtonRef.current || !selectedPackage) return;

    // Clear existing button
    paypalButtonRef.current.innerHTML = '';

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          const result = await createPayPalOrder.mutateAsync(selectedPackage);
          return result.orderId;
        } catch (error) {
          console.error('Error creating PayPal order:', error);
          throw error;
        }
      },
      onApprove: async (data: any) => {
        setIsProcessing(true);
        try {
          await capturePayPalPayment.mutateAsync({
            orderId: data.orderID,
            packageType: selectedPackage,
          });
        } catch (error) {
          console.error('Error capturing PayPal payment:', error);
        } finally {
          setIsProcessing(false);
        }
      },
      onError: (error: any) => {
        console.error('PayPal error:', error);
        toast({
          title: 'PayPal Error',
          description: 'Unable to process PayPal payment',
          variant: 'destructive',
        });
      },
    }).render(paypalButtonRef.current);
  };

  // Reset payment state
  const resetPaymentState = () => {
    setSelectedPackage(null);
    setPaymentRequest(null);
    setQrCodeDataUrl('');
    setIsProcessing(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const currentCredits = (balanceData as any)?.credits || 0;
  const transactions: CreditTransaction[] = (historyData as any)?.transactions || [];

  return (
    <div className="min-h-screen bg-background" data-testid="page-purchase-credits">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="heading-purchase-credits">
                Purchase Credits
              </h1>
              <p className="text-muted-foreground">
                Choose a plan and power your startup journey with AI credits
              </p>
            </div>
            <Card className="px-6 py-4">
              <div className="flex items-center gap-3">
                <Coins className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold" data-testid="text-current-balance">
                    {isLoadingBalance ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `${currentCredits.toLocaleString()} credits`
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => {
            const isCurrent = key === 'FREEMIUM';
            const isSelectable = key === 'BASIC' || key === 'PRO';

            return (
              <Card
                key={key}
                className={`relative ${isCurrent ? 'border-primary' : ''}`}
                data-testid={`card-package-${key.toLowerCase()}`}
              >
                {isCurrent && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                    data-testid="badge-current-plan"
                  >
                    Current Plan
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl" data-testid={`text-package-name-${key.toLowerCase()}`}>
                    {pkg.name}
                  </CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground" data-testid={`text-price-usd-${key.toLowerCase()}`}>
                      ${pkg.priceUSD}
                    </span>
                    {pkg.priceSol > 0 && (
                      <span className="text-sm ml-2 text-muted-foreground" data-testid={`text-price-sol-${key.toLowerCase()}`}>
                        (~{pkg.priceSol} SOL)
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-lg font-semibold mb-2" data-testid={`text-credits-${key.toLowerCase()}`}>
                      {pkg.credits.toLocaleString()} Credits
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2" data-testid={`feature-${key.toLowerCase()}-${idx}`}>
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSelectable ? (
                    <Button
                      className="w-full"
                      onClick={() => handleSelectPackage(key as 'BASIC' | 'PRO')}
                      data-testid={`button-select-${key.toLowerCase()}`}
                    >
                      Select Plan
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled data-testid="button-current-plan">
                      Current Plan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Transaction History */}
        <Card data-testid="section-transaction-history">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingHistory ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-no-transactions">
                No transactions yet
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Amount</th>
                      <th className="text-right py-3 px-4">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b" data-testid={`row-transaction-${tx.id}`}>
                        <td className="py-3 px-4 text-sm" data-testid={`text-date-${tx.id}`}>
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-3 px-4" data-testid={`badge-type-${tx.id}`}>
                          <Badge variant={tx.type === 'purchase' ? 'default' : 'secondary'}>
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm" data-testid={`text-description-${tx.id}`}>
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 text-right" data-testid={`text-amount-${tx.id}`}>
                          <span className={`flex items-center justify-end gap-1 ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.amount > 0 ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium" data-testid={`text-balance-${tx.id}`}>
                          {tx.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Modal */}
        <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
          <DialogContent className="max-w-2xl" data-testid="dialog-payment">
            <DialogHeader>
              <DialogTitle data-testid="heading-payment-modal">
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription>
                {selectedPackage && `${CREDIT_PACKAGES[selectedPackage].name} Package - ${CREDIT_PACKAGES[selectedPackage].credits.toLocaleString()} credits`}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="solana" className="w-full" data-testid="tabs-payment-methods">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="solana" onClick={handleSolanaPayTab} data-testid="tab-solana-pay">
                  <Wallet className="w-4 h-4 mr-2" />
                  Solana Pay (Primary)
                </TabsTrigger>
                <TabsTrigger value="paypal" data-testid="tab-paypal">
                  <CreditCard className="w-4 h-4 mr-2" />
                  PayPal (Fallback)
                </TabsTrigger>
              </TabsList>

              {/* Solana Pay Tab */}
              <TabsContent value="solana" className="space-y-4" data-testid="content-solana-pay">
                {/* Payment Method Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={paymentMethod === 'SOL' ? 'default' : 'outline'}
                    onClick={() => handlePaymentMethodChange('SOL')}
                    className="flex-1"
                    data-testid="button-payment-method-sol"
                  >
                    Pay with SOL
                  </Button>
                  <Button
                    variant={paymentMethod === 'USDC' ? 'default' : 'outline'}
                    onClick={() => handlePaymentMethodChange('USDC')}
                    className="flex-1"
                    data-testid="button-payment-method-usdc"
                  >
                    Pay with USDC
                  </Button>
                </div>

                {createSolanaPayment.isPending ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <p className="text-muted-foreground">Creating payment request...</p>
                  </div>
                ) : paymentRequest ? (
                  <div className="space-y-4">
                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        {qrCodeDataUrl ? (
                          <img
                            src={qrCodeDataUrl}
                            alt="Solana Pay QR Code"
                            className="w-64 h-64"
                            data-testid="img-qr-code"
                          />
                        ) : (
                          <div className="w-64 h-64 flex items-center justify-center">
                            <Loader2 className="w-12 h-12 animate-spin" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Scan with a Solana wallet app
                      </p>
                    </div>

                    {/* Wallet Button */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">or</p>
                      <Button
                        size="lg"
                        onClick={handlePayWithWallet}
                        disabled={isProcessing}
                        className="w-full"
                        data-testid="button-pay-with-wallet"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-4 h-4 mr-2" />
                            Pay with Phantom Wallet
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">{paymentRequest.amount} {paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credits:</span>
                        <span className="font-medium">
                          {selectedPackage && CREDIT_PACKAGES[selectedPackage].credits.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </TabsContent>

              {/* PayPal Tab */}
              <TabsContent value="paypal" className="space-y-4" data-testid="content-paypal">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete your purchase securely with PayPal
                  </p>
                  <div ref={paypalButtonRef} data-testid="container-paypal-button" />
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
