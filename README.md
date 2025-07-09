# Laravel Vue.js Starter Kit with Cloudflare Workers SSR

This project extends the standard Laravel Vue.js starter kit to support **Cloudflare Workers SSR** alongside traditional Node.js SSR. It demonstrates how to deploy InertiaJS Vue SSR to Cloudflare's edge network for global distribution.

## What's Different from Standard Laravel Starter Kit

### 🚀 **Cloudflare Workers SSR Support**
- SSR runs at 200+ global edge locations instead of a single server
- Automatic scaling with zero server management
- Pay-per-request model instead of always-on servers

### 📁 **Additional Files**
- `resources/js/ssr-shared.ts` - Shared SSR logic for both Node.js and Workers
- `resources/js/worker.ts` - Cloudflare Worker entry point
- `wrangler.toml` - Cloudflare Workers configuration
- Enhanced `vite.config.ts` - Supports dual build modes

### 📦 **New Dependencies**
- `@inertiajs/server` - InertiaJS server-side rendering
- `wrangler` - Cloudflare Workers CLI

### 🛠 **New npm Scripts**
- `npm run build:worker` - Build for Cloudflare Workers
- `npm run dev:worker` - Local Worker development
- `npm run deploy:worker` - Deploy to Cloudflare Workers

## Quick Start

1. **Clone the project**
   ```bash
   git clone https://github.com/geisi/inertia-vue-cloudflare-ssr.git
   cd inertia-vue-cloudflare-ssr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build SSR (required by InertiaJS)**
   ```bash
   npm run build:ssr
   ```

4. **Run Worker Locally**
   ```bash
   npm run dev:worker
   ```
   
5. **Configure local worker URL in `.env`**
   ```env
   INERTIA_SSR_URL=http://localhost:8787
   ```
   (Use the URL shown by the `npm run dev:worker` command)

## Deployment

```bash
# Login to Cloudflare
npx wrangler login

# Build and deploy
npm run build:worker
npm run deploy:worker
```

**Update your `.env` file:**
```env
INERTIA_SSR_URL=https://your-worker-name.your-subdomain.workers.dev
```

## Configuration

### Switching Between SSR Modes

```env
# Traditional Node.js SSR (default Laravel starter kit)
INERTIA_SSR_URL=http://127.0.0.1:13714

# Local Cloudflare Workers SSR (development)
INERTIA_SSR_URL=http://localhost:8787

# Production Cloudflare Workers SSR
INERTIA_SSR_URL=https://your-worker-name.your-subdomain.workers.dev
```

### Worker Configuration

Update `wrangler.toml` with your worker name:
```toml
name = "your-app-name-ssr"
```

## How It Works

1. **Shared SSR Logic**: `ssr-shared.ts` contains the SSR rendering logic used by both Node.js and Workers
2. **Dual Build System**: Vite config detects `WORKER_BUILD=true` and builds for Workers instead of Node.js
3. **Worker Entry**: `worker.ts` handles HTTP requests and calls the shared SSR logic
4. **Seamless Switch**: Change `INERTIA_SSR_URL` to switch between traditional and Workers SSR

## Benefits Over Standard Laravel SSR

- **Global Edge Rendering**: 200+ locations vs single server
- **Zero Server Management**: No need to manage Node.js servers
- **Automatic Scaling**: Handles traffic spikes automatically
- **Cost Efficiency**: Pay per request instead of always-on servers
- **Better Performance**: Reduced latency with edge rendering
