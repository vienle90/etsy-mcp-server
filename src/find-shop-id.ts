/**
 * Utility to find your Etsy shop ID
 * 
 * Usage: yarn find:shop-id
 */
import { etsyClient } from './api/etsy.client.js';
import { tokenService } from './auth/token.service.js';
import { config } from './config.js';

// Regular expression to extract shop ID from shop URL
const SHOP_ID_REGEX = /\/shops\/(\d+)/;

async function findShopId() {
  console.log('Checking if we have valid tokens...');
  
  // Check if we have valid tokens
  const hasValidTokens = await tokenService.hasValidTokens();
  
  if (!hasValidTokens) {
    console.error('No valid tokens found. Please authenticate with Etsy first.');
    console.error('Run: yarn oauth:server');
    process.exit(1);
  }
  
  try {
    console.log('Fetching user information...');
    
    // Get the current user's shops
    const response = await etsyClient.get('/application/users/me/shops');
    
    if (!response || !response.results || response.results.length === 0) {
      console.error('No shops found for your Etsy account.');
      console.error('Please create a shop on Etsy first.');
      process.exit(1);
    }
    
    // Display all shops
    console.log('\nShops found for your account:');
    console.log('-----------------------------');
    
    response.results.forEach((shop: any, index: number) => {
      console.log(`[${index + 1}] Shop: ${shop.shop_name}`);
      console.log(`    ID: ${shop.shop_id}`);
      console.log(`    URL: ${shop.url}`);
      console.log('');
    });
    
    // Get the first shop ID
    const firstShop = response.results[0];
    const shopId = firstShop.shop_id.toString();
    
    console.log(`Your Etsy shop ID is: ${shopId}`);
    console.log('\nUpdate your .env file with:');
    console.log(`ETSY_SHOP_ID=${shopId}`);
  } catch (error: any) {
    console.error('Error fetching shop information:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the function
findShopId().catch(console.error);
