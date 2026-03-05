# PRG Inversiones — Análisis Completo del Proyecto

> Documento generado el 05-03-2026. Sirve como contexto de referencia y como guía de mejoras técnicas para alcanzar performance extraordinario, cero bugs en mobile/web y compatibilidad cross-browser.

---

## Índice

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
2. [Stack Técnico](#2-stack-técnico)
3. [Arquitectura y Estructura de Archivos](#3-arquitectura-y-estructura-de-archivos)
4. [Inventario de Archivos — Descripción Detallada](#4-inventario-de-archivos--descripción-detallada)
5. [Flujos Críticos](#5-flujos-críticos)
6. [Análisis de Mejoras — Performance, Bugs y Cross-Browser](#6-análisis-de-mejoras--performance-bugs-y-cross-browser)
7. [Checklist de Implementación Priorizada](#7-checklist-de-implementación-priorizada)

---

## 1. Descripción del Proyecto

**PRG Inversiones** es un sitio web corporativo estático para una imprenta de soluciones gráficas industriales radicada en Santiago, Chile.

### Objetivo

Transmitir profesionalismo industrial, sustentabilidad certificada (FSC C143583), confianza corporativa y rapidez de cotización. El sitio no gestiona pedidos ni tiene panel de administración: es una vitrina digital que convierte visitas en solicitudes de cotización.

### Páginas Públicas

| Ruta | Propósito |
|---|---|
| `/` | Landing principal |
| `/nosotros` | Historia, valores y certificación FSC |
| `/catalogo` | Catálogo completo con filtros por categoría |
| `/catalogo/[slug]` | Ficha detallada de cada producto (17 páginas) |
| `/contacto` | Formulario de cotización |
| `/api/send` | Endpoint serverless (Resend) |

---

## 2. Stack Técnico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Astro | ^5.17.1 |
| CSS | Tailwind CSS v4 | ^4.2.1 |
| Tipos | TypeScript (strict) | — |
| Email | Resend | ^6.9.3 |
| Adapter | @astrojs/vercel | ^9.0.4 |
| SEO/Sitemap | @astrojs/sitemap | ^3.7.0 |
| Fuente | Gotham (local TTF/OTF) | — |
| Deploy | Vercel | — |

### Modo de salida

`output: "static"` — todo el sitio genera HTML estático en `dist/client/`. Solo `src/pages/api/send.ts` tiene `export const prerender = false`, lo que fuerza a Vercel a crear una serverless function solo para ese endpoint.

---

## 3. Arquitectura y Estructura de Archivos

```
prg-landing/
├── astro.config.mjs          # Config central: site, output, adapter, vite
├── tsconfig.json             # TypeScript strict + aliases @/, @components/, etc.
├── package.json              # Dependencias
├── CLAUDE.md                 # Reglas del proyecto para el agente AI
├── PROJECT_ANALYSIS.md       # Este documento
├── .gitignore
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── logoPRG.svg           # Logo corporativo
│   ├── robots.txt
│   └── Certificado-FSC-2023.pdf
└── src/
    ├── env.d.ts              # Tipos de variables de entorno
    ├── styles/
    │   └── global.css        # Tailwind v4 + @font-face Gotham + View Transitions
    ├── assets/
    │   ├── fonts/            # Gotham: Light, Book Italic, Medium, Bold, Ultra (TTF/OTF)
    │   └── images/
    │       └── logoPRG.svg
    ├── data/
    │   ├── categories.ts     # 4 categorías con slugs, labels y descripciones
    │   └── products.ts       # 17 productos con interface Product
    ├── lib/
    │   └── email-templates.ts # HTML emails Resend (notificación + confirmación)
    ├── layouts/
    │   └── BaseLayout.astro  # Shell HTML: head, navbar, footer, scripts globales
    ├── components/
    │   ├── Navbar.astro      # Sticky, dropdown catálogo, menú mobile
    │   ├── catalog/
    │   │   └── ProductCard.astro
    │   ├── forms/
    │   │   └── QuoteForm.astro
    │   └── ui/
    │       ├── Badge.astro
    │       └── Button.astro
    ├── sections/
    │   ├── HeroSection.astro
    │   ├── ServicesSection.astro
    │   ├── FscSection.astro
    │   ├── FeaturedProductsSection.astro
    │   ├── CapabilitiesSection.astro
    │   └── ContactCTASection.astro
    └── pages/
        ├── index.astro
        ├── nosotros.astro
        ├── contacto.astro
        ├── catalogo/
        │   ├── index.astro
        │   └── [slug].astro
        └── api/
            └── send.ts
```

---

## 4. Inventario de Archivos — Descripción Detallada

### `astro.config.mjs`

- `site: "https://prg.cl"` — usado por el sitemap y las URLs canónicas.
- `output: "static"` — genera HTML puro salvo el endpoint serverless.
- `adapter: vercel()` — necesario para el endpoint `/api/send`.
- `integrations: [sitemap()]` — genera `/sitemap-index.xml` automáticamente.
- `image.remotePatterns` — solo permite imágenes de `*.unsplash.com` en el componente `<Image>`.
- `vite.plugins: [tailwindcss()]` — integra Tailwind v4 via plugin de Vite.

---

### `tsconfig.json`

Extiende `astro/tsconfigs/strict`. Aliases definidos:

```json
{
  "@/*": ["./src/*"],
  "@components/*": ["./src/components/*"],
  "@layouts/*": ["./src/layouts/*"],
  "@sections/*": ["./src/sections/*"],
  "@data/*": ["./src/data/*"]
}
```

---

### `src/env.d.ts`

Declara el tipo de las variables de entorno para TypeScript:

```typescript
interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM: string;
  readonly CONTACT_EMAIL: string;
}
```

**Nota:** El archivo existe pero la declaración real está en Astro internamente via `astro/client`. Revisar si las variables están correctamente tipadas en el archivo actual.

---

### `src/styles/global.css`

El único archivo CSS del proyecto. Contiene:

1. **`@import "tailwindcss"`** — carga completa de Tailwind v4.
2. **`@font-face` × 10** — fuente Gotham para pesos 300, 400, 500, 600-700, 900 (normal + italic). Todos con `font-display: swap` y overrides de métricas (`ascent-override: 80%`, `descent-override: 20%`) para normalizar el baseline en Safari y Firefox.
3. **Caret naranja** en inputs/textarea.
4. **Fix iOS Safari** — `font-size: 16px !important` en inputs para prevenir zoom automático.
5. **`scroll-padding-top: 88px`** — compensa el navbar sticky en scroll a anclas.
6. **`@theme`** — define tokens CSS de Tailwind v4: fuente, colores de marca.
7. **View Transitions CSS** — crossfade de 280ms, morph de cards 500ms, soporte de navegación hacia atrás y `prefers-reduced-motion`.

---

### `src/data/categories.ts`

Define las 4 categorías del catálogo con:
- `CATEGORY_LABELS` — `Record<CategorySlug, string>` para mostrar nombres.
- `CATEGORY_DESCRIPTIONS` — `Record<CategorySlug, string>` para el subtítulo en catálogo filtrado.
- `type CategorySlug` — union type de los 4 slugs válidos.

---

### `src/data/products.ts`

Fuente de verdad del catálogo. 17 productos con interface:

```typescript
interface Product {
  name: string;
  slug: string;
  category: CategorySlug;
  shortDesc: string;
  description: string;
  specs: string[];
  materials: string[];
  images: string[];    // URLs Unsplash
  featured?: boolean;
  fscEligible?: boolean;
}
```

Productos destacados (`featured: true`): Tarjetas de Presentación, Carpetas Corporativas, Gigantografías PVC, Brandeo Vehicular, Credenciales y Lanyards, Cajas de Lujo, Etiquetas Industriales.

**Todas las imágenes son URLs de Unsplash externas.** No hay imágenes reales de productos en el repositorio.

---

### `src/lib/email-templates.ts`

Dos funciones exportadas que retornan `{ subject, html, text }`:

- **`buildNotificationEmail(data)`** — email interno al equipo PRG. Incluye datos del contacto, línea de interés con pills naranjas, producto/cantidad de referencia, mensaje completo y botón CTA `mailto:`.
- **`buildConfirmationEmail(data)`** — email al usuario. Incluye saludo personalizado, badge de éxito verde, 3 pasos del proceso y resumen de la solicitud.

Ambos usan:
- MSO conditionals para Outlook (`<!--[if mso]>`).
- Layout `table`-based compatible con todos los clientes de email.
- Función `esc()` para escapar HTML en datos del usuario (prevención XSS en emails).

---

### `src/layouts/BaseLayout.astro`

Shell HTML completo. Props: `title`, `description`, `ogImage?` (default: `/og-default.jpg`), `canonical?`.

**`<head>` incluye:**
- Meta charset, viewport con `interactive-widget=resizes-visual` (fix teclado móvil).
- Title automático: añade `· PRG Inversiones` si el título no lo incluye.
- Meta description, canonical.
- Open Graph completo (title, description, image, url, type, locale, site_name).
- Twitter Card `summary_large_image`.
- Favicons SVG + ICO.
- `<ClientRouter />` — View Transitions de Astro.
- Schema.org `Organization` JSON-LD.

**`<body>` incluye:**
- `<Navbar transition:persist />`.
- `<main><slot /></main>`.
- Footer de 3 columnas: branding + FSC, servicios por categoría, contacto.
- Script global con: scroll shadow navbar, dirección de navegación (forward/back), card transitions para View Transitions, sync de filtros en `astro:after-swap`.

---

### `src/components/Navbar.astro`

Navbar sticky con `transition:persist` (no se re-renderiza en View Transitions).

**Desktop:** Logo SVG, 4 links con indicador activo (subrayado naranja), dropdown de catálogo por categoría al hover, botón "Cotizar ahora" naranja.

**Mobile:** Hamburger animado (open/close con rotación), panel deslizable con `max-height` transition, submenu expandible de categorías, botón "Cotizar ahora".

**Script incluye:**
- `openMenu()` / `closeMenu()` con `body.overflow` lock.
- `updateMobileNavActive()` — sincroniza clases CSS según la ruta actual.
- `initCatalogMobileSubmenu()` — toggle del submenu con recalculo de altura del panel padre.
- `initMobileMenu()` — inicializa listeners, cierra al click fuera, recalcula altura en resize.
- Cierra con `Escape`, cierra en `astro:before-swap`, re-inicializa en `astro:page-load`.

---

### `src/components/catalog/ProductCard.astro`

Tarjeta de producto con:
- Imagen Unsplash con `aspect-[4/3]`, `object-cover`, hover `scale-105`.
- Badge "Destacado" (naranja) si `product.featured`.
- Categoría en gris pequeño.
- Nombre con hover naranja.
- `shortDesc`.
- Link "Ver ficha →".
- Atributos `data-product-card`, `data-slug`, `data-card-image`, `data-card-content` para el sistema de View Transitions del BaseLayout.

---

### `src/components/forms/QuoteForm.astro`

Formulario de cotización con dos modos: completo y `compact`.

**Campos:**
- `name` — requerido, validado (mín. 2 chars).
- `email` — requerido, validado con regex.
- `phone` — opcional, oculto en modo compact.
- `category` — chips de checkbox multi-select (4 categorías), requerido en modo no-compact.
- `productRef` — opcional, pre-rellenado desde `?producto=` URL param.
- `quantity` — select opcional (1-50, 51-200, 201-1000, 1000+).
- `message` — requerido, máx. 5000 chars, validado (mín. 10 chars).

**Comportamiento:**
- `novalidate` — validación 100% en JS.
- Live validation post-blur + mientras escribe si ya hubo error.
- Chips con visual check naranja al seleccionar.
- Submit deshabilitado con spinner durante el fetch.
- Mensajes de éxito/error inline.
- POST a `/api/send` con `Content-Type: application/json`.
- Re-inicializado en `astro:page-load` (compatible con View Transitions).

---

### `src/pages/api/send.ts`

Endpoint serverless. `export const prerender = false`.

**Pipeline de validación:**
1. Parsea el body como JSON (catch de errores de parseo → 400).
2. `sanitizeString()` — trim, maxLength, rechazo de vacíos.
3. `isValidEmail()` — regex + maxLength 254.
4. `validateCategories()` — split por coma, whitelist de 4 slugs válidos.
5. Verifica existencia de variables de entorno.

**Flujo de envío:**
1. Notificación interna al equipo PRG con `replyTo` del cliente.
2. Si falla: 500.
3. Confirmación al usuario (error no es bloqueante, solo se loguea).
4. Respuesta 200 `{ ok: true }`.

---

### `src/sections/HeroSection.astro`

Hero de pantalla completa (`min-h-[92vh]`) sobre fondo oscuro `#101820`. Imagen Unsplash con `loading="eager"`, `opacity-25`, gradiente lateral. Badge FSC animado, H1 con span naranja, párrafo descriptivo, 2 CTAs (Cotizar / Ver catálogo), 3 stats (14+ años, 4 líneas, FSC).

---

### `src/sections/FscSection.astro`

Sección de 2 columnas: copy detallado sobre la certificación FSC + iframe del PDF del certificado. Iframe con `loading="lazy"`, altura 420px mobile / full-height desktop.

---

### `src/pages/catalogo/index.astro`

Catálogo con filtrado 100% client-side:
- Todos los productos renderizados en el HTML estático.
- Filtros de categoría como `<button data-filter-btn>`.
- Al seleccionar un filtro: fade-out → ocultar cards → fade-in + actualizar URL con `history.replaceState`.
- En `astro:page-load`: lee `?categoria=` de la URL y aplica el filtro sin animación.
- En `astro:after-swap`: sincroniza el estado de los filtros al volver al catálogo con el botón atrás.

---

### `src/pages/catalogo/[slug].astro`

17 páginas generadas estáticamente con `getStaticPaths()`. Incluye:
- Breadcrumb semántico con `aria-label="Breadcrumb"`.
- Imagen con `transition:name` para el morph en View Transitions.
- Badges de categoría y "Destacado".
- Descripción del producto.
- Specs y materiales (actualmente ocultos con flags `SHOW_SPECS = false`, `SHOW_MATERIALS = false`).
- CTA "Cotizar este producto" → `/contacto?producto=...`.
- Productos relacionados (misma categoría, máx. 3).
- Schema.org `Product` JSON-LD.

---

### `src/pages/contacto.astro`

Layout de 2 columnas en desktop:
- Sidebar: "¿Por qué elegirnos?" con 4 items (respuesta 24h, sin compromiso, FSC, asesoría personalizada).
- Formulario `<QuoteForm>` en modo completo.
- Lee `?producto=` de la URL para pre-rellenar el campo de producto de referencia.

---

### `src/pages/nosotros.astro`

3 secciones inline (sin componentes externos):
- Header oscuro con H1.
- Historia: 2 párrafos + imagen Unsplash `loading="lazy"`.
- Valores: grid 3 cards con iconos SVG inline.
- FSC Detail: copy explicativo + iframe PDF + botón de descarga.

---

## 5. Flujos Críticos

### Flujo de Cotización

```
Usuario llena QuoteForm
  → Validación client-side (name, email, message, categories)
  → fetch POST /api/send { name, email, phone, category, productRef, quantity, message }
  → API valida y sanitiza
  → Resend.send() notificación a CONTACT_EMAIL con replyTo del cliente
  → Resend.send() confirmación al email del cliente
  → Respuesta { ok: true } → mensaje de éxito en UI
```

### Flujo de Navegación con View Transitions

```
Click en link de Astro
  → astro:before-swap: marca data-nav-direction (forward/back)
  → CSS crossfade 280ms (nueva página sobre la antigua)
  → astro:after-swap: sincroniza filtros del catálogo, restaura scroll
  → astro:page-load: re-inicializa scripts (Navbar, QuoteForm, filtros), limpia card transitions
```

### Flujo de Filtrado del Catálogo

```
Click en botón de categoría
  → fade out del grid (opacity 0, 150ms)
  → oculta/muestra cards con display none/''
  → actualiza URL con history.replaceState (sin reload)
  → actualiza estilos de botones activos
  → actualiza título y descripción
  → fade in del grid (opacity 1)
```

---

## 6. Análisis de Mejoras — Performance, Bugs y Cross-Browser

---

### 🔴 Crítico — Bugs y Errores de Producción

#### BUG-01: `ogImage` por defecto apunta a un archivo inexistente

**Archivo:** `src/layouts/BaseLayout.astro` línea 10  
**Problema:** `ogImage = "/og-default.jpg"` — este archivo no existe en `public/`. Las páginas que no pasan `ogImage` explícitamente tendrán una etiqueta `og:image` rota.  
**Impacto:** Vista previa en WhatsApp, LinkedIn, Twitter sin imagen.  
**Solución:** Crear `/public/og-default.jpg` (1200×630px) con branding PRG, o cambiar el default a `"/logoPRG.svg"` temporalmente.

---

#### BUG-02: Iframe PDF incompatible en iOS Safari y Firefox mobile

**Archivos:** `src/sections/FscSection.astro`, `src/pages/nosotros.astro`  
**Problema:** iOS Safari no renderiza PDFs en `<iframe>`. El contenedor queda vacío o muestra un error. Firefox en Android tampoco siempre lo soporta.  
**Impacto:** Sección FSC completamente rota en el dispositivo más común del usuario móvil chileno.  
**Solución:**

```html
<!-- Detectar soporte via JS o simplemente ofrecer fallback siempre -->
<div class="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style="height: 420px;">
  <object data="/Certificado-FSC-2023.pdf" type="application/pdf" class="w-full h-full">
    <!-- Fallback para iOS y móviles sin soporte de PDF inline -->
    <div class="flex flex-col items-center justify-center h-full gap-4 bg-gray-50 p-8 text-center">
      <svg .../>  <!-- ícono de documento -->
      <p class="text-gray-600 text-sm">Tu navegador no puede mostrar el PDF en línea.</p>
      <a href="/Certificado-FSC-2023.pdf" target="_blank" class="...">Ver certificado FSC</a>
    </div>
  </object>
</div>
```

---

#### BUG-03: `getEl()` en BaseLayout puede lanzar excepción si el DOM no está listo

**Archivo:** `src/layouts/BaseLayout.astro` línea 179  
**Problema:** `const getEl = (id: string) => document.getElementById(id)!` con el operador `!` (non-null assertion). Si el navbar no existe en el DOM (ej. renderizado SSR parcial o error de hydration), lanza `Cannot read property 'classList' of null`.  
**Solución:** Agregar null-check:

```typescript
function handleScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  // ...
}
```

---

#### BUG-04: `window.__validateCategories` — global contaminación y race condition

**Archivo:** `src/components/forms/QuoteForm.astro` línea 363  
**Problema:** Se expone una función en `window.__validateCategories` para comunicación entre dos bloques de `<script>`. Esto es frágil: si `initChips()` no corrió antes que `initForm()`, el submit del formulario no valida categorías. Además, múltiples instancias del formulario en una misma página se sobreescribirían.  
**Solución:** Mover la lógica de validación de categorías dentro de `initForm()`, pasándola como closure. Eliminar la global.

---

#### BUG-05: El formulario compact omite validación de categorías en modo no-compact de forma incorrecta

**Archivo:** `src/components/forms/QuoteForm.astro` línea 294-298  
**Problema:** La lógica es `typeof window.__validateCategories === 'function' ? call() : true`. Esto significa que si por alguna razón los chips no se inicializaron, el formulario se envía sin validar las categorías requeridas.  
**Solución:** Ver BUG-04. La validación de categorías debe estar acoplada al formulario, no a un global.

---

#### BUG-06: `isBackNav` en BaseLayout no se resetea correctamente en algunos navegadores

**Archivo:** `src/layouts/BaseLayout.astro` línea 196-200  
**Problema:** `isBackNav` se setea en `true` en el evento `popstate`, pero se resetea en `astro:page-load`. En navegadores donde `popstate` dispara tarde o el View Transition se cancela, el flag puede quedar en `true` para la próxima navegación forward.  
**Solución:** Resetear `isBackNav` en `astro:before-swap` además de en `astro:page-load`:

```typescript
document.addEventListener("astro:before-swap", () => {
  document.documentElement.dataset.navDirection = isBackNav ? "back" : "forward";
  // Reset aquí también, antes del swap
});
document.addEventListener("astro:page-load", () => {
  isBackNav = false;
  // ...
});
```

---

#### BUG-07: Falta `title` en el iframe de FscSection (nosotros.astro)

**Archivo:** `src/pages/nosotros.astro` línea 148  
**Problema:** El iframe del PDF en la página de nosotros no tiene atributo `title`. Esto es un error de accesibilidad y lectores de pantalla lo reportarán como "frame sin título".  
**Solución:** Añadir `title="Certificado FSC C143583 — PRG Inversiones"`.

---

#### BUG-08: `aria-current="false"` es semánticamente incorrecto

**Archivos:** `Navbar.astro` líneas 45, 98, etc.  
**Problema:** `aria-current` debe ser `"page"` cuando está activo, y **ausentar el atributo** cuando no lo está. `aria-current="false"` no es el valor correcto para "inactivo" según la especificación ARIA.  
**Solución:** Usar `undefined` en lugar de `"false"`:

```astro
aria-current={isActive(href) ? "page" : undefined}
```

Nota: algunos links ya lo hacen bien (mobile), otros usan `"false"` (desktop). Unificar.

---

### 🟠 Alta Prioridad — Performance

#### PERF-01: Imágenes externas de Unsplash sin optimización Astro

**Archivos:** `HeroSection.astro`, `nosotros.astro`, `ProductCard.astro`, `[slug].astro`  
**Problema:** Todas las imágenes de productos y secciones usan `<img src="https://...unsplash.com/...">` directamente, sin el componente `<Image>` de Astro. Esto significa:
- Sin optimización de formato (WebP/AVIF no garantizado).
- Sin lazy loading inteligente.
- Sin `srcset` para responsive images.
- Sin dimensiones fijas que prevengan CLS (Cumulative Layout Shift).
- Las imágenes de cards no tienen `decoding="async"`.

**Solución para imágenes críticas (LCP):** Usar `<Image>` de `astro:assets` para la imagen del hero y la primera imagen de cada producto en el catálogo. Para las externas de Unsplash, al menos forzar el formato añadiendo `&fm=webp` a las URLs.

```astro
---
import { Image } from 'astro:assets';
---
<!-- Hero -->
<Image
  src="https://images.unsplash.com/photo-...?w=1600&q=80&fm=webp"
  alt="..."
  width={1600}
  height={900}
  loading="eager"
  fetchpriority="high"
  class="w-full h-full object-cover opacity-25"
/>
```

---

#### PERF-02: Fuentes Gotham en TTF/OTF sin WOFF2

**Archivo:** `src/styles/global.css`  
**Problema:** Los `@font-face` referencian archivos `.ttf` y `.otf`. WOFF2 es el formato óptimo para web: 30-40% más ligero que TTF y soportado en todos los navegadores modernos. Con 10 archivos de fuente, el impacto es considerable.  
**Solución:** Convertir los archivos a WOFF2 y actualizar los `@font-face`:

```css
@font-face {
  font-family: 'Gotham';
  src: url('../assets/fonts/Gotham-Light.woff2') format('woff2'),
       url('../assets/fonts/Gotham Light.ttf') format('truetype'); /* fallback */
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  ascent-override: 80%;
  descent-override: 20%;
  line-gap-override: 0%;
}
```

---

#### PERF-03: Sin `preload` de fuentes críticas

**Problema:** Las fuentes Gotham Medium y Bold (los pesos más usados en el sitio) no tienen `<link rel="preload">`. El navegador las descarga tarde, causando FOUT (Flash of Unstyled Text).  
**Solución:** En `BaseLayout.astro`, añadir preload para los pesos críticos:

```html
<link rel="preload" href="/fonts/Gotham-Medium.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Gotham-Bold.woff2" as="font" type="font/woff2" crossorigin />
```

Mover las fuentes a `public/fonts/` para que sean accesibles como rutas absolutas.

---

#### PERF-04: Sin `fetchpriority="high"` en la imagen del hero (LCP)

**Archivo:** `src/sections/HeroSection.astro`  
**Problema:** La imagen del hero es el LCP (Largest Contentful Paint) del sitio pero no tiene `fetchpriority="high"`. El navegador la descarga con prioridad normal.  
**Solución:**

```html
<img
  src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80&fm=webp"
  alt="Producción industrial de impresión"
  width="1600"
  height="900"
  loading="eager"
  fetchpriority="high"
  decoding="async"
  class="w-full h-full object-cover opacity-25"
/>
```

---

#### PERF-05: Sin `decoding="async"` en imágenes no-LCP

**Archivos:** Múltiples  
**Problema:** Las imágenes con `loading="lazy"` deberían también tener `decoding="async"` para no bloquear el hilo principal durante el decode de la imagen.  
**Solución:** Añadir `decoding="async"` a todas las imágenes excepto la del hero (que tiene `loading="eager"` y puede usar `decoding="sync"` para el LCP).

---

#### PERF-06: Ausencia de `og:image` real (relacionado con BUG-01)

**Impacto SEO y performance social:** Cuando se comparte el sitio en redes sociales, sin una imagen OG válida los scrapers hacen múltiples requests fallidos, ralentizan el crawl y la vista previa queda en blanco.

---

#### PERF-07: `<script type="application/ld+json" set:html={...}>` en `[slug].astro` puede causar XSS teórico

**Archivo:** `src/pages/catalogo/[slug].astro` línea 39  
**Problema:** `set:html={JSON.stringify(structuredData)}` — `JSON.stringify` no escapa caracteres como `</script>` dentro de strings. Si algún producto tuviera `</script>` en su `name` o `description`, podría inyectarse HTML.  
**Solución:**

```astro
---
const safeJson = JSON.stringify(structuredData).replace(/<\//g, '<\\/');
---
<script type="application/ld+json" set:html={safeJson} />
```

---

### 🟡 Media Prioridad — Mejoras de Calidad

#### MEJ-01: `font-weight: 400` usa el mismo archivo que `font-weight: 300`

**Archivo:** `src/styles/global.css` línea 37-45  
**Problema:** No existe "Gotham Book" (peso 400 regular) en los assets, por lo que se usa `Gotham Light.ttf` también para `font-weight: 400`. Esto hace que el texto "normal" se vea igual que el "light". Si el cliente puede proveer el archivo Gotham Book, añadirlo solucionaría la jerarquía visual.  
**Alternativa:** Usar Plus Jakarta Sans como fallback en el `@theme`:

```css
--font-sans: 'Gotham', 'Plus Jakarta Sans', sans-serif;
```

---

#### MEJ-02: `SHOW_SPECS = false` y `SHOW_MATERIALS = false` — contenido oculto con valor SEO

**Archivo:** `src/pages/catalogo/[slug].astro` líneas 15-16  
**Problema:** Las especificaciones y materiales de cada producto están cargados en la data pero se ocultan con flags booleanos. Este contenido tiene alto valor para SEO (keywords técnicas como gramajes, formatos, materiales). Además la UI de la página de producto se ve vacía sin estos datos.  
**Solución:** Activar al menos las specs, o diseñar una UI alternativa que muestre parte de esta información (ej: solo la primera spec, o las specs más relevantes).

---

#### MEJ-03: Instancia `new Resend(apiKey)` se crea en cada request

**Archivo:** `src/pages/api/send.ts` línea 98  
**Problema:** En serverless, cada invocación crea una nueva instancia de `Resend`. En Vercel esto es normal (no hay estado persistente), pero la validación de env vars también ocurre en cada request. El impacto es mínimo pero puede optimizarse.  
**Solución (opcional):** Mover la instanciación a nivel de módulo, aprovechando el warm start de Vercel:

```typescript
// Nivel de módulo — se ejecuta una vez en warm start
const apiKey = import.meta.env.RESEND_API_KEY;
const fromEmail = import.meta.env.RESEND_FROM;
const toEmail = import.meta.env.CONTACT_EMAIL;
const resend = apiKey ? new Resend(apiKey) : null;
```

---

#### MEJ-04: Sin rate limiting en el endpoint `/api/send`

**Archivo:** `src/pages/api/send.ts`  
**Problema:** No hay ningún mecanismo para limitar el número de solicitudes por IP o por período de tiempo. Un atacante puede enviar miles de emails usando el endpoint, agotando el cupo de Resend.  
**Solución:** Usar el sistema de rate limiting de Vercel Edge Config o añadir un header check. La solución más simple sin dependencias extra:

```typescript
// En el endpoint, verificar el origen
const origin = request.headers.get('origin');
const referer = request.headers.get('referer');
if (!origin?.includes('prg.cl') && !referer?.includes('prg.cl')) {
  return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
}
```

O usar Vercel's built-in rate limiting en `vercel.json`.

---

#### MEJ-05: Sin Content Security Policy (CSP)

**Problema:** El sitio no tiene headers de seguridad configurados. Esto es especialmente relevante porque se embeben iframes de PDFs locales, se cargan fuentes locales y se usan scripts inline.  
**Solución:** Crear `vercel.json` con headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

#### MEJ-06: Sin `robots.txt` optimizado y falta `sitemap` en `robots.txt`

**Archivo:** `public/robots.txt`  
**Problema:** El robots.txt existe pero probablemente no referencia el sitemap dinámico generado por `@astrojs/sitemap`.  
**Solución:**

```
User-agent: *
Allow: /

Sitemap: https://prg.cl/sitemap-index.xml
```

---

#### MEJ-07: Sin `.env.example` en el repositorio

**Problema:** Cualquier desarrollador que clone el repositorio no sabe qué variables de entorno son requeridas hasta que el servidor falla.  
**Solución:** Crear `.env.example`:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=cotizaciones@prg.cl
CONTACT_EMAIL=equipo@prg.cl
```

---

#### MEJ-08: Logo en `public/` duplicado en `src/assets/`

**Archivos:** `public/logoPRG.svg` y `src/assets/images/logoPRG.svg`  
**Problema:** El logo existe en ambas ubicaciones. El Navbar usa `<img src="/logoPRG.svg">` (desde public), mientras que `src/assets/images/logoPRG.svg` no parece usarse en ningún componente. Duplicación innecesaria.  
**Solución:** Eliminar el SVG de `src/assets/images/` si no se está usando con `<Image>`.

---

#### MEJ-09: `scroll-padding-top` hardcodeado a 88px

**Archivo:** `src/styles/global.css` línea 139  
**Problema:** El padding de scroll está hardcodeado a 88px que corresponde a la altura actual del navbar. Si la altura del navbar cambia (ej: en breakpoints pequeños), el padding será incorrecto.  
**Solución:** Usar una custom property CSS y setearla dinámicamente desde el script del navbar:

```css
html {
  scroll-padding-top: var(--navbar-height, 88px);
}
```

```typescript
// En el script del Navbar, después de cada page-load:
document.documentElement.style.setProperty(
  '--navbar-height',
  document.getElementById('navbar')?.offsetHeight + 'px' ?? '88px'
);
```

---

#### MEJ-10: Falta `lang` en el iframe del certificado

**Archivos:** `FscSection.astro`, `nosotros.astro`  
**Problema menor:** Los iframes de PDF no tienen el atributo `title` en FscSection (solo en nosotros sí lo tiene). Ver BUG-07.

---

### 🔵 Mejoras de Accesibilidad

#### ACC-01: Imágenes sin `alt` descriptivo en cards de productos relacionados

**Archivo:** `src/pages/catalogo/[slug].astro` línea 79  
**Problema:** Las imágenes secundarias de un producto usan `alt={${product.name} - imagen ${i + 2}}`. Es aceptable pero podría ser más descriptivo.

---

#### ACC-02: Indicador de foco no visible en todos los navegadores

**Problema:** Los estilos de focus usan `focus:outline-none focus:ring-2`. En navegadores que no soportan Tailwind purge correctamente, los rings pueden no verse. Verificar que el outline sea visible en Firefox y Safari con navegación por teclado.  
**Solución:** Agregar `focus-visible:outline-2 focus-visible:outline-[#F4622A]` explícitamente en los elementos interactivos principales.

---

#### ACC-03: El hamburger button carece de descripción actualizada al abrir

**Archivo:** `Navbar.astro` línea 119  
**Problema:** `aria-label="Abrir menú"` no cambia a "Cerrar menú" cuando el menú está abierto. El `aria-expanded` sí se actualiza, pero el label debería cambiar.  
**Solución:** Actualizar el `aria-label` en `openMenu()` y `closeMenu()`.

---

#### ACC-04: Los chips de categoría del formulario no son accesibles por teclado de forma obvia

**Archivo:** `QuoteForm.astro`  
**Problema:** Los chips son `<label>` con `<input type="checkbox" class="sr-only">`. La navegación por teclado funciona (Tab → Space para activar), pero el focus visual no es obvio porque el checkbox está oculto.  
**Solución:** Añadir `:focus-within` al chip para mostrar un ring de focus:

```css
.category-chip:focus-within {
  outline: 2px solid #F4622A;
  outline-offset: 2px;
}
```

---

### 🟣 Cross-Browser — Compatibilidad

#### CB-01: `interactive-widget=resizes-visual` solo soportado en Chrome

**Archivo:** `BaseLayout.astro` línea 29  
**Problema:** `content="width=device-width, initial-scale=1, interactive-widget=resizes-visual"` — esta propiedad solo es reconocida por Chrome para controlar cómo el teclado virtual afecta el viewport. En Safari y Firefox es ignorada (no causa error, pero no tiene efecto).  
**Estado:** Actualmente aceptable como progressive enhancement.

---

#### CB-02: `::view-transition-*` CSS no soportado en Firefox < 130

**Archivo:** `src/styles/global.css`  
**Problema:** Las View Transitions CSS (`::view-transition-old`, `::view-transition-new`, etc.) no son soportadas en Firefox 129 y anteriores. Aunque Astro ya maneja el fallback gracefully (carga normal sin transición), los estilos CSS aún se parsean.  
**Estado:** No es un bug, solo una degradación elegante. Astro `<ClientRouter>` tiene su propio feature detection.

---

#### CB-03: `aspect-ratio` podría no funcionar en Safari 14

**Archivos:** Múltiples (`aspect-[4/3]`, `aspect-video`, `aspect-square`)  
**Problema:** `aspect-ratio` no es soportado en Safari 14 (lanzado 2020). Safari 15+ lo soporta. La cuota de Safari 14 en Chile es muy baja (< 1%) pero existe.  
**Solución (opcional):** Usar el truco del padding para fallback:

```html
<div class="relative" style="padding-bottom: 75%"> <!-- 4:3 -->
  <img class="absolute inset-0 w-full h-full object-cover" ... />
</div>
```

O simplemente aceptar la limitación dado el bajo impacto.

---

#### CB-04: `font-weight: 600 700` en un solo `@font-face` — spec válida pero Safari 14 podría ignorar el rango

**Archivo:** `src/styles/global.css` línea 83  
**Problema:** La sintaxis `font-weight: 600 700` (rango) es CSS Fonts Level 4. Safari 14 puede no soportarla correctamente.  
**Solución:** Duplicar la declaración para mayor compatibilidad:

```css
@font-face {
  font-family: 'Gotham';
  src: url('../assets/fonts/Gotham Bold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  ascent-override: 80%;
  descent-override: 20%;
  line-gap-override: 0%;
}
@font-face {
  font-family: 'Gotham';
  src: url('../assets/fonts/Gotham Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  ascent-override: 80%;
  descent-override: 20%;
  line-gap-override: 0%;
}
```

---

#### CB-05: Menú mobile `max-height` transition podría tener cálculo incorrecto en Safari

**Archivo:** `Navbar.astro`  
**Problema:** `menu.style.maxHeight = menu.scrollHeight + "px"` calcula el `scrollHeight` en el momento del click. En Safari, si hay un layout recalculation pendiente, el `scrollHeight` puede ser 0 o incorrecto.  
**Solución:** Forzar un reflow antes de leer `scrollHeight`:

```typescript
function openMenu() {
  const menu = getEl("mobile-menu");
  menu.style.display = 'block'; // Force reflow
  void menu.offsetHeight;       // Trigger reflow
  menu.style.maxHeight = menu.scrollHeight + "px";
  // ...
}
```

---

#### CB-06: `group-hover` del dropdown del catálogo puede tener problemas en touch devices

**Archivo:** `Navbar.astro` línea 71  
**Problema:** El dropdown de catálogo usa CSS `:hover` (`.group-hover:opacity-100`). En tablets con pantalla táctil, el hover no funciona igual: un primer tap activa el hover, el segundo navega. En touch puro (sin mouse), el dropdown puede aparecer brevemente y luego cerrarse.  
**Solución:** Añadir soporte de touch al dropdown o hacer que el link `/catalogo` siempre sea navegable directamente:

```javascript
// En el script del Navbar, detectar touch:
document.querySelectorAll('.group').forEach(group => {
  group.addEventListener('touchstart', (e) => {
    // Toggle clase en lugar de depender del :hover CSS
    e.currentTarget.classList.toggle('touch-active');
  }, { passive: true });
});
```

---

### 🟤 Deuda Técnica

#### DT-01: CLAUDE.md dice `output: "hybrid"` pero astro.config.mjs tiene `output: "static"`

**Problema:** Discrepancia entre documentación y configuración real. El output `"static"` funciona correctamente (Astro maneja el endpoint serverless con `prerender = false`), pero la documentación está desactualizada.  
**Solución:** Actualizar CLAUDE.md a `output: "static"`.

---

#### DT-02: `CATEGORY_LABELS` está duplicado en `categories.ts` y `email-templates.ts`

**Archivos:** `src/data/categories.ts`, `src/lib/email-templates.ts`  
**Problema:** El mapa de slugs a labels existe en dos lugares. Si se añade una categoría, hay que actualizar ambos.  
**Solución:** Importar desde `categories.ts` en `email-templates.ts`. Sin embargo, `email-templates.ts` es código de servidor puro (`import.meta.env`) y `categories.ts` es isomórfico, así que el import es seguro.

```typescript
// email-templates.ts
import { CATEGORY_LABELS as CAT_LABELS } from '../data/categories';
const CATEGORY_LABELS = CAT_LABELS as Record<string, string>;
```

---

#### DT-03: Imágenes de productos son URLs externas de Unsplash (sin imágenes reales)

**Problema:** El sitio en producción muestra imágenes de stock que no representan los productos reales de PRG. Esto afecta la credibilidad y conversión.  
**Solución (largo plazo):** Reemplazar con fotografías reales de los productos. Mientras tanto, usar imágenes de Unsplash más representativas de impresión gráfica.

---

#### DT-04: `SHOW_SPECS = false` — código muerto cargado en cada build

**Archivo:** `src/pages/catalogo/[slug].astro`  
**Problema:** Se cargan specs y materiales en el HTML pero se ocultan con flags false. Esto aumenta el tamaño del JS bundle de datos innecesariamente (aunque mínimo en este caso).  
**Solución:** Si no se van a usar, filtrar en `getStaticPaths()` o directamente en `products.ts`.

---

## 7. Checklist de Implementación Priorizada

### Sprint 1 — Crítico (bloquea producción)

- [ ] **BUG-01** — Crear `/public/og-default.jpg` (1200×630px)
- [ ] **BUG-02** — Reemplazar iframes PDF con `<object>` + fallback mobile
- [ ] **BUG-03** — Añadir null-checks en `getEl()` y `handleScroll()`
- [ ] **BUG-07** — Añadir `title` al iframe de `nosotros.astro`
- [ ] **BUG-08** — Cambiar `aria-current="false"` por `undefined` en Navbar desktop

### Sprint 2 — Performance (impacto en Core Web Vitals)

- [ ] **PERF-01** — Añadir `&fm=webp` a URLs de Unsplash + `<Image>` para imágenes críticas
- [ ] **PERF-02** — Convertir fuentes Gotham a WOFF2
- [ ] **PERF-03** — Añadir `<link rel="preload">` para fuentes Bold y Medium
- [ ] **PERF-04** — Añadir `fetchpriority="high"` a imagen del hero
- [ ] **PERF-05** — Añadir `decoding="async"` a imágenes lazy

### Sprint 3 — Bugs de lógica y seguridad

- [ ] **BUG-04** / **BUG-05** — Eliminar `window.__validateCategories` global
- [ ] **BUG-06** — Corregir reset de `isBackNav` 
- [ ] **PERF-07** — Sanitizar JSON-LD en `[slug].astro`
- [ ] **MEJ-04** — Añadir rate limiting básico al endpoint `/api/send`
- [ ] **MEJ-05** — Crear `vercel.json` con security headers

### Sprint 4 — Calidad y accesibilidad

- [ ] **MEJ-01** — Activar `SHOW_SPECS` o diseñar UI para mostrar información de productos
- [ ] **MEJ-02** — Activar specs y materiales en ficha de producto
- [ ] **MEJ-07** — Crear `.env.example`
- [ ] **MEJ-08** — Eliminar logo duplicado en `src/assets/images/`
- [ ] **MEJ-09** — Usar CSS custom property para `--navbar-height`
- [ ] **DT-02** — Centralizar `CATEGORY_LABELS` en `categories.ts`
- [ ] **ACC-03** — Actualizar `aria-label` del hamburger al abrir/cerrar
- [ ] **ACC-04** — Añadir `:focus-within` a chips de categoría

### Sprint 5 — Cross-browser

- [ ] **CB-04** — Separar `font-weight: 600 700` en dos declaraciones `@font-face`
- [ ] **CB-05** — Forzar reflow antes de leer `scrollHeight` en mobile menu
- [ ] **CB-06** — Manejar touch en dropdown de catálogo desktop
- [ ] **MEJ-06** — Verificar y actualizar `robots.txt` con URL del sitemap
- [ ] **DT-01** — Actualizar CLAUDE.md con `output: "static"`

---

*Este documento debe actualizarse cada vez que se implementen mejoras significativas al proyecto.*
