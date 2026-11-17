# Resumen diario (borrador automático)

El script `scripts/daily-digest.ts` lee las fuentes de `scripts/sources.json`, toma lo publicado en las últimas 24 h, quita duplicados y pide a un modelo de IA un **borrador** con 5 noticias. Nunca publica nada.

Genera dos archivos con la fecha de Ciudad Juárez:

- `src/content/borradores/AAAA-MM-DD-resumen.md`: el artículo, con `draft: true`.
- `newsletter/AAAA-MM-DD.html`: la versión para beehiiv.

Los enlaces a las fuentes salen de los feeds, no de la IA, así que no puede inventar URLs. Aun así, **verifica cada noticia** antes de publicar.

## Costo

- **Gratis:** Gemini de Google con `GEMINI_API_KEY`, sin tarjeta. Tiene límite de peticiones por día, y una al día queda muy por debajo. A cambio, Google puede usar lo que le envías para mejorar sus productos. Aquí solo se envían titulares públicos de noticias, nada personal.
- **De pago:** Claude con `ANTHROPIC_API_KEY`. Si la clave existe, se usa en lugar de Gemini.

## Correrlo en tu computadora

1. Entra a [aistudio.google.com](https://aistudio.google.com) con tu cuenta de Google.
2. Haz clic en **Get API key** y luego en **Create API key**. Copia la clave.
3. Pégala en `.env` como `GEMINI_API_KEY=...`, sin espacios ni comillas.
4. Corre:

   ```bash
   npm run digest
   ```

5. Abre `npm run dev`: en local, los borradores sí se ven.

Si quieres regenerar el del día, corre `npm run digest -- --force`.

## Automático cada mañana (GitHub Actions)

El archivo `.github/workflows/daily-digest.yml` corre todos los días a las 6:00 a. m. de Ciudad Juárez. Genera el borrador y abre un Pull Request.

Una sola vez, después de subir el proyecto a GitHub (fase 5):

1. En tu repositorio ve a **Settings → Secrets and variables → Actions → New repository secret**. Nombre: `GEMINI_API_KEY`. Valor: tu clave de Gemini.
2. Ve a **Settings → Actions → General**.
3. En **Workflow permissions**, marca **Read and write permissions**.
4. Marca también **Allow GitHub Actions to create and approve pull requests**.
5. Guarda.
6. Para probarlo, ve a **Actions → Resumen diario → Run workflow**.

## Revisar y publicar el borrador

1. Abre el Pull Request y entra a **Files changed**.
2. Edita el `.md`: verifica cada noticia en su fuente, añade tu opinión y, si quieres, `heroImage` y `heroAlt`.
3. Cambia `draft: true` por `draft: false`.
4. Aprueba y haz **Merge**. Cloudflare publica el sitio solo.
5. Copia el contenido de `newsletter/AAAA-MM-DD.html` a beehiiv (bloque HTML) y envíalo.

Si un borrador no te sirve, cierra el PR sin hacer merge.

## Cambiar las fuentes

Edita `scripts/sources.json`. Cada fuente lleva un `name` y la `url` de un feed RSS o Atom.

Anthropic y Meta AI no tienen RSS oficial, así que se usan búsquedas de Google News limitadas a su dominio. Si una fuente falla, el script avisa con ⚠️ y sigue con las demás.
