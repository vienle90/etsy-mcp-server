/**
 * OAuth Service
 * 
 * Handles OAuth 2.0 authentication flow with Etsy API
 */
import axios from 'axios';
import { randomBytes } from 'crypto';
import { tokenService } from './token.service.js';
import { config } from '../config.js';

/**
 * Service for handling OAuth 2.0 authentication
 */
export class OAuthService {
  /**
   * Generate the OAuth authorization URL
   * @param state Optional state parameter to prevent CSRF
   * @returns The authorization URL to redirect users to
   */
  getAuthorizationUrl(state?: string): string {
    // Generate a random state if not provided
    const csrfState = state || this.generateRandomState();
    
    // Build the query parameters
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.etsy.clientId,
      redirect_uri: config.etsy.redirectUri,
      scope: config.etsy.scopes,
      state: csrfState,
    });

    // Return the full authorization URL
    return `https://www.etsy.com/oauth/connect?${params.toString()}`;
  }

  /**
   * Handle the OAuth callback and exchange code for tokens
   * @param code The authorization code received from Etsy
   * @returns The token data
   */
  async handleCallback(code: string): Promise<any> {
    try {
      // Exchange the code for tokens
      const response = await axios.post(
        'https://api.etsy.com/v3/public/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: config.etsy.clientId,
          redirect_uri: config.etsy.redirectUri,
          code,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Extract token data from response
      const tokenData = response.data;
      
      // Save the tokens
      await tokenService.saveToken(tokenData);
      
      return tokenData;
    } catch (error: any) {
      console.error('Error exchanging code for token:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      
      throw new Error('Failed to authenticate with Etsy');
    }
  }

  /**
   * Generate a random state string to prevent CSRF attacks
   * @returns A random string
   */
  private generateRandomState(): string {
    return randomBytes(16).toString('hex');
  }
}

// Export a singleton instance
export const oauthService = new OAuthService();
