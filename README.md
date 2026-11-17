# Byte Práctico

Sitio de noticias y guías prácticas de tecnología e IA en español. Hecho con Astro y Tailwind, publicado gratis en Cloudflare Workers.

- Sitio: https://byte-practico.byte-practico-web.workers.dev (cámbialo en `astro.config.mjs` si compras dominio)
- Guía editorial: [docs/guia-editorial.md](docs/guia-editorial.md)
- Resumen diario automático: [docs/resumen-diario.md](docs/resumen-diario.md)

## Correr el sitio en tu computadora

Necesitas Node.js 22.23 o más nuevo (versión LTS de nodejs.org).

```bash
npm install          # solo la primera vez
npm run dev          # abre http://localhost:4321 (se ven también los borradores)
npm run build        # genera el sitio final en dist/ (sin borradores) y el buscador
npm run preview      # muestra el resultado de build, con buscador
```

Las claves (AdSense, GA4, beehiiv, etc.) van en un archivo `.env`. Cópialo de [.env.example](.env.example), que explica cada una. `.env` nunca se sube a GitHub.

## Publicar un artículo

1. Crea un archivo en `src/content/articulos/`, por ejemplo `mi-articulo.mdx`. El nombre del archivo es la URL: `/articulos/mi-articulo`.
2. Copia el encabezado de uno de los artículos de ejemplo y cambia los datos:

   ```yaml
   ---
   title: "Título (máx. 110 caracteres)"
   description: "Resumen para Google (máx. 170 caracteres)"
   pubDate: 2026-11-16
   category: tutoriales # noticias-ia | herramientas-ia | tutoriales | productividad | gadgets
   heroImage: ../../assets/articulos/mi-imagen.png
   heroAlt: "Descripción de la imagen"
   sources:
     - title: "Nombre de la fuente"
       url: "https://..."
   draft: true
   ---
   ```

3. Pon la imagen en `src/assets/articulos/`. Astro la convierte a WebP/AVIF.
4. Escribe el texto en Markdown y revísalo con `npm run dev`.
5. Pasa la checklist de [docs/guia-editorial.md](docs/guia-editorial.md).
6. Cambia `draft: true` por `draft: false`.
7. Sube el cambio a GitHub (en VS Code: Control de código fuente → Commit → Sync, o en la terminal):

   ```bash
   git add -A
   git commit -m "Nuevo artículo: mi-articulo"
   git push
   ```

   Cloudflare publica el sitio solo en 1-2 minutos.

Los borradores del resumen diario llegan como Pull Request en GitHub. Ver [docs/resumen-diario.md](docs/resumen-diario.md).

## Actualizar los IDs de AdSense, beehiiv y Google

Se configuran en dos lugares con los mismos nombres:

- **Tu computadora:** archivo `.env`.
- **El sitio publicado:** Cloudflare → Workers & Pages → `byte-practico` → Settings → **Build** → **Variables and secrets** (las de *Build*, no las de *Runtime*: Astro las lee al construir). Después de cambiarlas, ve a Deployments y vuelve a desplegar el último (o haz cualquier push) para que se apliquen.

| Variable | Dónde se obtiene |
| --- | --- |
| `PUBLIC_ADSENSE_CLIENT` | AdSense → Cuenta → Información de la cuenta (`ca-pub-…`) |
| `PUBLIC_ADSENSE_SLOT_TOP`, `_MID`, `_SIDEBAR` | AdSense → Anuncios → Por bloque de anuncios → Display |
| `PUBLIC_USE_GOOGLE_CMP` | `true` si activas el mensaje de AdSense → Privacidad y mensajes |
| `PUBLIC_GA4_ID` | Google Analytics → Administrar → Flujos de datos (`G-…`) |
| `PUBLIC_GSC_VERIFICATION` | Search Console → verificación por etiqueta HTML (solo el valor de `content`) |
| `PUBLIC_BEEHIIV_EMBED_URL` | beehiiv → Audience → Subscribe forms → Embed (URL del `src`) |
| `PUBLIC_FORMSPREE_ID` | Formspree → tu formulario (la parte final de la URL) |

Con AdSense también hay que editar [public/ads.txt](public/ads.txt): cambia `pub-0000000000000000` por tu número de publicador.

Si una variable está vacía, esa función no se muestra (no hay anuncios, ni formulario, etc.).

## Checklist antes de solicitar AdSense

AdSense **no acepta subdominios gratuitos** como `byte-practico.byte-practico-web.workers.dev`: necesitas un dominio propio (desde ~10 USD al año, por ejemplo en Cloudflare Registrar o Porkbun). Mientras, sigue publicando contenido.

- [ ] Dominio propio conectado en Cloudflare (Settings → Domains & Routes → Add → Custom domain) y `site` actualizado en `astro.config.mjs`.
- [ ] Al menos 15–20 artículos originales publicados (`draft: false`), con tu experiencia y fuentes citadas.
- [ ] Ningún artículo es texto de IA sin revisar.
- [ ] Páginas completas y con tus datos: Sobre nosotros, Contacto, Política de privacidad, Cookies, Términos y Aviso legal.
- [ ] El correo de contacto funciona y lo revisas.
- [ ] Menú y categorías funcionan; no hay enlaces rotos ni páginas vacías.
- [ ] Lighthouse en móvil ≥ 90 (Chrome → F12 → Lighthouse).
- [ ] Sitio verificado en Google Search Console y sitemap enviado (`/sitemap-index.xml`).
- [ ] Llevas publicando con regularidad unas semanas.
- [ ] Al aprobarte: `public/ads.txt` con tu ID, variables de AdSense en Cloudflare y mensaje de Privacidad y mensajes si recibes visitas de Europa.
