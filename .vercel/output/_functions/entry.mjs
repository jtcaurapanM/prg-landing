import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DVSfmLb6.mjs';
import { manifest } from './manifest_Dyq7fPfm.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/send.astro.mjs');
const _page2 = () => import('./pages/catalogo/_slug_.astro.mjs');
const _page3 = () => import('./pages/catalogo.astro.mjs');
const _page4 = () => import('./pages/contacto.astro.mjs');
const _page5 = () => import('./pages/nosotros.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/send.ts", _page1],
    ["src/pages/catalogo/[slug].astro", _page2],
    ["src/pages/catalogo/index.astro", _page3],
    ["src/pages/contacto.astro", _page4],
    ["src/pages/nosotros.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "159774d2-8dc5-4661-8524-150caa056867",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
