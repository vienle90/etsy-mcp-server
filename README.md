# Etsy MCP Server

An MCP (Model Context Protocol) server for integrating with the Etsy API, built with Node.js and TypeScript.

## Project Overview

This server provides a programmatic interface for creating and managing Etsy listings without using the web interface, focusing specifically on the creation of new listings for a handmade items store.

## Features

- OAuth 2.0 authentication with the Etsy API
- Tools for creating and managing Etsy listings
- Image upload functionality
- Taxonomy and property management

## Setup

1. Clone the repository
2. Install dependencies with `yarn install`
3. Copy `.env.example` to `.env` and add your Etsy API credentials
4. Build the project with `yarn build`
5. Start the server with `yarn start`

## Development

To run the server in development mode with hot reloading:

```bash
yarn dev
```

## API Documentation

The server exposes the following endpoints:

- `/auth`: Start the OAuth authentication flow
- `/callback`: OAuth callback endpoint
- `/api/listings`: MCP endpoint for listing operations

## Technologies

- Node.js
- TypeScript
- Express
- Axios
- OAuth 2.0
