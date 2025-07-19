/**
 * Frontend Security Protection - Client-Side Attack Prevention
 * Protects against XSS, CSRF, clickjacking, and other client-side attacks
 */

import { Request, Response, NextFunction } from "express";

// Content Security Policy - Maximum Security Configuration
export const strictCSP = {
  production: {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",  // No inline scripts in production
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ')
  },
  development: {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Required for Vite
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https: wss: ws:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
};

// Anti-XSS Response Headers
export const antiXSSHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', ')
};

// HSTS Configuration
export const hstsHeader = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Frontend Input Sanitization Middleware
export function sanitizeFrontendInputs(req: Request, res: Response, next: NextFunction) {
  // Sanitize HTML form inputs
  function sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      // Remove script tags and event handlers
      return value
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/expression\(/gi, '')
        .replace(/url\(/gi, '')
        .replace(/@import/gi, '')
        .trim();
    }
    
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      Object.keys(value).forEach(key => {
        const cleanKey = key.replace(/[^\w]/g, '').substring(0, 100);
        sanitized[cleanKey] = sanitizeValue(value[key]);
      });
      return sanitized;
    }
    
    return value;
  }
  
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  next();
}

// Anti-CSRF Token Validation
export function validateCSRFToken(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF for GET requests and API authentication endpoints
  if (req.method === 'GET' || req.path.includes('/auth/')) {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = (req.session as any)?.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'CSRF token validation failed' });
  }
  
  next();
}

// Generate CSRF token
export function generateCSRFToken(req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    return next();
  }
  
  // Generate CSRF token if it doesn't exist
  if (!(req.session as any).csrfToken) {
    (req.session as any).csrfToken = Math.random().toString(36).substring(2) + 
                                      Math.random().toString(36).substring(2) +
                                      Date.now().toString(36);
  }
  
  // Make token available to frontend
  res.locals.csrfToken = (req.session as any).csrfToken;
  
  next();
}

// Clickjacking Protection
export function antiClickjacking(req: Request, res: Response, next: NextFunction) {
  // Prevent page from being embedded in frames
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', 'frame-ancestors \'none\'');
  
  next();
}

// File Upload Security
export function secureFileUpload(allowedTypes: string[] = [], maxSize: number = 5 * 1024 * 1024) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if request contains files
    if (!req.files && !req.file) {
      return next();
    }
    
    const files = req.files || [req.file];
    const fileArray = Array.isArray(files) ? files : [files];
    
    for (const file of fileArray) {
      if (!file) continue;
      
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({ 
          error: `File size exceeds limit of ${maxSize / 1024 / 1024}MB` 
        });
      }
      
      // Check file type
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` 
        });
      }
      
      // Check for malicious file signatures
      const maliciousSignatures = [
        'PK', // ZIP files (potential malware)
        '7z', // 7zip files
        'Rar', // RAR files
        '%PDF', // PDF files can contain malicious scripts
        '<?php', // PHP files
        '<script', // HTML with scripts
        'javascript:', // JavaScript URLs
        'MZ' // Windows executables
      ];
      
      const fileHeader = file.buffer ? file.buffer.slice(0, 10).toString('ascii') : '';
      const containsMalicious = maliciousSignatures.some(sig => 
        fileHeader.includes(sig) || (file.originalname || '').includes(sig)
      );
      
      if (containsMalicious) {
        return res.status(400).json({ 
          error: 'File contains potentially malicious content' 
        });
      }
    }
    
    next();
  };
}

// Browser Security Headers
export function setBrowserSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Set CSP based on environment
  const cspHeaders = isDevelopment ? strictCSP.development : strictCSP.production;
  Object.entries(cspHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Set anti-XSS headers
  Object.entries(antiXSSHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  // Set HSTS in production
  if (!isDevelopment) {
    Object.entries(hstsHeader).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }
  
  next();
}

// Input Length Limits for Frontend Forms
export const FRONTEND_INPUT_LIMITS = {
  email: 254,
  password: 128,
  name: 100,
  title: 200,
  description: 2000,
  url: 2048,
  phone: 20,
  address: 500,
  message: 5000
};

// Validate frontend form inputs
export function validateFrontendInputs(req: Request, res: Response, next: NextFunction) {
  if (!req.body) {
    return next();
  }
  
  function validateInput(key: string, value: any): string | null {
    if (typeof value !== 'string') {
      return null;
    }
    
    const limit = FRONTEND_INPUT_LIMITS[key as keyof typeof FRONTEND_INPUT_LIMITS] || 1000;
    
    if (value.length > limit) {
      return `${key} exceeds maximum length of ${limit} characters`;
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /expression\(/gi,
      /url\(/gi,
      /import\(/gi
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(value));
    if (isSuspicious) {
      return `${key} contains potentially malicious content`;
    }
    
    return null;
  }
  
  // Validate all string inputs in request body
  function validateObject(obj: any, prefix: string = ''): string | null {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'string') {
        const error = validateInput(key, value);
        if (error) return error;
      } else if (typeof value === 'object' && value !== null) {
        const error = validateObject(value, fullKey);
        if (error) return error;
      }
    }
    return null;
  }
  
  const validationError = validateObject(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  
  next();
}