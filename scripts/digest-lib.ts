// Funciones puras del resumen diario (sin red ni archivos), para poder probarlas.
// Las pruebas están en digest-lib.test.ts: `npm run test:digest`.

export interface Candidate {
  id: number;
  source: string;
  title: string;
  url: string;
  date: Date;
  snippet: string;
}

export interface DigestItem {
  id: number;
  titulo: string;
  resumen: string;
  porQueImporta: string;
}

export interface Redes {
  instagram: string; // pie de foto con hashtags
  facebook: string;
  short: string; // guion de ~30 s para YouTube Shorts / Reels
}

export interface Digest {
  titulo: string;
  descripcion: string;
  intro: string;
  noticias: DigestItem[];
  redes?: Redes; // opcional: si el modelo no lo da, el borrador se genera igual
}

// Fecha AAAA-MM-DD en Ciudad Juárez (no en UTC), para nombrar los archivos.
export function localDate(now: Date, timeZone = 'America/Ciudad_Juarez'): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

// Clave para detectar la misma noticia en dos fuentes: título sin acentos, signos ni sufijo " - Medio".
function titleKey(title: string): string {
  return title
    .replace(/\s+[-–|]\s+[^-–|]{2,40}$/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .join(' ');
}

function urlKey(url: string): string {
  try {
    const u = new URL(url);
    return (u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/$/, '')).toLowerCase();
  } catch {
    return url;
  }
}

// Deja solo lo publicado en las últimas `hours` horas, sin duplicados, de lo más nuevo a lo más viejo.
export function selectRecent(items: Omit<Candidate, 'id'>[], now: Date, hours = 24, max = 40): Candidate[] {
  const from = now.getTime() - hours * 3600_000;
  const to = now.getTime() + 3600_000; // tolera relojes un poco adelantados
  const seen = new Set<string>();
  return items
    .filter((i) => i.title && i.url && i.date.getTime() >= from && i.date.getTime() <= to)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .filter((i) => {
      const keys = [urlKey(i.url), titleKey(i.title)];
      if (keys.some((k) => seen.has(k))) return false;
      keys.forEach((k) => seen.add(k));
      return true;
    })
    .slice(0, max)
    .map((i, n) => ({ ...i, id: n + 1 }));
}

// Valida la respuesta del modelo. Los enlaces salen de nuestros candidatos (por id), nunca del modelo.
export function parseDigest(text: string, candidates: Candidate[]): Digest {
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const d = JSON.parse(json) as Digest;
  const ids = new Set(candidates.map((c) => c.id));
  const used = new Set<number>();
  const str = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
  d.noticias = (Array.isArray(d.noticias) ? d.noticias : []).filter((n) => {
    const ok = ids.has(n.id) && !used.has(n.id) && str(n.titulo) && str(n.resumen) && str(n.porQueImporta);
    if (ok) used.add(n.id);
    return ok;
  }).slice(0, 5);
  if (!str(d.titulo) || !str(d.descripcion) || d.noticias.length === 0) {
    throw new Error('La respuesta del modelo no tiene el formato esperado.');
  }
  // Límites del esquema de content.config.ts
  d.titulo = d.titulo.slice(0, 110);
  d.descripcion = d.descripcion.slice(0, 170);
  d.intro = str(d.intro) ? d.intro : '';
  const r = d.redes;
  d.redes = r && str(r.instagram) && str(r.facebook) && str(r.short) ? r : undefined;
  return d;
}

const yaml = (s: string) => JSON.stringify(s); // una cadena JSON también es YAML válido

export function toMarkdown(d: Digest, candidates: Candidate[], date: string): string {
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const sources = d.noticias.map((n) => byId.get(n.id)!);
  return `---
title: ${yaml(d.titulo)}
description: ${yaml(d.descripcion)}
pubDate: ${date}
category: noticias-ia
heroImage: ../../assets/categorias/noticias-ia.jpg
heroAlt: "Ondas de partículas azules brillantes sobre fondo oscuro"
sources:
${sources.map((s) => `  - title: ${yaml(`${s.source}: ${s.title}`)}\n    url: ${yaml(s.url)}`).join('\n')}
draft: true
---

<!--
  BORRADOR GENERADO AUTOMÁTICAMENTE. Antes de publicar (ver docs/guia-editorial.md):
  1. Abre cada fuente y verifica que el resumen sea correcto.
  2. Añade tu opinión o experiencia en al menos una noticia.
  3. Opcional: cambia heroImage por una foto propia de la noticia principal (y su heroAlt).
  4. Cambia draft: true por draft: false.
-->

${d.intro}

${d.noticias
  .map((n, i) => {
    const s = byId.get(n.id)!;
    return `## ${i + 1}. ${n.titulo}

${n.resumen}

**¿Por qué importa?** ${n.porQueImporta}

Fuente: [${s.source}](${s.url})`;
  })
  .join('\n\n')}
`;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// HTML sencillo con estilos en línea: se pega en beehiiv (bloque HTML) o se copia desde el navegador.
export function toNewsletterHtml(d: Digest, candidates: Candidate[]): string {
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const items = d.noticias
    .map((n, i) => {
      const s = byId.get(n.id)!;
      return `  <h2 style="font-size:20px;margin:28px 0 8px">${i + 1}. ${esc(n.titulo)}</h2>
  <p style="margin:0 0 8px">${esc(n.resumen)}</p>
  <p style="margin:0 0 8px"><strong>¿Por qué importa?</strong> ${esc(n.porQueImporta)}</p>
  <p style="margin:0"><a href="${esc(s.url)}">Leer en ${esc(s.source)} →</a></p>`;
    })
    .join('\n');
  return `<!-- Borrador para beehiiv. Revisa y edita antes de enviar. -->
<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#18181b;max-width:600px">
  <h1 style="font-size:26px;margin:0 0 12px">${esc(d.titulo)}</h1>
  <p style="margin:0 0 8px">${esc(d.intro || d.descripcion)}</p>
${items}
  <hr style="margin:32px 0;border:none;border-top:1px solid #e4e4e7">
  <p style="font-size:14px;color:#52525b">Byte Práctico · Tecnología e IA explicadas para usarlas hoy.</p>
</div>
`;
}

// Textos listos para copiar en redes. Se muestran en el Pull Request del día.
export function toSocialMarkdown(d: Digest, siteUrl: string, date: string): string {
  if (!d.redes) return '';
  const url = `${siteUrl.replace(/\/$/, '')}/articulos/${date}-resumen/`;
  return `## 📱 Textos para redes (revísalos antes de publicar)

**Enlace del artículo** (cuando lo publiques): ${url}

### Instagram
${d.redes.instagram}

### Facebook
${d.redes.facebook}

${url}

### Guion para YouTube Shorts / Reels (~30 s)
${d.redes.short}
`;
}
