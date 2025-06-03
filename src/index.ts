/**
 * Etsy MCP Server - Main Entry Point
 * 
 * This is the main entry point for the Etsy MCP Server, which allows Claude Desktop
 * to interact with the Etsy API using the Model Context Protocol.
 */
import 'reflect-metadata'; // Required for MCP decorators
import express from 'express';
import { config, validateConfig } from './config.js';
import { tokenService } from './auth/token.service.js';
import { oauthService } from './auth/oauth.service.js';
import { mcpServer } from './mcp-server.js';

// Validate configuration
if (!validateConfig()) {
  console.error('Invalid configuration. Please check your .env file.');
  process.exit(1);
}

// Initialize Express app
const app = express();
const port = config.server.port;

// Parse JSON request body
app.use(express.json({ limit: '10mb' }));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Home page with auth status and links
app.get('/', async (req, res) => {
  const hasTokens = await tokenService.hasValidTokens();
  
  res.send(`
    <h1>Etsy MCP Server</h1>
    <p>Status: ${hasTokens ? '🟢 Authenticated' : '🔴 Not Authenticated'}</p>
    <p>${hasTokens ? 'You are authenticated with Etsy.' : 'You need to authenticate with Etsy.'}</p>
    <ul>
      <li><a href="/auth">Authenticate with Etsy</a></li>
      <li><a href="/mcp/schema">MCP Schema (for Claude Desktop)</a></li>
      <li><a href="/docs">Documentation</a></li>
    </ul>
  `);
});

// OAuth routes
app.get('/auth', (req, res) => {
  const authUrl = oauthService.getAuthorizationUrl();
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (typeof code !== 'string') {
    return res.status(400).send('Invalid authorization code');
  }

  try {
    await oauthService.handleCallback(code);
    res.send(`
      <h1>Authentication Successful!</h1>
      <p>Your Etsy OAuth tokens have been saved.</p>
      <p>You can now close this window and use the MCP server.</p>
      <p><a href="/">Return to Home</a></p>
    `);
  } catch (error: any) {
    res.status(500).send(`
      <h1>Authentication Failed</h1>
      <p>Error: ${error.message}</p>
      <p>Please try again.</p>
      <p><a href="/">Return to Home</a></p>
    `);
  }
});

// Documentation page
app.get('/docs', (req, res) => {
  res.send(`
    <h1>Etsy MCP Server Documentation</h1>
    <h2>Available MCP Tools</h2>
    <ul>
      <li><code>createDraftListing</code> - Create a draft listing on Etsy</li>
      <li><code>uploadListingImage</code> - Upload an image to a listing</li>
      <li><code>getTaxonomies</code> - Get all listing taxonomies</li>
    </ul>
    <h2>Connecting to Claude Desktop</h2>
    <p>To connect this server to Claude Desktop:</p>
    <ol>
      <li>Make sure the server is running</li>
      <li>In Claude Desktop, add a new tool with URL: <code>http://localhost:${port}/mcp</code></li>
      <li>Claude will automatically discover the available tools</li>
    </ol>
  `);
});

// Mount the MCP server Express app
app.use(mcpServer.getApp());

// Start the server
app.listen(port, () => {
  console.log(`Etsy MCP server running at http://localhost:${port}`);
  console.log(`To authenticate with Etsy, visit http://localhost:${port}/auth`);
  console.log(`MCP schema available at http://localhost:${port}/mcp/schema`);
});
