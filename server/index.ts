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
import { monitorDatabaseConnections } from "./database-security";
import { setBrowserSecurityHeaders, sanitizeFrontendInputs, validateFrontendInputs, generateCSRFToken } from "./frontend-security";

// Validate environment variables first
validateEnvironment();

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Apply maximum security headers first
app.use(setBrowserSecurityHeaders);
app.use(securityHeaders);

// CORS configuration
app.use(cors(corsOptions));

// Advanced input sanitization and validation
app.use(sanitizeFrontendInputs);
app.use(validateFrontendInputs);
app.use(sanitizeInput);

// NoSQL injection protection (already imported in security.ts)
app.use(sanitizeInput); // This includes mongo-sanitize

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

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Only log basic request info - never log response data for privacy
      const logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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
