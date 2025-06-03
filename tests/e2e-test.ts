/**
 * End-to-end test for Etsy API integration
 * 
 * This test creates a draft listing and uploads an image to it.
 */
import { config } from '../src/config.js';
import { etsyClient } from '../src/api/etsy.client.js';
import { tokenService } from '../src/auth/token.service.js';
import { listingTool } from '../src/tools/listing.tool.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Run the end-to-end test
 */
async function runTest() {
  // Check if we have valid tokens
  console.log('Checking authentication...');
  const hasValidTokens = await tokenService.hasValidTokens();
  
  if (!hasValidTokens) {
    console.error('No valid tokens found. Please authenticate with Etsy first.');
    console.error('Run: yarn oauth:server');
    process.exit(1);
  }
  
  // Check if shop ID is set
  if (!config.etsy.shopId) {
    console.error('Shop ID is not set in configuration. Please set ETSY_SHOP_ID in your .env file.');
    console.error('Run: yarn find:shop-id');
    process.exit(1);
  }
  
  try {
    // 1. Get taxonomies
    console.log('Fetching taxonomies...');
    const taxonomiesResult = await listingTool.getTaxonomies();
    
    if (!taxonomiesResult.success) {
      throw new Error('Failed to fetch taxonomies: ' + taxonomiesResult.error);
    }
    
    // Select a taxonomy for testing
    const testTaxonomy = taxonomiesResult.taxonomies[0];
    console.log(`Using taxonomy: ${testTaxonomy.name} (ID: ${testTaxonomy.id})`);
    
    // 2. Create a draft listing
    console.log('Creating draft listing...');
    const draftListingResult = await listingTool.createDraftListing(
      'Test Listing - ' + new Date().toISOString(),
      'This is a test listing created by the Etsy MCP Server.',
      19.99,
      1,
      'i_did',
      '2020_2025',
      false,
      testTaxonomy.id
    );
    
    if (!draftListingResult.success) {
      throw new Error('Failed to create draft listing: ' + draftListingResult.error);
    }
    
    console.log(`Draft listing created with ID: ${draftListingResult.listing_id}`);
    console.log(`Listing URL: ${draftListingResult.url}`);
    
    // 3. Upload a test image (if available)
    try {
      console.log('Uploading test image...');
      
      // Load a test image (you'll need to provide one)
      const testImagePath = path.join(process.cwd(), 'tests', 'test-image.jpg');
      const imageData = await fs.readFile(testImagePath, { encoding: 'base64' });
      
      const uploadResult = await listingTool.uploadListingImage(
        draftListingResult.listing_id,
        imageData
      );
      
      if (!uploadResult.success) {
        throw new Error('Failed to upload image: ' + uploadResult.error);
      }
      
      console.log('Image uploaded successfully');
    } catch (error) {
      console.warn('Skipping image upload:', error.message);
    }
    
    console.log('\nTest completed successfully!');
    console.log('----------------------------');
    console.log('You can view the draft listing in your Etsy shop dashboard.');
    console.log('Remember to delete the test listing if you don\'t want to keep it.');
  } catch (error) {
    console.error('Test failed:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    
    process.exit(1);
  }
}

// Run the test
runTest().catch(console.error);
