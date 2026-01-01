// Input Sanitization Utility for security
// Prevents XSS attacks and injection vulnerabilities

/**
 * Sanitize a string by escaping HTML entities
 * @param input - Raw user input
 * @returns Sanitized string safe for display
 */
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return input.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
};

/**
 * Sanitize input for safe use in text content
 * Strips HTML tags completely
 * @param input - Raw user input
 * @returns Clean text without HTML
 */
export const stripHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim();
};

/**
 * Validate and sanitize email address
 * @param email - Email to validate
 * @returns Object with valid flag and sanitized email
 */
export const validateEmail = (email: string): { valid: boolean; sanitized: string } => {
  const sanitized = stripHtml(email).toLowerCase().trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return {
    valid: emailRegex.test(sanitized),
    sanitized
  };
};

/**
 * Validate and limit text input length
 * @param input - Raw input
 * @param maxLength - Maximum allowed length
 * @returns Truncated and sanitized input
 */
export const sanitizeText = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') return '';
  
  const stripped = stripHtml(input);
  return stripped.slice(0, maxLength).trim();
};

/**
 * Validate numeric input
 * @param input - Input to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Validated number or null
 */
export const validateNumber = (
  input: string | number,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number | null => {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  
  if (isNaN(num) || !isFinite(num)) return null;
  if (num < min || num > max) return null;
  
  return num;
};

/**
 * Sanitize URL for safe usage
 * Only allows http, https protocols
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  if (typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
};

/**
 * Create a safe object from user input by sanitizing all string values
 * @param obj - Object with potentially unsafe string values
 * @returns Object with all string values sanitized
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeText(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
};
