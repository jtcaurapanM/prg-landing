import 'piccolore';
import { w as decodeKey } from './chunks/astro/server_RGMrMl5b.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_0cY48L_p.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/josecaurapan/workspace/prg-landing/","cacheDir":"file:///Users/josecaurapan/workspace/prg-landing/node_modules/.astro/","outDir":"file:///Users/josecaurapan/workspace/prg-landing/dist/","srcDir":"file:///Users/josecaurapan/workspace/prg-landing/src/","publicDir":"file:///Users/josecaurapan/workspace/prg-landing/public/","buildClientDir":"file:///Users/josecaurapan/workspace/prg-landing/dist/client/","buildServerDir":"file:///Users/josecaurapan/workspace/prg-landing/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"catalogo/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/catalogo","isIndex":true,"type":"page","pattern":"^\\/catalogo\\/?$","segments":[[{"content":"catalogo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/catalogo/index.astro","pathname":"/catalogo","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contacto","isIndex":false,"type":"page","pattern":"^\\/contacto\\/?$","segments":[[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contacto.astro","pathname":"/contacto","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"nosotros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/nosotros","isIndex":false,"type":"page","pattern":"^\\/nosotros\\/?$","segments":[[{"content":"nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/nosotros.astro","pathname":"/nosotros","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/send","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/send\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"send","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/send.ts","pathname":"/api/send","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"https://prginversiones.cl","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/josecaurapan/workspace/prg-landing/src/pages/catalogo/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/catalogo/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/josecaurapan/workspace/prg-landing/src/pages/catalogo/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/josecaurapan/workspace/prg-landing/src/pages/contacto.astro",{"propagation":"in-tree","containsHead":true}],["/Users/josecaurapan/workspace/prg-landing/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/josecaurapan/workspace/prg-landing/src/pages/nosotros.astro",{"propagation":"in-tree","containsHead":true}],["/Users/josecaurapan/workspace/prg-landing/src/layouts/BaseLayout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/catalogo/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/contacto@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/nosotros@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/send@_@ts":"pages/api/send.astro.mjs","\u0000@astro-page:src/pages/catalogo/[slug]@_@astro":"pages/catalogo/_slug_.astro.mjs","\u0000@astro-page:src/pages/catalogo/index@_@astro":"pages/catalogo.astro.mjs","\u0000@astro-page:src/pages/contacto@_@astro":"pages/contacto.astro.mjs","\u0000@astro-page:src/pages/nosotros@_@astro":"pages/nosotros.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Bbciq31G.mjs","/Users/josecaurapan/workspace/prg-landing/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_Bo8Q1bfL.mjs","/Users/josecaurapan/workspace/prg-landing/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts":"_astro/BaseLayout.astro_astro_type_script_index_0_lang.CJ1qTNKu.js","/Users/josecaurapan/workspace/prg-landing/src/components/forms/QuoteForm.astro?astro&type=script&index=0&lang.ts":"_astro/QuoteForm.astro_astro_type_script_index_0_lang.Cy9QNcUD.js","/Users/josecaurapan/workspace/prg-landing/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/josecaurapan/workspace/prg-landing/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts","const n=e=>document.getElementById(e);function d(){const e=n(\"scroll-progress\"),t=n(\"navbar\"),s=document.documentElement.scrollHeight-window.innerHeight,o=s>0?window.scrollY/s*100:0;e.style.width=`${o}%`,window.scrollY>20?(t.classList.add(\"shadow-md\"),t.classList.remove(\"border-gray-100\")):(t.classList.remove(\"shadow-md\"),t.classList.add(\"border-gray-100\"))}window.addEventListener(\"scroll\",d,{passive:!0});let r=!1;function m(){r=!0;const e=n(\"mobile-menu\"),t=n(\"mobile-overlay\");e.style.maxHeight=e.scrollHeight+\"px\",t.classList.remove(\"opacity-0\",\"pointer-events-none\"),t.classList.add(\"opacity-100\"),n(\"icon-open\").classList.add(\"hidden\"),n(\"icon-close\").classList.remove(\"hidden\"),n(\"mobile-menu-btn\").setAttribute(\"aria-expanded\",\"true\"),document.body.style.overflow=\"hidden\"}function i(){r=!1;const e=n(\"mobile-menu\"),t=n(\"mobile-overlay\");e.style.maxHeight=\"0px\",t.classList.add(\"opacity-0\",\"pointer-events-none\"),t.classList.remove(\"opacity-100\"),n(\"icon-open\").classList.remove(\"hidden\"),n(\"icon-close\").classList.add(\"hidden\"),n(\"mobile-menu-btn\").setAttribute(\"aria-expanded\",\"false\"),document.body.style.overflow=\"\"}function y(){const e=n(\"mobile-menu-btn\"),t=n(\"mobile-overlay\"),s=n(\"mobile-menu\"),o=e.cloneNode(!0);e.replaceWith(o);const c=t.cloneNode(!0);t.replaceWith(c),o.addEventListener(\"click\",()=>r?i():m()),c.addEventListener(\"click\",i),s.querySelectorAll(\"a\").forEach(a=>a.addEventListener(\"click\",i)),window.addEventListener(\"resize\",()=>{r&&(n(\"mobile-menu\").style.maxHeight=n(\"mobile-menu\").scrollHeight+\"px\"),window.innerWidth>=768&&i()})}document.addEventListener(\"keydown\",e=>{e.key===\"Escape\"&&r&&i()});document.addEventListener(\"astro:before-swap\",()=>{i()});function u(e){const t=document.querySelector(`[data-product-card][data-slug=\"${e}\"]`),s=t?.querySelector(\"[data-card-image]\"),o=t?.querySelector(\"[data-card-content]\");s&&(s.style.viewTransitionName=`product-img-${e}`),o&&(o.style.viewTransitionName=`product-info-${e}`)}function g(){document.querySelectorAll(\"[data-card-image], [data-card-content]\").forEach(e=>{e.style.viewTransitionName=\"\"})}function v(){document.querySelectorAll(\"[data-product-card]\").forEach(e=>{e.addEventListener(\"click\",()=>{const t=e.dataset.slug??\"\";u(t),sessionStorage.setItem(\"lastProductSlug\",t)})})}document.addEventListener(\"astro:after-swap\",()=>{const e=sessionStorage.getItem(\"lastProductSlug\");e&&u(e)});document.addEventListener(\"astro:page-load\",()=>{g();const e=window.location.pathname.match(/\\/catalogo\\/([^/]+)/);e&&sessionStorage.setItem(\"lastProductSlug\",e[1]),d(),y(),v();const t=window.location.pathname;document.querySelectorAll(\"[data-nav-link]\").forEach(s=>{const o=s,c=o.getAttribute(\"href\")??\"\",a=c!==\"/\"?t.startsWith(c):t===\"/\";o.setAttribute(\"aria-current\",a?\"page\":\"false\"),o.classList.toggle(\"text-[#F4622A]\",a),o.classList.toggle(\"text-gray-600\",!a);const l=o.querySelector(\"[data-nav-indicator]\");l&&(l.style.display=a?\"block\":\"none\")})});"],["/Users/josecaurapan/workspace/prg-landing/src/components/forms/QuoteForm.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"quote-form\"),s=document.getElementById(\"form-submit\"),d=document.getElementById(\"btn-text\"),o=document.getElementById(\"btn-spinner\"),c=document.getElementById(\"form-success\"),n=document.getElementById(\"form-error\"),i=document.getElementById(\"product-ref\");if(i){const e=new URLSearchParams(window.location.search).get(\"producto\");e&&(i.value=decodeURIComponent(e))}t?.addEventListener(\"submit\",async e=>{e.preventDefault(),c.classList.add(\"hidden\"),n.classList.add(\"hidden\"),s.disabled=!0,d.textContent=\"Enviando...\",o.classList.remove(\"hidden\");const a=Object.fromEntries(new FormData(t).entries());try{(await fetch(\"/api/send\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(a)})).ok?(c.classList.remove(\"hidden\"),t.reset()):n.classList.remove(\"hidden\")}catch{n.classList.remove(\"hidden\")}finally{s.disabled=!1,d.textContent=\"Enviar cotización\",o.classList.add(\"hidden\")}});"]],"assets":["/_astro/_slug_.C624-3mh.css","/favicon.ico","/favicon.svg","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js","/catalogo/index.html","/contacto/index.html","/nosotros/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"ivJW74M2Ir+ErVPmmiKF6ug+Kv0wmL4E/ESt5AKpl7U="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
