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
  export namespace core {
    export class PayPalHttpClient {
      constructor(environment: any);
      execute(request: any): Promise<any>;
    }
    export class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    export class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
  }
  
  export namespace orders {
    export class OrdersCreateRequest {
      constructor();
      prefer(value: string): void;
      requestBody(body: any): void;
    }
    export class OrdersCaptureRequest {
      constructor(orderId: string);
    }
  }
}
