// Security utility functions
import { Request, Response, NextFunction } from "express";

// Input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potential XSS characters
    .substring(0, 1000); // Limit length
}

// SQL injection prevention helper
export function validateId(id: string): number | null {
  const parsedId = parseInt(id);
  if (isNaN(parsedId) || parsedId <= 0 || parsedId > 999999999) {
    return null;
  }
  return parsedId;
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Prevent information disclosure
export function sanitizeError(error: any): string {
  if (process.env.NODE_ENV === 'production') {
    // Don't expose detailed errors in production
    return 'An error occurred';
  }
  return error?.message || 'Unknown error';
}

// CORS security headers middleware
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
}