# Stache Stash - Distinguished Photo Editing

This project was made exclusively with AI for a 2025 OneStone deep dive on AI.

A vintage-themed photo editing web application that automatically adds distinguished mustaches to photos using face detection technology.

## Features

- 🎭 **Face Detection**: Automatic face recognition using face-api.js
- 🥸 **Mustache Styles**: Multiple vintage mustache options (Classic, Handlebar, Victorian, Walrus, Pencil Thin)
- 🎨 **Photo Editor**: HTML5 Canvas-based image manipulation
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Modern Stack**: React 18, TypeScript, Tailwind CSS, shadcn/ui

## Deployment Options

This application supports two deployment methods:

### 1. Traditional Express.js Server

```bash
npm install
npm run build
npm start
```

### 2. Cloudflare Workers (Recommended)

For global edge deployment with zero cold starts:

```bash
npm install
npm run build:worker
npm run start:worker  # Requires Cloudflare account
```

For local development:
```bash
npm run dev:worker    # Starts on http://localhost:8787
```

See [CLOUDFLARE_MIGRATION.md](./CLOUDFLARE_MIGRATION.md) for detailed migration information.

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

**Express.js version:**
```bash
npm run dev          # Starts on http://localhost:5000
```

**Cloudflare Worker version:**
```bash
npm run dev:worker   # Starts on http://localhost:8787
```

### Architecture

- **Frontend**: React 18 with Vite build system
- **UI Components**: shadcn/ui with Radix UI primitives  
- **Styling**: Tailwind CSS with vintage theme
- **Face Detection**: face-api.js for client-side processing
- **Backend**: Express.js or Cloudflare Workers
- **Storage**: In-memory with extensible interface for databases

## Project Structure

```
├── client/              # React frontend
├── server/              # Express.js backend  
├── worker/              # Cloudflare Worker code
├── shared/              # Shared TypeScript schemas
├── scripts/             # Build scripts
└── dist/                # Build output
```

## Technologies

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- face-api.js
- Express.js or Cloudflare Workers
- HTML5 Canvas for image manipulation 
