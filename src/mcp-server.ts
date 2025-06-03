/**
 * MCP Server Implementation
 * 
 * This file implements a Model Context Protocol server for Etsy API integration
 */
import 'reflect-metadata'; // Required for MCP decorators
import express from 'express';
import { randomUUID } from 'node:crypto';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from './config.js';
import { ListingTool } from './tools/listing.tool.js';

/**
 * Create and configure the MCP server
 */
export class EtsyMcpServer {
  private app: express.Express;
  private mcpServer: McpServer;
  private transports: Record<string, StreamableHTTPServerTransport> = {};
  
  /**
   * Initialize the MCP server
   */
  constructor() {
    this.app = express();
    this.app.use(express.json({ limit: '10mb' })); // Increased size limit for image uploads
    
    // Initialize the MCP server
    this.mcpServer = new McpServer({
      name: "Etsy MCP Server",
      version: "1.0.0"
    });
    
    // Register MCP tools
    this.registerTools();
    
    // Setup routes
    this.setupRoutes();
  }
  
  /**
   * Register MCP tools
   */
  private registerTools() {
    // Initialize and register listing tools
    new ListingTool(this.mcpServer);
  }
  
  /**
   * Setup Express routes
   */
  private setupRoutes() {
    // Handle POST requests for client-to-server communication
    this.app.post('/mcp', async (req, res) => {
      try {
        // Create a new transport for each request in stateless mode
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined // No session management in stateless mode
        });

        // Connect to MCP server
        await this.mcpServer.connect(transport);

        // Handle the request
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });
    
    // Add MCP schema endpoint for Claude Desktop to discover tools
    this.app.get('/mcp/schema', (req, res) => {
      // For demonstration purposes, create a simple schema
      // In a real implementation, you would extract this from the MCP server
      const schema = {
        name: "Etsy MCP Server",
        version: "1.0.0",
        tools: [
          {
            name: "createDraftListing",
            description: "Creates a draft listing on Etsy"
          },
          {
            name: "uploadListingImageFromPath",
            description: "Uploads an image to a listing from a file path"
          },
          {
            name: "getTaxonomies",
            description: "Gets all listing taxonomies"
          }
        ]
      };
      res.json(schema);
    });
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', version: '1.0.0' });
    });
  }
  
  /**
   * Get the Express app
   */
  getApp(): express.Express {
    return this.app;
  }
}

// Export a singleton instance
export const mcpServer = new EtsyMcpServer();
