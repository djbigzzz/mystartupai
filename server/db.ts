import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with proper limits and timeouts
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Timeout after 5 seconds if unable to connect
});

export const db = drizzle({ client: pool, schema });

// Add error handling for pool events
pool.on('error', (err) => {
  console.error('🚨 Database pool error:', err);
});

pool.on('connect', (client) => {
  console.log('🔗 Database client connected');
});

pool.on('remove', (client) => {
  console.log('💔 Database client disconnected');
});

// Database operation wrapper with retry logic - ONLY for read operations and idempotent writes
export async function withRetryRead<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection-related error
      const isConnectionError = 
        error?.code === '57P01' || // terminating connection due to administrator command
        error?.code === 'ECONNRESET' || 
        error?.code === 'ECONNREFUSED' ||
        error?.message?.includes('connection') ||
        error?.message?.includes('Connection') ||
        error?.message?.includes('terminating');
      
      if (!isConnectionError || attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`🔄 Database read operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms:`, {
        error: error.message,
        code: error.code
      });
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw lastError;
}