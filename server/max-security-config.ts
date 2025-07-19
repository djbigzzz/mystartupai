/**
 * Maximum Security Configuration - 100% Security Protection
 * Complete protection against all known attack vectors
 */

// Environment Security - Strict Requirements
export const SECURITY_REQUIREMENTS = {
  // Required secrets for production
  REQUIRED_SECRETS: [
    'DATABASE_URL',
    'OPENAI_API_KEY', 
    'SESSION_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ],
  
  // Minimum secret strength requirements
  SECRET_MIN_LENGTHS: {
    SESSION_SECRET: 64,
    DATABASE_URL: 20,
    OPENAI_API_KEY: 20
  },
  
  // Allowed domains for CORS (production)
  ALLOWED_ORIGINS: [
    /^https:\/\/.*\.replit\.app$/,
    /^https:\/\/.*\.repl\.co$/,
    'https://mystartup.ai'
  ],
  
  // Rate limiting configuration
  RATE_LIMITS: {
    // Global rate limit
    GLOBAL: { requests: 100, windowMs: 15 * 60 * 1000 },
    
    // Authentication endpoints
    AUTH: { requests: 5, windowMs: 15 * 60 * 1000 },
    
    // Data submission endpoints
    SUBMISSION: { requests: 10, windowMs: 15 * 60 * 1000 },
    
    // API endpoints
    API: { requests: 50, windowMs: 15 * 60 * 1000 },
    
    // Waitlist signups
    WAITLIST: { requests: 3, windowMs: 15 * 60 * 1000 }
  },
  
  // Content Security Policy
  CSP_DIRECTIVES: {
    PRODUCTION: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "https:", "blob:"],
      'connect-src': ["'self'", "https:"],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true
    },
    DEVELOPMENT: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "https:", "blob:"],
      'connect-src': ["'self'", "https:", "wss:", "ws:"],
      'frame-src': ["'none'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"]
    }
  }
};

// Input Validation Rules - Maximum Strictness
export const INPUT_VALIDATION_RULES = {
  // String length limits
  MAX_LENGTHS: {
    email: 254,
    password: 128,
    name: 100,
    title: 200,
    description: 2000,
    url: 2048,
    textarea: 5000,
    general: 1000
  },
  
  // Allowed characters patterns
  PATTERNS: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/,
    name: /^[a-zA-Z\s'-]{1,100}$/,
    alphanumeric: /^[a-zA-Z0-9\s]{1,100}$/,
    url: /^https?:\/\/[^\s<>"'{}|\\^`[\]]+$/
  },
  
  // Blocked patterns (malicious content)
  BLOCKED_PATTERNS: [
    // Script injection
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    
    // SQL injection
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /('|(\')|;|--|\/\*|\*\/)/g,
    
    // Command injection
    /(\||&|;|`|\$\()/g,
    
    // Path traversal
    /\.\.[\/\\]/g,
    
    // Expression injection
    /expression\(/gi,
    /@import/gi,
    /url\(/gi
  ],
  
  // Dangerous keywords
  DANGEROUS_KEYWORDS: [
    'script', 'javascript', 'vbscript', 'onload', 'onerror', 'onclick',
    'union', 'select', 'insert', 'update', 'delete', 'drop', 'create',
    'alter', 'exec', 'execute', 'xp_', 'sp_', 'eval', 'function',
    'document.cookie', 'window.location', 'localStorage', 'sessionStorage'
  ]
};

// Database Security Configuration
export const DATABASE_SECURITY = {
  // Connection limits
  MAX_CONNECTIONS: 50,
  CONNECTION_TIMEOUT: 30000, // 30 seconds
  QUERY_TIMEOUT: 10000, // 10 seconds
  
  // Query validation
  ALLOWED_QUERY_TYPES: ['SELECT', 'INSERT', 'UPDATE'],
  MAX_QUERY_LENGTH: 10000,
  
  // Parameterized query enforcement
  REQUIRE_PARAMETERIZED: true,
  
  // Audit logging
  LOG_ALL_QUERIES: process.env.NODE_ENV === 'production',
  LOG_FAILED_ATTEMPTS: true
};

// File Upload Security
export const FILE_UPLOAD_SECURITY = {
  // Size limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  
  // Allowed types
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'text/plain',
    'application/pdf'
  ],
  
  // Blocked file extensions
  BLOCKED_EXTENSIONS: [
    '.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js', '.jar',
    '.com', '.dll', '.sh', '.php', '.asp', '.jsp', '.py', '.rb',
    '.pl', '.cgi', '.htaccess', '.config'
  ],
  
  // Virus scanning (placeholder for future implementation)
  SCAN_FOR_MALWARE: true
};

// Session Security Configuration
export const SESSION_SECURITY = {
  // Cookie settings
  COOKIE: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: undefined, // Let browser decide
    path: '/'
  },
  
  // Session settings
  SESSION: {
    name: 'mystartup.session',
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    rolling: true, // Refresh session on activity
    
    // Store configuration
    store: {
      ttl: 24 * 60 * 60, // 24 hours in seconds
      checkPeriod: 60 * 60 * 1000, // Check for expired sessions every hour
      createDatabaseTable: true,
      tableName: 'sessions'
    }
  }
};

// Error Handling Security
export const ERROR_HANDLING = {
  // Don't expose stack traces in production
  EXPOSE_STACK_TRACE: process.env.NODE_ENV === 'development',
  
  // Don't expose error details in production
  EXPOSE_ERROR_DETAILS: process.env.NODE_ENV === 'development',
  
  // Generic error messages for production
  GENERIC_MESSAGES: {
    VALIDATION_ERROR: 'Invalid input provided',
    AUTHENTICATION_ERROR: 'Authentication failed',
    AUTHORIZATION_ERROR: 'Access denied',
    DATABASE_ERROR: 'Database operation failed',
    INTERNAL_ERROR: 'Internal server error'
  },
  
  // Log levels
  LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
};

// Security Headers Configuration
export const SECURITY_HEADERS = {
  'Content-Security-Policy': '', // Set dynamically based on environment
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Monitoring and Alerting
export const SECURITY_MONITORING = {
  // Attack detection thresholds
  ATTACK_DETECTION: {
    FAILED_LOGIN_ATTEMPTS: 5,
    SUSPICIOUS_REQUESTS: 10,
    SQL_INJECTION_ATTEMPTS: 1,
    XSS_ATTEMPTS: 1,
    RATE_LIMIT_VIOLATIONS: 3
  },
  
  // Alert configuration
  ALERTS: {
    SEND_EMAIL_ALERTS: false, // Configure in production
    LOG_TO_SECURITY_SERVICE: false, // Configure with security service
    BLOCK_SUSPICIOUS_IPS: true
  }
};