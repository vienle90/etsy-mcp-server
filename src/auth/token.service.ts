/**
 * Token Storage Service
 * 
 * Manages OAuth tokens for Etsy API authentication
 */
import fs from 'fs/promises';
import { existsSync } from 'fs';
import axios from 'axios';
import { config } from '../config.js';

/**
 * Interface for token data
 */
export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
}

/**
 * Service for managing OAuth tokens
 */
export class TokenService {
  private tokenFilePath: string;

  /**
   * Initialize the token service
   */
  constructor() {
    this.tokenFilePath = config.server.tokenFilePath;
  }

  /**
   * Get a valid access token
   * Will refresh the token if it's expired or about to expire
   */
  async getValidToken(): Promise<string | null> {
    try {
      const tokenData = await this.readTokenData();
      
      if (!tokenData) {
        console.error('No token data found. Please authenticate first.');
        return null;
      }

      // Check if token is expired or about to expire (5-minute buffer)
      const expiresAt = tokenData.expires_at || 0;
      if (expiresAt - 300000 < Date.now()) {
        console.log('Token expired or about to expire. Refreshing...');
        return await this.refreshToken(tokenData.refresh_token);
      }

      return tokenData.access_token;
    } catch (error) {
      console.error('Error getting valid token:', error);
      return null;
    }
  }

  /**
   * Save token data to file
   */
  async saveToken(tokenData: TokenData): Promise<void> {
    try {
      // Calculate expiration time if not provided
      if (!tokenData.expires_at && tokenData.expires_in) {
        tokenData.expires_at = Date.now() + (tokenData.expires_in * 1000);
      }

      await fs.writeFile(
        this.tokenFilePath, 
        JSON.stringify(tokenData, null, 2), 
        'utf-8'
      );
      
      console.log('Token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  /**
   * Refresh an expired token using the refresh token
   */
  private async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(
        'https://api.etsy.com/v3/public/oauth/token',
        {
          grant_type: 'refresh_token',
          client_id: config.etsy.clientId,
          refresh_token: refreshToken
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const tokenData = response.data;
      await this.saveToken(tokenData);
      
      return tokenData.access_token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Read token data from file
   */
  private async readTokenData(): Promise<TokenData | null> {
    try {
      if (!existsSync(this.tokenFilePath)) {
        return null;
      }
      
      const data = await fs.readFile(this.tokenFilePath, 'utf-8');
      return JSON.parse(data) as TokenData;
    } catch (error) {
      console.error('Error reading token data:', error);
      return null;
    }
  }

  /**
   * Check if we have valid tokens
   */
  async hasValidTokens(): Promise<boolean> {
    const token = await this.getValidToken();
    return token !== null;
  }
}

// Export a singleton instance
export const tokenService = new TokenService();
