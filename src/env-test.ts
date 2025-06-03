/**
 * Simple test script to verify the environment
 */
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Display environment variables
console.log('Environment variables loaded:');
console.log(`ETSY_API_KEY is ${process.env.ETSY_API_KEY ? 'set' : 'not set'}`);
console.log(`ETSY_CLIENT_ID is ${process.env.ETSY_CLIENT_ID ? 'set' : 'not set'}`);
console.log(`ETSY_CLIENT_SECRET is ${process.env.ETSY_CLIENT_SECRET ? 'set' : 'not set'}`);
console.log(`ETSY_REDIRECT_URI: ${process.env.ETSY_REDIRECT_URI}`);
console.log(`PORT: ${process.env.PORT}`);
