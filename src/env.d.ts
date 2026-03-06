/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM: string;
  readonly CONTACT_EMAIL: string;
  /** "true" → muestra la página de construcción en todo el sitio. Cambiar en Vercel y redesplegar. */
  readonly MAINTENANCE_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
