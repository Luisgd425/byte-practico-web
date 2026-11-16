// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Cambia esta URL cuando compres el dominio (sirve para sitemap, canónicas y RSS)
  site: 'https://bytepractico.com',
  vite: {
    plugins: [tailwindcss()]
  },

  // /buscar no se indexa, así que tampoco va en el sitemap
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/buscar') })]
});
