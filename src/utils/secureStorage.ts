// Secure Storage Utility with basic encoding for sensitive data
// Note: For production with highly sensitive data, use a proper encryption library

const ENCODING_KEY = 'jee-mock-app-v1';

/**
 * Simple obfuscation for localStorage data
 * This provides basic protection against casual inspection
 * For highly sensitive data, use backend storage with proper encryption
 */
const encode = (data: string): string => {
  try {
    const encoded = btoa(unescape(encodeURIComponent(data)));
    return encoded.split('').reverse().join('');
  } catch {
    return data;
  }
};

const decode = (encoded: string): string => {
  try {
    const reversed = encoded.split('').reverse().join('');
    return decodeURIComponent(escape(atob(reversed)));
  } catch {
    return encoded;
  }
};

/**
 * Securely store sensitive data in localStorage
 * @param key - Storage key
 * @param value - Value to store (will be JSON serialized)
 */
export const setSecureItem = <T>(key: string, value: T): void => {
  try {
    const jsonString = JSON.stringify(value);
    const encodedValue = encode(jsonString);
    localStorage.setItem(`${ENCODING_KEY}-${key}`, encodedValue);
  } catch (error) {
    console.error('Secure storage error:', error);
  }
};

/**
 * Retrieve securely stored data from localStorage
 * @param key - Storage key
 * @returns Parsed value or null if not found/invalid
 */
export const getSecureItem = <T>(key: string): T | null => {
  try {
    const encodedValue = localStorage.getItem(`${ENCODING_KEY}-${key}`);
    if (!encodedValue) return null;
    
    const jsonString = decode(encodedValue);
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Secure retrieval error:', error);
    return null;
  }
};

/**
 * Remove securely stored item
 * @param key - Storage key
 */
export const removeSecureItem = (key: string): void => {
  localStorage.removeItem(`${ENCODING_KEY}-${key}`);
};

/**
 * Clear all securely stored items
 */
export const clearSecureStorage = (): void => {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(ENCODING_KEY)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Regular localStorage wrapper for non-sensitive data
 * with automatic JSON serialization
 */
export const storage = {
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  has: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  }
};
