/**
 * Cloudflare Worker for Mustache Adder
 * Replaces the Express.js server while maintaining the same functionality
 */

import { getAsset, serveAsset } from './assets';

export interface Env {
  // Environment variables and bindings can be added here
}

// Logging function that matches the original server's logging
function log(message: string, source = "worker") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Handle static asset requests
async function handleStaticAsset(request: Request): Promise<Response> {
  const url = new URL(request.url);
  let path = url.pathname;
  
  // Normalize path
  if (path === '/') {
    path = '/index.html';
  }
  
  // Try to serve the requested file
  const asset = getAsset(path);
  if (asset) {
    const response = serveAsset(asset);
    
    // Add cache headers for static assets
    const headers = new Headers(response.headers);
    if (path !== '/index.html') {
      headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year for assets
    } else {
      headers.set('Cache-Control', 'public, max-age=0'); // No cache for index.html
    }
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
  
  // For SPA routing, serve index.html for any unmatched route (except API routes)
  if (!path.startsWith('/api')) {
    const indexAsset = getAsset('/index.html');
    if (indexAsset) {
      const response = serveAsset(indexAsset);
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=0');
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    }
  }
  
  return new Response('Not Found', { status: 404 });
}

// Handle API requests (placeholder for future API routes)
async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Currently no API routes are implemented, so return 404
  return new Response(
    JSON.stringify({ message: "API route not found" }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const start = Date.now();
    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
      let response: Response;
      
      if (path.startsWith("/api")) {
        // Handle API requests
        response = await handleApiRequest(request);
      } else {
        // Handle static assets and SPA routing
        response = await handleStaticAsset(request);
      }
      
      // Log the request (matching the original Express middleware behavior)
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${request.method} ${path} ${response.status} in ${duration}ms`;
        
        // If response has JSON, include it in the log
        if (response.headers.get("Content-Type")?.includes("application/json")) {
          try {
            const responseClone = response.clone();
            const jsonResponse = await responseClone.json();
            logLine += ` :: ${JSON.stringify(jsonResponse)}`;
          } catch (e) {
            // Ignore JSON parsing errors for logging
          }
        }
        
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }
        
        log(logLine);
      }
      
      return response;
    } catch (error) {
      log(`Unhandled error: ${error}`);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};