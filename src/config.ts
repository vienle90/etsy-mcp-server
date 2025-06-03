/**
 * Configuration module for Etsy API integration
 */
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 */
export const config = {
  // Etsy API configuration
  etsy: {
    // API Key (keystring) - Your application's identifier
    apiKey: process.env.ETSY_API_KEY || '',
    
    // Client ID - Same as the API Key in Etsy's implementation
    clientId: process.env.ETSY_API_KEY || '',
    
    // Client Secret (shared secret) - Used for OAuth flows
    clientSecret: process.env.ETSY_CLIENT_SECRET || '',
    
    // Shop ID - Your Etsy shop identifier
    shopId: process.env.ETSY_SHOP_ID || '',
    
    // Redirect URI for OAuth callback
    redirectUri: process.env.ETSY_REDIRECT_URI || 'http://localhost:3000/callback',
    
    // Scopes required for listing operations
    scopes: process.env.ETSY_SCOPES || 'listings_r listings_w shops_r',
    
    // API Base URL
    apiBaseUrl: 'https://openapi.etsy.com/v3'
  },
  
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    tokenFilePath: './tokens.json'
  },
  
  /**
   * Validates the configuration
   */
  isValid(): boolean {
    return !!(
      this.etsy.apiKey &&
      this.etsy.clientSecret &&
      this.etsy.redirectUri
    );
  }
};

/**
 * Validate configuration settings
 * @returns True if configuration is valid
 */
export function validateConfig(): boolean {
  if (!config.isValid()) {
    console.error('Invalid configuration: Missing required environment variables');
    console.error('Please check your .env file and ensure all required variables are set');
    return false;
  }
  
  return true;
}

export default config;
