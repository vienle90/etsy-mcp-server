/**
 * Test for the configuration module
 */
import { config, validateConfig } from './config.js';

console.log('Testing configuration module:');

if (validateConfig()) {
  console.log('✅ Configuration is valid');
  console.log('Configuration values:');
  console.log(`- Server port: ${config.server.port}`);
  console.log(`- Etsy API Key: ${config.etsy.apiKey ? '(set)' : '(not set)'}`);
  console.log(`- Etsy Client ID: ${config.etsy.clientId ? '(set)' : '(not set)'}`);
  console.log(`- Etsy Redirect URI: ${config.etsy.redirectUri}`);
} else {
  console.error('❌ Configuration validation failed');
  process.exit(1);
}
