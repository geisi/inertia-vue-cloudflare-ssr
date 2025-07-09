import { createInertiaApp } from '@inertiajs/vue3';
import { renderToString } from '@vue/server-renderer';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createSSRApp, DefineComponent, h } from 'vue';
import { route as ziggyRoute } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export async function renderPage(page: any) {
  try {
    return await createInertiaApp({
      page,
      render: renderToString,
      title: (title) => title ? `${title} - ${appName}` : appName,
      resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
      setup({ App, props, plugin }) {
        const app = createSSRApp({ render: () => h(App, props) });

        // Configure Ziggy for SSR
        if (page.props.ziggy) {
          const ziggyConfig = {
            ...page.props.ziggy,
            location: new URL(page.props.ziggy.location),
          };

          const route = (name: string, params?: any, absolute?: boolean) => 
            ziggyRoute(name, params, absolute, ziggyConfig);

          app.config.globalProperties.route = route;

          // Make route function available globally for SSR
          if (typeof window === 'undefined') {
            if (typeof global !== 'undefined') {
              global.route = route;
            }
            if (typeof globalThis !== 'undefined') {
              globalThis.route = route;
            }
          }
        }

        app.use(plugin);
        return app;
      },
    });
  } catch (error) {
    console.error('[SSR] Render error:', error);
    throw error;
  }
}