/**
 * Environment Variable Validator
 * Ensures required variables are set at application startup
 */

/**
 * Validate that Firebase is properly configured
 * Called at app startup to warn if configuration is missing
 */
export const validateFirebaseConfiguration = (): { configured: boolean; missingVars: string[] } => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_DATABASE_URL',
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName as keyof ImportMetaEnv]
  );

  return {
    configured: missingVars.length === 0,
    missingVars,
  };
};

/**
 * Get all configured Firebase variables (for debugging)
 * NOTE: Only logs that variables are SET, never logs actual values
 */
export const getFirebaseConfigStatus = (): Record<string, boolean> => {
  const variables = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_DATABASE_URL',
  ];

  const status: Record<string, boolean> = {};
  variables.forEach(varName => {
    status[varName] = !!import.meta.env[varName as keyof ImportMetaEnv];
  });

  return status;
};

/**
 * Initialize environment and warn about any configuration issues
 * Call this once at application startup
 */
export const initializeEnvironment = (): void => {
  const firebaseConfig = validateFirebaseConfiguration();

  if (!firebaseConfig.configured) {
    console.warn(
      '⚠️  Firebase not fully configured. Using localStorage mode.\n' +
      'Missing variables: ' + firebaseConfig.missingVars.join(', ') + '\n' +
      'Questions will only be stored locally and not shared across users.\n' +
      'To enable Firebase, set all 7 VITE_FIREBASE_* variables in .env.local'
    );
  } else {
    console.log('✓ Firebase configured - using shared data mode');
  }

  // Check if running on HTTPS (except localhost)
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    if (!window.location.protocol.startsWith('https')) {
      console.warn('⚠️  App not running on HTTPS - data transmission may not be secure');
    }
  }
};

/**
 * Validate that all required environment variables are strings
 */
export const validateEnvironmentTypes = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const variables = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_DATABASE_URL',
  ];

  variables.forEach(varName => {
    const value = import.meta.env[varName as keyof ImportMetaEnv];
    if (value && typeof value !== 'string') {
      errors.push(`${varName} must be a string`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
