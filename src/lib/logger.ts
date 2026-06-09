// src/lib/logger.ts

/**
 * Custom logger that automatically mutes in production unless NEXT_PUBLIC_ENABLE_DEBUG is 'true'.
 */
const isDebugEnabled = 
  process.env.NODE_ENV !== 'production' || 
  process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';

export const logger = {
  info: (...args: any[]) => {
    if (isDebugEnabled) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDebugEnabled) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (isDebugEnabled) {
      console.error('[ERROR]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDebugEnabled) {
      console.debug('[DEBUG]', ...args);
    }
  }
};
