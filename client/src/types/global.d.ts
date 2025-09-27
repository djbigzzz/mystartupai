// Web3 wallet type declarations
interface Window {
  // Phantom Solana Wallet
  solana?: {
    isPhantom?: boolean;
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
    publicKey?: { toString(): string };
  };
  
  // Ethereum wallets (MetaMask, WalletConnect, etc.)
  ethereum?: {
    request(args: { method: string; params?: any[] }): Promise<any>;
    selectedAddress?: string;
    chainId?: string;
    on?(event: string, callback: (...args: any[]) => void): void;
    removeListener?(event: string, callback: (...args: any[]) => void): void;
    isMetaMask?: boolean;
  };
}