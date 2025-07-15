import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { detectWallets, connectEthereum, connectPhantom, signMessage, generateAuthMessage, WalletInfo } from '@/lib/wallet';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface WalletConnectProps {
  onSuccess?: (walletInfo: WalletInfo) => void;
  onError?: (error: string) => void;
}

export default function WalletConnect({ onSuccess, onError }: WalletConnectProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<WalletInfo | null>(null);
  const { toast } = useToast();

  const availableWallets = detectWallets();

  // Wallet authentication mutation
  const walletAuthMutation = useMutation({
    mutationFn: async ({ walletInfo, signature, message }: { 
      walletInfo: WalletInfo; 
      signature: string; 
      message: string; 
    }) => {
      return apiRequest('/api/auth/wallet', {
        method: 'POST',
        body: {
          address: walletInfo.address,
          chainId: walletInfo.chainId,
          wallet: walletInfo.wallet,
          signature,
          message
        }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Wallet connected successfully!",
        description: `Connected with ${connectedWallet?.wallet}`,
      });
      if (onSuccess && connectedWallet) {
        onSuccess(connectedWallet);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to authenticate wallet";
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
      if (onError) {
        onError(errorMessage);
      }
    }
  });

  const handleWalletConnect = async (walletKey: string) => {
    setSelectedWallet(walletKey);
    
    try {
      let walletInfo: WalletInfo;
      
      // Connect based on wallet type
      if (walletKey === 'phantom') {
        walletInfo = await connectPhantom();
      } else {
        walletInfo = await connectEthereum();
      }
      
      setConnectedWallet(walletInfo);
      
      // Generate authentication message and sign it
      const nonce = Math.random().toString(36).substring(7);
      const message = generateAuthMessage(walletInfo.address, nonce);
      const signature = await signMessage(walletInfo.address, message, walletInfo.wallet);
      
      // Authenticate with backend
      await walletAuthMutation.mutateAsync({ walletInfo, signature, message });
      
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
      setSelectedWallet(null);
      setConnectedWallet(null);
    }
  };

  if (availableWallets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            No Wallets Detected
          </CardTitle>
          <CardDescription>
            Install a Web3 wallet to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Popular wallet options:
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => window.open('https://metamask.io', '_blank')}>
              🦊 Install MetaMask
            </Button>
            <Button variant="outline" onClick={() => window.open('https://rabby.io', '_blank')}>
              🐰 Install Rabby
            </Button>
            <Button variant="outline" onClick={() => window.open('https://phantom.app', '_blank')}>
              👻 Install Phantom
            </Button>
            <Button variant="outline" onClick={() => window.open('https://walletconnect.com', '_blank')}>
              🔗 WalletConnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Choose your preferred wallet to connect
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectedWallet ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <div className="font-medium text-green-900">Wallet Connected</div>
              <div className="text-sm text-green-700">
                {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
              </div>
            </div>
            <Badge variant="secondary">{connectedWallet.wallet}</Badge>
          </div>
        ) : (
          <div className="grid gap-3">
            {availableWallets.map((wallet) => (
              <Button
                key={wallet.key}
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => handleWalletConnect(wallet.key)}
                disabled={walletAuthMutation.isPending}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{wallet.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {wallet.key === 'phantom' ? 'Solana wallet' : 'Ethereum wallet'}
                    </div>
                  </div>
                  {selectedWallet === wallet.key && walletAuthMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}
        
        {walletAuthMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Authenticating wallet...
          </div>
        )}
      </CardContent>
    </Card>
  );
}