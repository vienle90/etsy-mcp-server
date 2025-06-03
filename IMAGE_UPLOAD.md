# File Path-Based Image Uploads for Etsy MCP Server

## Overview

This document outlines how to use the file path-based image uploads in the Etsy MCP server to avoid token limitations when working with Claude Desktop.

## Problem Statement

Base64-encoded images consume excessive tokens, potentially exceeding Claude's limits. By accepting file paths instead of base64 strings, we can enable efficient image uploads through the MCP protocol.

## Setup Instructions

1. Place your images in the designated directory:
   ```bash
   /Users/vien.le/etsy-listings/
   ```

2. Make sure the images are in a format supported by Etsy (JPG, PNG, GIF)

3. You can organize images in subfolders (see Organization section below)

## Usage

When working with Claude Desktop, you can now upload images to your Etsy listings using file paths:

```
User: "I want to upload an image to my Etsy listing with ID 12345."
Claude: "I can help you with that. Where is the image located on your computer?"
User: "The image is in /Users/vien.le/etsy-listings/ceramic-mugs/blue-mug.jpg"
Claude: "I'll upload that image to your Etsy listing now."
```

Claude will use the `uploadListingImageFromPath` MCP tool with the provided file path.

## Organization

You can organize your images using subfolders by product category:

```
/Users/vien.le/etsy-listings/
├── ceramic-mugs/
│   ├── blue-mug.jpg
│   ├── red-mug.jpg
│   └── detail-shots/
│       ├── handle-closeup.jpg
│       └── glaze-detail.jpg
├── wooden-crafts/
│   ├── cutting-board.jpg
│   └── coaster-set.jpg
└── jewelry/
    ├── earrings/
    └── necklaces/
```

This organization helps you maintain a clean structure as your product catalog grows.

## Benefits

- Minimal token usage (only passes the file path)
- Works with images of any size
- Direct MCP integration without extra steps
- Simple implementation
- Better security controls

## Security Considerations

- Path validation prevents directory traversal attacks
- File existence verification before reading
- Access restricted to allowed directories
- Proper error handling with informative messages

## Implementation Details

The feature provides an MCP tool called `uploadListingImageFromPath` that accepts:
- `listingId`: The ID of the listing
- `imagePath`: Path to the image file on the server

This is the **only** image upload method available, which:
1. Validates the path for security
2. Checks if the file exists
3. Reads and encodes the image
4. Uploads it to the Etsy API
5. Returns a success response with the listing image ID

**Note:** The base64 image upload method has been intentionally removed to prevent token limit issues with Claude Desktop.

## Troubleshooting

If you encounter issues:

1. Check if the file exists at the specified path
2. Ensure the file is a valid image format
3. Verify that the listing ID is correct
4. Check the server logs for detailed error messages
