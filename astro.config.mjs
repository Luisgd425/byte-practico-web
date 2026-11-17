// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL pública del sitio (sitemap, canónicas y RSS). Gratis en Cloudflare Pages; cámbiala si compras dominio.
  site: 'https://byte-practico.pages.dev',
  vite: {
    plugins: [tailwindcss()]
  },

  // /buscar no se indexa, así que tampoco va en el sitemap
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/buscar') })]
});
