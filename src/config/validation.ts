/**
 * Validates the application configuration
 */
import config from './config.js';

/**
 * Validate configuration settings
 * @returns True if configuration is valid
 */
export function validateConfig(): boolean {
  // Check if the configuration is valid
  if (!config.isConfigValid()) {
    console.error('Invalid configuration: Missing required environment variables');
    console.error('Please check your .env file and ensure all required variables are set');
    return false;
  }
  
  return true;
}
