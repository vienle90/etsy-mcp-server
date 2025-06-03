# Etsy MCP Server

A Model Context Protocol (MCP) server for Etsy API integration, built with Node.js and TypeScript. This server provides a standardized way for Claude Desktop to programmatically manage Etsy listings without using the web interface.

## Features

- OAuth 2.0 authentication with Etsy API
- Create draft listings
- Upload images to listings
- Get taxonomy information (categories)
- Compatible with Claude Desktop through the Model Context Protocol

## Prerequisites

- Node.js 16+
- Yarn package manager
- Etsy Developer account with API key
- Etsy Shop
- Claude Desktop

## Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/etsy-mcp-server.git
cd etsy-mcp-server
```

2. Install dependencies

```bash
yarn install
```

3. Create a `.env` file based on `.env.example` and fill in your Etsy API credentials

```
# Etsy API credentials
ETSY_API_KEY=your_api_key_here  # This is also your Client ID
ETSY_CLIENT_SECRET=your_client_secret_here
ETSY_SHOP_ID=your_shop_id_here

# OAuth settings
ETSY_REDIRECT_URI=http://localhost:3000/callback
ETSY_SCOPES=listings_r listings_w shops_r

# Server configuration
PORT=3000
```

4. Build the project

```bash
yarn build
```

5. Start the server

```bash
yarn start
```

The server will be available at `http://localhost:3000`.

6. Authenticate with Etsy

Visit `http://localhost:3000` in your browser and click the authentication link. After successful authentication, your tokens will be saved.

7. Find your Etsy shop ID

```bash
yarn find:shop-id
```

Update your `.env` file with the shop ID displayed.

## Connecting to Claude Desktop

1. Make sure the MCP server is running (`yarn start`)
2. Open Claude Desktop
3. Click on "Settings" > "MCP Servers" > "Add New Server"
4. Enter the following information:
   - Name: Etsy MCP Server
   - URL: http://localhost:3000/mcp
5. Click "Add Server"
6. Claude will automatically discover the available tools

## Using the MCP Server with Claude Desktop

Once connected, you can ask Claude to perform actions like:

- "Create a new Etsy listing for a handmade ceramic mug"
- "Upload an image to my Etsy listing"
- "Show me the available Etsy categories"

Claude will use the MCP server to perform these actions through the Etsy API.

## Available MCP Tools

- `createDraftListing` - Create a draft listing on Etsy
- `uploadListingImage` - Upload an image to a listing
- `getTaxonomies` - Get all listing taxonomies

## Development

Build the project:

```bash
yarn build
```

Run in development mode with auto-reload:

```bash
yarn dev
```

## Project Structure

```
etsy-mcp-server/
├── src/
│   ├── api/         # Etsy API client
│   ├── auth/        # OAuth authentication
│   ├── config/      # Configuration
│   ├── models/      # TypeScript interfaces
│   ├── tools/       # MCP tools implementation
│   ├── config.ts    # Configuration loader
│   ├── index.ts     # Main entry point
│   └── mcp-server.ts # MCP server implementation
├── .env.example     # Example environment variables
├── package.json     # Project dependencies
└── tsconfig.json    # TypeScript configuration
```

## License

MIT
