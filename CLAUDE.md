# PRG Inversiones — Sitio Corporativo

## Idioma

- Responder siempre en español.
- Código, variables y comentarios técnicos en inglés.
- No mezclar idiomas en nombres de archivos o funciones.

---

## Descripción del Proyecto

Sitio web corporativo estático para PRG Inversiones (imprenta y soluciones gráficas industriales).

Incluye:

- Landing corporativa
- Catálogo simple sin panel de administración
- Formulario de cotización
- SEO técnico inicial
- Optimización de rendimiento

No incluye:

- Backend
- Base de datos
- CMS
- Sistema de usuarios
- Carrito de compras

---

## Stack Técnico

- Astro 5 (output: static)
- Adaptador: @astrojs/vercel
- Tailwind 4
- TypeScript (strict mode)
- Astro Image
- Sitemap
- Resend (npm package)

Arquitectura estática con un único endpoint serverless para el formulario de cotización.
Solo `src/pages/api/send.ts` tiene `export const prerender = false`.

---

## Deployment

Plataforma objetivo: Vercel

- Build command: `npm run build`
- Output: `dist`
- Adaptador: @astrojs/vercel (requerido para el endpoint serverless)
- El resto del sitio se genera estático; solo /api/send es serverless
- Base URL configurada si es necesario para producción

---

## Formulario de Cotización

El formulario se implementa con Resend.

Arquitectura:

- Frontend envía POST a /api/send
- Endpoint serverless en Astro:
  src/pages/api/send.ts
- Resend envía correo usando API key en variable de entorno

Requisitos:

- Validación básica de campos
- Manejo de error y éxito
- No exponer API key en frontend
- Usar variables de entorno:
  RESEND_API_KEY
  RESEND_FROM
  CONTACT_EMAIL
- ocupar fetch

No usar servicios externos tipo Formspree.

---

## Objetivo del Sitio

Transmitir:

- Profesionalismo industrial
- Sustentabilidad
- Certificación FSC
- Confianza corporativa
- Rapidez y eficiencia

---

## Branding

Colores principales:

- Naranja: #F4622A (Pantone 172C aproximado)
- Negro: #101820 (Pantone Black 6C aproximado)
- Blanco como base neutra

Tipografía:

- Preferencia: Gotham (si licencia válida)
- Alternativa libre: Plus Jakarta Sans (Google Fonts)

Importación recomendada:

<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

Estética:

- Minimalista
- Industrial
- Limpia
- Espaciado amplio
- Uso moderado del naranja como acento

---

## Arquitectura del Proyecto

src/
components/ # UI reutilizable (Button, Card, Container, etc.)
sections/ # Bloques de página específicos (HeroSection, ServicesSection)
layouts/ # BaseLayout
pages/ # Rutas
data/ # products.ts
assets/ # Imágenes optimizadas

Diferencia:

- components/ = UI genérico reutilizable
- sections/ = bloques estructurales de página

---

## Catálogo

Generado desde:

/src/data/products.ts

Cada producto debe tener:

- name
- slug
- category
- description
- specs (array)
- images (array)
- featured (boolean opcional)

Las páginas se generan con getStaticPaths.

---

## Convenciones de Código

- Componentes en PascalCase (HeroSection.astro)
- Archivos de datos en camelCase (products.ts)
- Variables en camelCase
- Rutas en kebab-case
- No usar estado global
- No usar React/Vue salvo necesidad extrema
- No usar CSS tradicional salvo casos excepcionales
- Tailwind utility-first
- No usar <style> salvo justificación clara

---

## Principios Técnicos

- Priorizar performance
- Minimizar JavaScript
- Mobile-first
- Accesibilidad básica (alt, aria, contraste)
- SEO obligatorio en cada página:
  - title
  - meta description
  - Open Graph
  - URLs limpias

---

## Comandos del Proyecto

Dev:
npm run dev

Build:
npm run build

Preview:
npm run preview

---

## Reglas Importantes

- No agregar dependencias innecesarias.
- No convertir el proyecto en SPA.
- Mantener arquitectura simple y mantenible.
- Código limpio, organizado y profesional.
