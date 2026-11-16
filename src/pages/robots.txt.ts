// robots.txt generado con la URL del sitio de astro.config.mjs
import type { APIContext } from 'astro';

export function GET({ site }: APIContext) {
  const body = `User-agent: *
Allow: /
Disallow: /buscar

Sitemap: ${new URL('sitemap-index.xml', site).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
