/**
 * Privacy Protection Utilities
 * Prevents exposure of sensitive user data in logs and responses
 */

// Sensitive fields that should never be logged or exposed
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'key',
  'hash',
  'ssn',
  'social_security',
  'credit_card',
  'bank_account',
  'session',
  'cookie'
];

// PII fields that need special handling
const PII_FIELDS = [
  'email',
  'phone',
  'address',
  'name',
  'firstName',
  'lastName',
  'birth_date',
  'dateOfBirth'
];

/**
 * Clean user data for safe API responses
 * Removes sensitive information before sending to client
 */
export function cleanUserDataForResponse(userData: any): any {
  if (!userData || typeof userData !== 'object') {
    return userData;
  }

  const cleaned = { ...userData };

  // Remove all sensitive fields
  SENSITIVE_FIELDS.forEach(field => {
    delete cleaned[field];
  });

  // Remove password hash specifically
  delete cleaned.password;
  delete cleaned.passwordHash;
  delete cleaned.hashedPassword;

  return cleaned;
}

/**
 * Sanitize data for logging - removes all PII and sensitive data
 */
export function sanitizeForLogging(data: any): any {
  if (!data || typeof data !== 'object') {
    return typeof data === 'string' ? '[REDACTED]' : data;
  }

  const sanitized: any = {};

  Object.keys(data).forEach(key => {
    const lowerKey = key.toLowerCase();
    
    // Remove all sensitive fields
    if (SENSITIVE_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
      return;
    }

    // Remove PII fields
    if (PII_FIELDS.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[PII_REDACTED]';
      return;
    }

    // Recursively sanitize nested objects
    if (typeof data[key] === 'object' && data[key] !== null) {
      sanitized[key] = sanitizeForLogging(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  });

  return sanitized;
}

/**
 * Check if data contains sensitive information
 */
export function containsSensitiveData(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const keys = Object.keys(data);
  
  return keys.some(key => {
    const lowerKey = key.toLowerCase();
    return SENSITIVE_FIELDS.some(field => lowerKey.includes(field)) ||
           PII_FIELDS.some(field => lowerKey.includes(field));
  });
}

/**
 * Mask email addresses for logging (keeps domain visible)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  
  return `${username[0]}${username[1]}***@${domain}`;
}

/**
 * Create privacy-safe error messages
 */
export function createSafeErrorMessage(error: any): string {
  // Never expose internal error details to users
  if (typeof error === 'string') {
    return 'An error occurred. Please try again.';
  }
  
  if (error?.message) {
    // Check if error message contains sensitive info
    const lowerMessage = error.message.toLowerCase();
    const hasSensitive = SENSITIVE_FIELDS.some(field => 
      lowerMessage.includes(field)
    ) || PII_FIELDS.some(field => 
      lowerMessage.includes(field)
    );
    
    if (hasSensitive) {
      return 'An error occurred. Please contact support.';
    }
    
    // Return generic error for anything that might be sensitive
    return 'An error occurred. Please try again.';
  }
  
  return 'An unexpected error occurred.';
}