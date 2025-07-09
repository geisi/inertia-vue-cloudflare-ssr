import createServer from '@inertiajs/vue3/server';
import { renderPage } from './ssr-shared';

createServer(renderPage, { cluster: true });
