import { 
  Connection, 
  Transaction, 
  PublicKey, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
  VersionedTransaction
} from '@solana/web3.js';

const GATEWAY_BASE_URL = 'https://tpg.sanctum.so';
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

// Gateway tip destinations (random selection for load balancing)
const TIP_DESTINATIONS = [
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT'
];

interface GatewayOptimizeParams {
  cuPriceRange?: 'low' | 'medium' | 'high' | 'veryHigh';
  jitoTipRange?: 'low' | 'medium' | 'high' | 'veryHigh';
  expireInSlots?: number;
  encoding?: 'base64' | 'base58';
}

interface GatewayOptimizeResponse {
  transaction: string;
  latestBlockhash: {
    blockhash: string;
    lastValidBlockHeight: string;
  };
}

interface GatewaySendResponse {
  result: string; // Transaction signature
}

interface GatewayMetrics {
  optimizeAttempts: number;
  optimizeSuccesses: number;
  optimizeFailures: number;
  sendAttempts: number;
  sendSuccesses: number;
  sendFailures: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
}

export class GatewayService {
  private network: string;
  private apiKey: string;
  private metrics: GatewayMetrics;

  constructor() {
    this.network = process.env.SOLANA_NETWORK || 'devnet';
    this.apiKey = GATEWAY_API_KEY || '';
    this.metrics = {
      optimizeAttempts: 0,
      optimizeSuccesses: 0,
      optimizeFailures: 0,
      sendAttempts: 0,
      sendSuccesses: 0,
      sendFailures: 0,
      totalLatencyMs: 0,
      averageLatencyMs: 0,
    };
    
    if (!this.apiKey) {
      console.warn('[Gateway] API key not configured - Gateway features disabled');
    } else {
      console.log(`[Gateway] Service initialized - Network: ${this.network}`);
    }
  }

  private logMetrics(): void {
    const totalAttempts = this.metrics.optimizeAttempts + this.metrics.sendAttempts;
    if (totalAttempts > 0) {
      this.metrics.averageLatencyMs = Math.round(this.metrics.totalLatencyMs / totalAttempts);
    }
    
    console.log('[Gateway Metrics]', {
      optimize: {
        attempts: this.metrics.optimizeAttempts,
        successes: this.metrics.optimizeSuccesses,
        failures: this.metrics.optimizeFailures,
        successRate: this.metrics.optimizeAttempts > 0 
          ? `${((this.metrics.optimizeSuccesses / this.metrics.optimizeAttempts) * 100).toFixed(1)}%`
          : 'N/A'
      },
      send: {
        attempts: this.metrics.sendAttempts,
        successes: this.metrics.sendSuccesses,
        failures: this.metrics.sendFailures,
        successRate: this.metrics.sendAttempts > 0 
          ? `${((this.metrics.sendSuccesses / this.metrics.sendAttempts) * 100).toFixed(1)}%`
          : 'N/A'
      },
      performance: {
        totalLatency: `${this.metrics.totalLatencyMs}ms`,
        avgLatency: `${this.metrics.averageLatencyMs}ms`
      }
    });
  }

