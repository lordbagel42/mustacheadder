# Cloudflare Worker Migration

This document describes the conversion of the Express.js application to Cloudflare Workers while maintaining the same functionality.

## Overview

The application has been successfully converted from Express.js to Cloudflare Workers with the following key changes:

### Architecture Changes

1. **Server Framework**: Replaced Express.js with Cloudflare Workers fetch handler
2. **Static Asset Serving**: Implemented build-time asset generation with embedded files
3. **Request Handling**: Converted Express middleware to Worker request/response handling
4. **Logging**: Maintained the same logging format and behavior
5. **SPA Routing**: Preserved single-page application routing for React

### Key Files Added

- `worker/index.ts` - Main Cloudflare Worker handler
- `worker/assets.ts` - Auto-generated static asset map (created during build)
- `scripts/generate-assets.ts` - Build-time script to generate asset map
- `wrangler.toml` - Cloudflare Worker configuration

### Build Process

The new build process consists of:

1. **Frontend Build**: Vite builds the React application to `dist/public/`
2. **Asset Generation**: `generate-assets.ts` scans `dist/public/` and creates `worker/assets.ts`
3. **Worker Build**: esbuild bundles the worker code including embedded assets
4. **Output**: `dist/worker.js` contains the complete Cloudflare Worker

### New Scripts

```bash
npm run build:worker    # Build the Cloudflare Worker
npm run dev:worker      # Start local development with Wrangler
npm run start:worker    # Deploy to Cloudflare (requires auth)
```

### Functionality Preserved

✅ **Static File Serving**: All CSS, JS, and HTML assets are served correctly
✅ **SPA Routing**: Unknown routes serve `index.html` for client-side routing  
✅ **API Route Handling**: `/api/*` routes are handled separately from static assets
✅ **Request Logging**: Same logging format for API requests with timing and response data
✅ **Error Handling**: Proper error responses with JSON formatting
✅ **Cache Headers**: Appropriate caching for static assets vs. HTML

### Performance Benefits

- **Global Edge Distribution**: Cloudflare Workers run at 300+ edge locations worldwide
- **No Cold Starts**: Workers start in milliseconds vs. seconds for traditional servers
- **Built-in CDN**: Static assets are automatically distributed globally
- **Serverless**: No server management required

### Deployment

1. **Setup Cloudflare Account**: Create account and get API token
2. **Install Wrangler**: `npm install -g wrangler` (if not already installed)
3. **Authenticate**: `wrangler login`
4. **Deploy**: `npm run start:worker`

### Development

For local development, use:
```bash
npm run dev:worker
```

This starts a local server on `http://localhost:8787` with hot reload for both frontend and worker changes.

### Configuration

The `wrangler.toml` file configures:
- Worker name and compatibility date
- Build command
- Environment-specific settings
- Asset handling (for future enhancements)

### Migration Notes

- The original Express.js server code remains unchanged in `server/` for reference
- All existing scripts (`npm run dev`, `npm run build`, `npm run start`) continue to work
- The Worker version is completely self-contained with no external dependencies
- Face detection and client-side functionality work identically to the original

This migration maintains 100% functional compatibility while providing the benefits of Cloudflare's global edge network.