/**
 * Etsy API Client
 * 
 * Makes authenticated requests to the Etsy API
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenService } from '../auth/token.service.js';
import { config } from '../config.js';

/**
 * Client for interacting with Etsy API
 */
export class EtsyClient {
  private client: AxiosInstance;

  /**
   * Initialize the Etsy API client
   */
  constructor() {
    this.client = axios.create({
      baseURL: config.etsy.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.etsy.apiKey,
      },
    });

    // Add request interceptor to include access token
    this.client.interceptors.request.use(async (config) => {
      const token = await tokenService.getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle API errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Make a GET request to the Etsy API
   */
  async get<T = any>(endpoint: string, params: Record<string, any> = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, { 
        params,
        ...config 
      });
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a POST request to the Etsy API
   */
  async post<T = any>(endpoint: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a PUT request to the Etsy API
   */
  async put<T = any>(endpoint: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.client.put<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Make a DELETE request to the Etsy API
   */
  async delete<T = any>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await this.client.delete<T>(endpoint, config);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any): void {
    if (error.response) {
      const { status, data } = error.response;
      
      // Rate limiting error
      if (status === 429) {
        console.error('Rate limit exceeded. Please try again later.');
      }
      
      // Authentication error
      if (status === 401) {
        console.error('Authentication error. Token may be invalid or expired.');
      }
      
      console.error(`Etsy API Error (${status}):`, data);
    } else if (error.request) {
      console.error('No response received from Etsy API:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
  
  /**
   * Find shop by name
   */
  async findShopByName(shopName: string): Promise<any> {
    return this.get('/application/shops', { shop_name: shopName });
  }
  
  /**
   * Get shop information
   */
  async getShop(shopId: string): Promise<any> {
    return this.get(`/application/shops/${shopId}`);
  }
  
  /**
   * Create a draft listing
   */
  async createDraftListing(shopId: string, listingData: any): Promise<any> {
    return this.post(`/application/shops/${shopId}/listings`, listingData);
  }
  
  /**
   * Upload an image to a listing
   */
  async uploadListingImage(shopId: string, listingId: number, imageData: string): Promise<any> {
    // Check if imageData is already base64 encoded or needs encoding
    const base64Data = imageData.startsWith('data:image')
      ? imageData.split(',')[1]
      : imageData;
    
    return this.post(
      `/application/shops/${shopId}/listings/${listingId}/images`,
      { image: base64Data },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
  
  /**
   * Update a listing
   */
  async updateListing(shopId: string, listingId: number, listingData: any): Promise<any> {
    return this.put(`/application/shops/${shopId}/listings/${listingId}`, listingData);
  }
  
  /**
   * Get listing taxonomies (categories)
   */
  async getTaxonomies(): Promise<any> {
    return this.get('/application/seller-taxonomy/nodes');
  }
  
  /**
   * Get properties for a taxonomy
   */
  async getTaxonomyProperties(taxonomyId: number): Promise<any> {
    return this.get(`/application/seller-taxonomy/nodes/${taxonomyId}/properties`);
  }
  
  /**
   * Update listing inventory (variations, SKUs, etc.)
   */
  async updateListingInventory(shopId: string, listingId: number, inventoryData: any): Promise<any> {
    return this.put(`/application/shops/${shopId}/listings/${listingId}/inventory`, inventoryData);
  }
}

// Export a singleton instance
export const etsyClient = new EtsyClient();
