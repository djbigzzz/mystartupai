import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  chainId: number;
  wallet: string;
}

// Wallet detection
export const detectWallets = () => {
  const wallets = [];
  
  if (typeof window !== 'undefined') {
    // MetaMask
    if (window.ethereum?.isMetaMask) {
      wallets.push({ name: 'MetaMask', key: 'metamask', icon: '🦊' });
    }
    
    // Rabby
    if (window.ethereum?.isRabby) {
      wallets.push({ name: 'Rabby', key: 'rabby', icon: '🐰' });
    }
    
    // General Ethereum wallet
    if (window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isRabby) {
      wallets.push({ name: 'Ethereum Wallet', key: 'ethereum', icon: '⚡' });
    }
    
    // Phantom (Solana)
    if (window.solana?.isPhantom) {
      wallets.push({ name: 'Phantom', key: 'phantom', icon: '👻' });
    }
  }
  
  return wallets;
};

// Connect to MetaMask/Rabby
export const connectEthereum = async (): Promise<WalletInfo> => {
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet found. Please install MetaMask or Rabby.');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    
    return {
      address,
      chainId: Number(network.chainId),
      wallet: window.ethereum.isMetaMask ? 'metamask' : window.ethereum.isRabby ? 'rabby' : 'ethereum'
    };
  } catch (error: any) {
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

// Connect to Phantom (Solana)
export const connectPhantom = async (): Promise<WalletInfo> => {
  if (!window.solana?.isPhantom) {
    throw new Error('Phantom wallet not found. Please install Phantom.');
  }

  try {
    const response = await window.solana.connect();
    return {
      address: response.publicKey.toString(),
      chainId: 101, // Solana mainnet
      wallet: 'phantom'
    };
  } catch (error: any) {
    throw new Error(`Failed to connect Phantom: ${error.message}`);
  }
};

// Sign message for authentication
export const signMessage = async (address: string, message: string, walletType: string): Promise<string> => {
  if (walletType === 'phantom') {
    if (!window.solana) throw new Error('Phantom wallet not available');
    
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
    return Array.from(signedMessage.signature).map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    if (!window.ethereum) throw new Error('Ethereum wallet not available');
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  }
};

// Generate authentication message
export const generateAuthMessage = (address: string, nonce: string): string => {
  return `Welcome to MyStartup.ai!\n\nPlease sign this message to authenticate your wallet.\n\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
};

// Wallet types for TypeScript
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}