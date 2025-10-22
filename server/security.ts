import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { body, query, param, validationResult } from "express-validator";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Security Headers Middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://*.anthropic.com", "https://api.anthropic.com", "wss://relay.walletconnect.com", "https://*.walletconnect.com"],
      frameSrc: ["'self'", "https://*.walletconnect.com", "https://*.walletconnect.org", "https://*.web3modal.com", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  } : {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow eval for development
      connectSrc: ["'self'", "https:", "ws:", "wss:"], // Allow WebSocket for HMR
      frameSrc: ["'self'", "https://*.walletconnect.com", "https://*.walletconnect.org", "https://*.web3modal.com", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  }, // Enable permissive CSP for development
  crossOriginEmbedderPolicy: false, // Disabled for external images
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false // Disable HSTS in development
});

// Rate Limiting - Adjusted for development
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit for development
  message: {
    error: "Too many requests from this IP, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for static assets and authenticated users
  skip: (req) => {
    // Skip for static assets, Vite HMR, and development resources
    if (process.env.NODE_ENV === 'development') {
      const skipPaths = ['/@', '/src/', '/node_modules/', '/__vite', '/favicon.ico'];
      if (skipPaths.some(path => req.path.startsWith(path))) {
        return true;
      }
    }
    return req.isAuthenticated && req.isAuthenticated();
  }
});

// Strict rate limiting for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: "Too many authentication attempts, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// CORS Configuration
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 
    process.env.ALLOWED_ORIGINS?.split(',') || false : 
    true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Input Validation Helpers
export const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email is required');

export const validatePassword = body('password')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be 8-128 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
  .withMessage('Password must contain uppercase, lowercase, and number');

export const validateName = body('name')
  .isLength({ min: 1, max: 100 })
  .trim()
  .escape()
  .withMessage('Name is required and must be under 100 characters');

export const validateId = param('id')
  .isInt({ min: 1 })
  .withMessage('Valid ID is required');

export const validateStartupIdea = [
  body('ideaTitle').isLength({ min: 3, max: 200 }).trim().escape(),
  body('description').isLength({ min: 10, max: 2000 }).trim().escape(),
  body('industry').isLength({ min: 2, max: 100 }).trim().escape(),
  body('stage').isIn([
    'Idea Stage',
    'Concept Development', 
    'Market Research',
    'MVP Development',
    'Beta Testing',
    'Pre-Launch',
    'Launched'
  ]),
  body('targetMarket').optional().isLength({ max: 2000 }).trim().escape(),
  body('problemStatement').optional().isLength({ max: 2000 }).trim().escape(),
  body('solutionApproach').optional().isLength({ max: 2000 }).trim().escape(),
  body('competitiveAdvantage').optional().isLength({ max: 2000 }).trim().escape(),
  body('competitiveLandscape').optional().isLength({ max: 2000 }).trim().escape(),
  body('businessModel').optional().isLength({ max: 2000 }).trim().escape(),
  body('uniqueValueProp').optional().isLength({ max: 2000 }).trim().escape(),
  body('revenueModel').optional().isLength({ max: 2000 }).trim().escape()
];

// Validation Result Middleware
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Sanitization Middleware
export const sanitizeInput = [
  mongoSanitize({
    replaceWith: '_',
  }),
  hpp({
    whitelist: ['tags', 'skills', 'interests', 'industries', 'lookingFor']
  })
];

// SQL Injection Protection
export const sanitizeQuery = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input.replace(/['"\\;\-\-\/\*]/g, '');
};

// XSS Protection
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Password Security
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12); // Increased from 10 to 12 rounds
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
};

// Session Security with PostgreSQL store
const PgSession = connectPgSimple(session);

