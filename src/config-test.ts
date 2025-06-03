/**
 * Test script to verify configuration loading
 */
import config from './config/config.js';
import { validateConfig } from './config/validation.js';

// Check if configuration is valid
if (validateConfig()) {
  console.log('Configuration is valid');
  console.log(`Server will run on port: ${config.server.port}`);
  console.log(`Etsy API Key is ${config.etsy.apiKey ? 'set' : 'not set'}`);
  console.log(`Etsy Client ID is ${config.etsy.clientId ? 'set' : 'not set'}`);
  console.log(`Etsy Client Secret is ${config.etsy.clientSecret ? 'set' : 'not set'}`);
  console.log(`Etsy Redirect URI: ${config.etsy.redirectUri}`);
  console.log(`Etsy API Scopes: ${config.etsy.scopes}`);
} else {
  console.error('Configuration validation failed');
  process.exit(1);
}
