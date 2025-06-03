/**
 * MCP Tools for Etsy Listing Operations
 * 
 * This file implements tools for Etsy listings using the Model Context Protocol
 */
import 'reflect-metadata';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { etsyClient } from '../api/etsy.client.js';
import { config } from '../config.js';

/**
 * Class for handling Etsy listing operations using MCP
 */
export class ListingTool {
  private server: McpServer;

  constructor(server: McpServer) {
    this.server = server;
    this.registerTools();
  }

  /**
   * Register all listing tools with the MCP server
   */
  private registerTools() {
    // Create a draft listing tool
    this.server.tool(
      "createDraftListing",
      {
        title: z.string().describe("Title of the listing"),
        description: z.string().describe("Description of the listing"),
        price: z.number().describe("Price of the item in USD"),
        quantity: z.number().optional().default(1).describe("Quantity available"),
        whoMade: z.enum(["i_did", "collective", "someone_else"]).default("i_did").describe("Who made the item"),
        whenMade: z.string().default("2020_2025").describe("When the item was made"),
        isSupply: z.boolean().default(false).describe("Is this a supply item?"),
        taxonomyId: z.number().describe("Taxonomy ID for the listing category")
      },
      async ({ title, description, price, quantity, whoMade, whenMade, isSupply, taxonomyId }) => {
        try {
          const shopId = config.etsy.shopId;
          
          if (!shopId) {
            throw new Error('Shop ID is not set in configuration');
          }
          
          const listingData = {
            title,
            description,
            price,
            quantity,
            who_made: whoMade,
            when_made: whenMade,
            is_supply: isSupply,
            taxonomy_id: taxonomyId
          };
          
          const response = await etsyClient.createDraftListing(shopId, listingData);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  listing_id: response.listing_id,
                  url: response.url,
                  message: 'Draft listing created successfully'
                })
              }
            ]
          };
        } catch (error: any) {
          console.error('Error creating draft listing:', error);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error.message || 'Unknown error',
                  message: 'Failed to create draft listing'
                })
              }
            ]
          };
        }
      }
    );

    // Upload an image to a listing tool
    this.server.tool(
      "uploadListingImage",
      {
        listingId: z.number().describe("The ID of the listing"),
        imageData: z.string().describe("Base64 encoded image data")
      },
      async ({ listingId, imageData }) => {
        try {
          const shopId = config.etsy.shopId;
          
          if (!shopId) {
            throw new Error('Shop ID is not set in configuration');
          }
          
          const response = await etsyClient.uploadListingImage(shopId, listingId, imageData);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  listing_image_id: response.listing_image_id,
                  message: 'Image uploaded successfully'
                })
              }
            ]
          };
        } catch (error: any) {
          console.error('Error uploading listing image:', error);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error.message || 'Unknown error',
                  message: 'Failed to upload image'
                })
              }
            ]
          };
        }
      }
    );

    // Get taxonomies tool
    this.server.tool(
      "getTaxonomies",
      {},
      async () => {
        try {
          const response = await etsyClient.getTaxonomies();
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: true,
                  taxonomies: response.results
                })
              }
            ]
          };
        } catch (error: any) {
          console.error('Error fetching taxonomies:', error);
          
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: error.message || 'Unknown error'
                })
              }
            ]
          };
        }
      }
    );
  }
}
