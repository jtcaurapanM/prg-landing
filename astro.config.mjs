// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://prg.cl",
  output: "static",
  adapter: vercel(),
  integrations: [sitemap()],
  image: {
    remotePatterns: [{ protocol: "https", hostname: "**.unsplash.com" }],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
