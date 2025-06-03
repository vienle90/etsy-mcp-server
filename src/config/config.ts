/**
 * Configuration loader for Etsy API settings
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Etsy API configuration
const config = {
  // API settings
  etsy: {
    apiKey: process.env.ETSY_API_KEY || '',
    clientId: process.env.ETSY_CLIENT_ID || '',
    clientSecret: process.env.ETSY_CLIENT_SECRET || '',
    redirectUri: process.env.ETSY_REDIRECT_URI || 'http://localhost:3000/callback',
    scopes: process.env.ETSY_SCOPES || 'listings_r listings_w',
    apiBaseUrl: 'https://openapi.etsy.com/v3'
  },
  
  // Server settings
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    tokenFilePath: join(__dirname, '../../tokens.json')
  },
  
  // Check if required environment variables are set
  isConfigValid(): boolean {
    return !!(
      this.etsy.apiKey &&
      this.etsy.clientId &&
      this.etsy.clientSecret &&
      this.etsy.redirectUri
    );
  }
};

export default config;
