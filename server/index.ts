import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import {
  securityHeaders,
  rateLimiter,
  corsOptions,
  sanitizeInput,
  secureSessionConfig,
  validateEnvironment,
  secureRequestLogger,
  secureErrorHandler
} from "./security";

// Validate environment variables first
validateEnvironment();

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Apply security headers first
app.use(securityHeaders);

// CORS configuration
app.use(cors(corsOptions));

// Input sanitization
app.use(sanitizeInput);

// Body parsing with strict limits
app.use(express.json({ 
  limit: '1mb', // Reduced from 10mb for security
  strict: true
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: '1mb',
  parameterLimit: 100 // Limit URL parameters
}));

// Rate limiting (more permissive for development)
if (process.env.NODE_ENV !== 'development') {
  app.use(rateLimiter);
}

// Secure request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(secureRequestLogger);
}

// Session middleware with enhanced security
app.use(session(secureSessionConfig));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Secure error handling
  app.use(secureErrorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
