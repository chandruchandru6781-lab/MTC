/**
 * Firebase Diagnostics Utility
 * Helps diagnose real-time sync issues in production
 */

export const firebaseDiagnostics = {
  /**
   * Check if Firebase environment variables are loaded
   */
  checkEnvironmentVariables(): {
    hasApiKey: boolean;
    hasProjectId: boolean;
    hasAuthDomain: boolean;
    hasAppId: boolean;
    allConfigured: boolean;
    missingVariables: string[];
  } {
    const variables = {
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
      VITE_FIREBASE_DATABASE_URL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    };

    const hasApiKey = !!variables.VITE_FIREBASE_API_KEY;
    const hasProjectId = !!variables.VITE_FIREBASE_PROJECT_ID;
    const hasAuthDomain = !!variables.VITE_FIREBASE_AUTH_DOMAIN;
    const hasAppId = !!variables.VITE_FIREBASE_APP_ID;
    
    const allConfigured = hasApiKey && hasProjectId && hasAuthDomain && hasAppId;

    const missingVariables = Object.entries(variables)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (!allConfigured) {
      console.warn('⚠️ Firebase environment variables not fully configured');
      console.warn('Missing variables:', missingVariables);
    }

    return {
      hasApiKey,
      hasProjectId,
      hasAuthDomain,
      hasAppId,
      allConfigured,
      missingVariables,
    };
  },

  /**
   * Test Firebase connection
   */
  async testFirebaseConnection(): Promise<{
    connected: boolean;
    database: boolean;
    error?: string;
  }> {
    try {
      const { db } = await import('../config/firebase');
      
      if (!db || !db.app) {
        return {
          connected: false,
          database: false,
          error: 'Firestore instance not initialized',
        };
      }

      return {
        connected: true,
        database: true,
      };
    } catch (error) {
      return {
        connected: false,
        database: false,
        error: `Firebase connection error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },

  /**
   * Log diagnostic information
   */
  logDiagnostics(): void {
    console.group('🔍 Firebase Diagnostics');
    
    const envVars = this.checkEnvironmentVariables();
    console.log('Environment Variables:', envVars);
    
    if (!envVars.allConfigured) {
      console.warn('❌ Firebase not properly configured!');
      console.warn('Missing variables:', envVars.missingVariables);
      console.info('To enable real-time sync:');
      console.info('1. Add GitHub Secrets to your repo:');
      console.info('   - VITE_FIREBASE_API_KEY');
      console.info('   - VITE_FIREBASE_PROJECT_ID');
      console.info('   - VITE_FIREBASE_AUTH_DOMAIN');
      console.info('   - VITE_FIREBASE_STORAGE_BUCKET');
      console.info('   - VITE_FIREBASE_MESSAGING_SENDER_ID');
      console.info('   - VITE_FIREBASE_APP_ID');
      console.info('   - VITE_FIREBASE_DATABASE_URL');
      console.info('2. Trigger a new deploy from GitHub');
    } else {
      console.log('✅ Firebase environment variables configured correctly');
    }

    console.groupEnd();
  },
};
