import 'express-session';

declare module 'express-session' {
  interface SessionData {
    authChallenges?: {
      [nonce: string]: {
        timestamp: number;
        origin: string;
        used: boolean;
      };
    };
    userId?: number;
    csrfToken?: string;
  }
}

declare module '@paypal/checkout-server-sdk' {
  export const core: any;
  export const orders: any;
}