  getMetrics(): GatewayMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      optimizeAttempts: 0,
      optimizeSuccesses: 0,
      optimizeFailures: 0,
      sendAttempts: 0,
      sendSuccesses: 0,
      sendFailures: 0,
      totalLatencyMs: 0,
      averageLatencyMs: 0,
    };
    console.log('[Gateway] Metrics reset');
  }

  private getGatewayUrl(): string {
    return `${GATEWAY_BASE_URL}/${this.network}?apiKey=${this.apiKey}`;
  }

  private getGatewayV1Url(): string {
    return `${GATEWAY_BASE_URL}/v1/${this.network}?apiKey=${this.apiKey}`;
  }

  /**
   * Optimize a transaction using Gateway
   */
  async optimizeTransaction(
    transaction: Transaction | VersionedTransaction,
    params?: GatewayOptimizeParams
  ): Promise<GatewayOptimizeResponse> {
    const startTime = Date.now();
    this.metrics.optimizeAttempts++;
    
    try {
      if (!this.apiKey) {
        throw new Error('Gateway API key not configured');
      }

      console.log('[Gateway] Optimizing transaction', {
        cuPriceRange: params?.cuPriceRange || 'medium',
        jitoTipRange: params?.jitoTipRange || 'medium',
        expireInSlots: params?.expireInSlots || 150
      });

      // Serialize transaction to base64
      const serialized = transaction.serialize({ requireAllSignatures: false });
      const base64Tx = Buffer.from(serialized).toString('base64');

      const response = await fetch(this.getGatewayUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `optimize-${Date.now()}`,
          method: 'optimizeTransaction',
          params: {
            transactions: [
              {
                params: [
                  base64Tx,
                  {
                    cuPriceRange: params?.cuPriceRange || 'medium',
                    jitoTipRange: params?.jitoTipRange || 'medium',
                    expireInSlots: params?.expireInSlots || 150,
                    encoding: 'base64',
                    ...params
                  }
                ]
              }
            ]
          }
        })
      });

      const latency = Date.now() - startTime;
      this.metrics.totalLatencyMs += latency;

      if (!response.ok) {
        this.metrics.optimizeFailures++;
        console.error('[Gateway] Optimize failed', {
          status: response.status,
          statusText: response.statusText,
          latency: `${latency}ms`
        });
        throw new Error(`Gateway optimize failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        this.metrics.optimizeFailures++;
        console.error('[Gateway] Optimize error', {
          code: data.error.code,
          message: data.error.message,
          latency: `${latency}ms`
        });
        throw new Error(`Gateway optimize error: ${data.error.code}`);
      }

      this.metrics.optimizeSuccesses++;
      console.log('[Gateway] Transaction optimized successfully', {
        latency: `${latency}ms`,
        blockhash: data.result[0].latestBlockhash.blockhash.slice(0, 8) + '...'
      });

      return data.result[0];
    } catch (error) {
      const latency = Date.now() - startTime;
      this.metrics.optimizeFailures++;
      console.error('[Gateway] Optimize exception', {
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: `${latency}ms`
      });
      throw error;
    } finally {
      // Log metrics every 10 operations
      if ((this.metrics.optimizeAttempts + this.metrics.sendAttempts) % 10 === 0) {
        this.logMetrics();
      }
    }
  }

  /**
   * Send an optimized transaction using Gateway's delivery methods
   */
  async sendTransaction(
    serializedTransaction: string,
    startSlot?: number
  ): Promise<string> {
    const startTime = Date.now();
    this.metrics.sendAttempts++;
    
    try {
      if (!this.apiKey) {
        throw new Error('Gateway API key not configured');
      }

      console.log('[Gateway] Sending transaction', {
        startSlot: startSlot || 'auto',
        txLength: serializedTransaction.length
      });

      const response = await fetch(this.getGatewayV1Url(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: `send-${Date.now()}`,
          method: 'sendTransaction',
          params: [
            serializedTransaction,
            {
              encoding: 'base64',
              ...(startSlot ? { startSlot } : {})
            }
          ]
        })
      });

      const latency = Date.now() - startTime;
      this.metrics.totalLatencyMs += latency;

      if (!response.ok) {
        this.metrics.sendFailures++;
        console.error('[Gateway] Send failed', {
          status: response.status,
          statusText: response.statusText,
          latency: `${latency}ms`
        });
        throw new Error(`Gateway send failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        this.metrics.sendFailures++;
        console.error('[Gateway] Send error', {
          code: data.error.code,
          message: data.error.message,
          latency: `${latency}ms`
        });
        throw new Error(`Gateway send error: ${data.error.code}`);
      }

      this.metrics.sendSuccesses++;
      console.log('[Gateway] Transaction sent successfully', {
        signature: data.result.slice(0, 16) + '...',
        latency: `${latency}ms`
      });

      return data.result;
    } catch (error) {
      const latency = Date.now() - startTime;
      this.metrics.sendFailures++;
      console.error('[Gateway] Send exception', {
        error: error instanceof Error ? error.message : 'Unknown error',
        latency: `${latency}ms`
      });
      throw error;
    } finally {
      // Log metrics every 10 operations
      if ((this.metrics.optimizeAttempts + this.metrics.sendAttempts) % 10 === 0) {
        this.logMetrics();
      }
    }
  }

  /**
   * Complete flow: optimize and send a transaction
   */
  async optimizeAndSend(
    transaction: Transaction,
    signer: Keypair,
    optimizeParams?: GatewayOptimizeParams
  ): Promise<string> {
    // Step 1: Optimize transaction
    const optimized = await this.optimizeTransaction(transaction, optimizeParams);

    // Step 2: Deserialize and sign
    const txBuffer = Buffer.from(optimized.transaction, 'base64');
    const tx = Transaction.from(txBuffer);
    tx.sign(signer);

    // Step 3: Send via Gateway
    const serialized = tx.serialize().toString('base64');
    const signature = await this.sendTransaction(serialized);

    return signature;
  }

  /**
   * Send SOL transfer via Gateway (example use case)
   */
  async sendSolTransfer(
    from: Keypair,
    to: PublicKey,
    amount: number,
    optimizeParams?: GatewayOptimizeParams
  ): Promise<string> {
    const connection = new Connection(
      this.network === 'mainnet-beta' 
        ? 'https://api.mainnet-beta.solana.com' 
        : 'https://api.devnet.solana.com',
      'confirmed'
    );

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = from.publicKey;

    return this.optimizeAndSend(transaction, from, optimizeParams);
  }

  /**
   * Get transaction status via Gateway RPC
   */
  async getTransactionStatus(signature: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gateway API key not configured');
    }

    const response = await fetch(this.getGatewayUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `status-${Date.now()}`,
        method: 'getSignatureStatus',
        params: [signature, { searchTransactionHistory: true }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gateway status check failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  }

  /**
   * Check if Gateway is configured and available
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const gatewayService = new GatewayService();