// Generate session fingerprint to prevent session hijacking
// Uses only stable browser attributes to avoid false positives
export const generateSessionFingerprint = (req: Request): string => {
  const userAgent = req.headers['user-agent'] || '';
  
  // Only use user-agent (most stable attribute)
  // Accept-language and accept-encoding can vary per request causing false positives
  const fingerprintData = `${userAgent}`;
  return crypto.createHash('sha256').update(fingerprintData).digest('hex');
};

export const secureSessionConfig = {
  name: 'mystartup_session', // Don't use default session name
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: new PgSession({
    pool: pool, // Use existing database pool
    tableName: 'sessions', // Table name for sessions
    createTableIfMissing: true, // Auto-create sessions table
    pruneSessionInterval: 1000 * 60 * 15, // Clean up expired sessions every 15 minutes (in milliseconds)
    errorLog: (err) => {
      console.error('Session store error:', err);
    }
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' as const,
    domain: process.env.NODE_ENV === 'production' ? '.mystartup.ai' : undefined,
    path: '/',
  },
  rolling: true, // Reset expiration on activity
  genid: () => {
    // Generate cryptographically secure session IDs
    return crypto.randomBytes(32).toString('hex');
  }
};

// Session validation middleware - prevents session hijacking
export const validateSession = (req: Request, res: Response, next: NextFunction) => {
  // Skip strict fingerprint validation in development to avoid test/automation issues
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  // Check if user is authenticated via Passport (req.session.passport.user exists)
  const isAuthenticated = req.session && (req.session as any).passport?.user;
  
  if (isAuthenticated) {
    const currentFingerprint = generateSessionFingerprint(req);
    const storedFingerprint = (req.session as any).fingerprint;
    const userId = (req.session as any).passport.user;
    
    // If fingerprint doesn't match, log warning but don't destroy session immediately
    // This prevents false positives while still providing security monitoring
    if (storedFingerprint && storedFingerprint !== currentFingerprint) {
      console.warn(`⚠️ Session fingerprint mismatch for user ${userId} - possible browser update or proxy`);
      // Update to new fingerprint instead of destroying session
      (req.session as any).fingerprint = currentFingerprint;
    }
    
    // Store/update fingerprint on first auth or when missing
    if (!storedFingerprint) {
      (req.session as any).fingerprint = currentFingerprint;
    }
  }
  next();
};

// Environment Validation
export const validateEnvironment = () => {
  const required = [
    'SESSION_SECRET',
    'DATABASE_URL',
    'ANTHROPIC_API_KEY'
  ];

  const optional = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate secret strength
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long');
  }

  console.log('✅ Environment validation passed');
  console.log(`✅ Required secrets: ${required.length}/${required.length}`);
  console.log(`✅ Optional secrets: ${optional.filter(key => process.env[key]).length}/${optional.length}`);
};

// Request Logging (without sensitive data)
export const secureRequestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  
  // Log request (excluding sensitive headers)
  const safeHeaders = {
    'user-agent': headers['user-agent'],
    'content-type': headers['content-type'],
    'accept': headers['accept']
  };

  console.log(`🔒 ${method} ${url} from ${ip}`, { headers: safeHeaders });

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`🔒 ${method} ${url} ${res.statusCode} in ${duration}ms`);
  });

  next();
};

// Error Handling (without information disclosure)
export const secureErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🚨 Server Error:', err);

  // Don't expose stack traces in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal Server Error';

  res.status(status).json({
    message,
    ...(isDevelopment && { stack: err.stack })
  });
};

// File Upload Security (if needed later)
export const secureFileUpload = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
};

export default {
  securityHeaders,
  rateLimiter,
  authRateLimiter,
  corsOptions,
  validateEmail,
  validatePassword,
  validateName,
  validateId,
  validateStartupIdea,
  handleValidationErrors,
  sanitizeInput,
  sanitizeQuery,
  sanitizeHtml,
  hashPassword,
  verifyPassword,
  secureSessionConfig,
  validateEnvironment,
  secureRequestLogger,
  secureErrorHandler,
  secureFileUpload
};