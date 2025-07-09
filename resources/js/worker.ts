import { renderPage } from '../../dist/ssr.js';

export default {
  async fetch(request: Request): Promise<Response> {
    // Only handle POST requests to /render endpoint
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/render') {
      return new Response('Not found', { status: 404 });
    }

    try {
      // Parse the request body
      const body = await request.text();
      let data;

      try {
        data = JSON.parse(body);
      } catch (parseError) {
        console.error('[Worker] JSON parse error:', parseError);
        return new Response('Invalid JSON', { status: 400 });
      }

      // Extract page data
      const page = data.page || data;

      // Validate required page data
      if (!page || !page.component) {
        console.error('[Worker] Missing page data or component');
        return new Response('Missing page data or component', { status: 400 });
      }

      // Render the page using shared SSR logic
      const ssrResult = await renderPage(page);

      // Format response
      if (typeof ssrResult === 'object' && ssrResult !== null) {
        const jsonResponse = {
          head: ssrResult.head || [],
          body: ssrResult.body || ''
        };

        return new Response(JSON.stringify(jsonResponse), {
          headers: {
            'content-type': 'application/json',
            'cache-control': 'no-cache, no-store, must-revalidate',
            'pragma': 'no-cache',
            'expires': '0'
          }
        });
      } else {
        console.error('[Worker] SSR result is not an object:', ssrResult);
        return new Response('SSR render failed - invalid result format', { status: 500 });
      }
    } catch (error) {
      console.error('[Worker] Error:', error);
      return new Response(`Internal server error: ${error.message}`, { status: 500 });
    }
  }
};