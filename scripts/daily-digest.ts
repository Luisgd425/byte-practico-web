// Resumen diario: lee feeds RSS, elige 5 noticias y genera un BORRADOR (nunca publica).
//   npm run digest            -> genera los archivos de hoy (si ya existen, no hace nada)
//   npm run digest -- --force -> los vuelve a generar
//
// Salida:
//   src/content/borradores/AAAA-MM-DD-resumen.md  (draft: true)
//   newsletter/AAAA-MM-DD.html                    (para pegar en beehiiv)
//
// Modelo de IA (el primero que tenga credencial):
//   1. ANTHROPIC_API_KEY -> Claude (de pago, por uso)
//   2. GITHUB_TOKEN      -> GitHub Models (gratis con límites). En GitHub Actions ya viene incluido.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import Parser from 'rss-parser';
import { type Candidate, localDate, parseDigest, selectRecent, toMarkdown, toNewsletterHtml } from './digest-lib.ts';

const now = new Date();
const date = localDate(now);
const mdPath = `src/content/borradores/${date}-resumen.md`;
const htmlPath = `newsletter/${date}.html`;

if (existsSync(mdPath) && !process.argv.includes('--force')) {
  console.log(`Ya existe ${mdPath}. Usa "npm run digest -- --force" para regenerarlo.`);
  process.exit(0);
}

// 1. Leer los feeds (si uno falla, se avisa y se sigue con los demás)
const { sources } = JSON.parse(readFileSync('scripts/sources.json', 'utf8')) as { sources: { name: string; url: string }[] };
const parser = new Parser();
const results = await Promise.all(
  sources.map(async (s) => {
    try {
      const res = await fetch(s.url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ByteDigest/1.0)' }, signal: AbortSignal.timeout(20_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const feed = await parser.parseString(await res.text());
      return feed.items.map((i) => ({
        source: s.name,
        title: (i.title ?? '').trim(),
        url: i.link ?? '',
        date: new Date(i.isoDate ?? i.pubDate ?? 0),
        snippet: (i.contentSnippet ?? '').replace(/\s+/g, ' ').slice(0, 300),
      }));
    } catch (e) {
      console.warn(`⚠️  ${s.name}: ${(e as Error).message}`);
      return [];
    }
  }),
);

// 2. Últimas 24 h, sin duplicados
const candidates = selectRecent(results.flat(), now);
console.log(`${candidates.length} noticias candidatas de las últimas 24 h.`);
if (candidates.length === 0) {
  console.log('No hay noticias nuevas. No se genera borrador.');
  process.exit(0);
}

// 3. Pedir el borrador al modelo
const system = `Eres editor de Byte Práctico, un sitio de tecnología e IA en español para estudiantes y profesionales de Latinoamérica.
Elige las 5 noticias más relevantes e importantes de la lista (prioriza IA; evita repetir el mismo tema).
Para cada una escribe con tus propias palabras, sin copiar frases de la fuente:
- "titulo": titular claro en español (máx. 90 caracteres).
- "resumen": 2-3 frases con qué pasó.
- "porQueImporta": 1-2 frases sobre qué significa para el lector.
No inventes datos que no estén en la lista. Tono cercano, claro y sin exageraciones.
Responde SOLO con JSON válido, sin texto adicional, con esta forma:
{"titulo": "titular del resumen del día (máx. 100 caracteres)", "descripcion": "meta descripción (máx. 160 caracteres)", "intro": "1-2 frases de introducción", "noticias": [{"id": 1, "titulo": "...", "resumen": "...", "porQueImporta": "..."}]}
El "id" debe ser el número de la noticia en la lista.`;

const list = candidates
  .map((c: Candidate) => `[${c.id}] ${c.source} | ${c.date.toISOString()} | ${c.title}\n${c.snippet}`)
  .join('\n\n');
const user = `Fecha: ${date}\n\nNoticias:\n\n${list}`;

async function askClaude(): Promise<string> {
  const client = new Anthropic();
  const msg = await client.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default', // si el modelo rechaza la petición, el servidor reintenta con otro modelo
    system,
    messages: [{ role: 'user', content: user }],
  });
  if (msg.stop_reason === 'refusal') throw new Error('Claude rechazó la petición.');
  return msg.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
}

async function askGitHubModels(): Promise<string> {
  const res = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.GITHUB_MODEL || 'openai/gpt-4.1',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`GitHub Models respondió ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

let text: string;
if (process.env.ANTHROPIC_API_KEY) {
  console.log('Usando Claude…');
  text = await askClaude();
} else if (process.env.GITHUB_TOKEN) {
  console.log('Usando GitHub Models (gratis)…');
  text = await askGitHubModels();
} else {
  console.error('Falta ANTHROPIC_API_KEY o GITHUB_TOKEN en el archivo .env (ver .env.example).');
  process.exit(1);
}

// 4. Validar y guardar
const digest = parseDigest(text, candidates);
mkdirSync('newsletter', { recursive: true });
writeFileSync(mdPath, toMarkdown(digest, candidates, date));
writeFileSync(htmlPath, toNewsletterHtml(digest, candidates));
console.log(`✅ Borrador: ${mdPath}\n✅ Newsletter: ${htmlPath}\nRevísalos antes de publicar: nada se publica solo.`);
