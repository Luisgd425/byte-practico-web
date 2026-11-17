// Pruebas del resumen diario: `npm run test:digest`
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localDate, parseDigest, selectRecent, toMarkdown, toNewsletterHtml } from './digest-lib.ts';

const now = new Date('2026-11-16T13:00:00Z');
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600_000);
const item = (title: string, url: string, hoursAgo: number, source = 'X') => ({ source, title, url, date: h(hoursAgo), snippet: '' });

test('localDate usa la hora de Ciudad Juárez', () => {
  assert.equal(localDate(new Date('2026-11-16T05:00:00Z')), '2026-11-15'); // 22:00 del día anterior
  assert.equal(localDate(new Date('2026-11-16T13:00:00Z')), '2026-11-16');
});

test('selectRecent filtra por 24 h, quita duplicados y ordena', () => {
  const r = selectRecent(
    [
      item('Vieja', 'https://a.com/1', 30),
      item('Nueva noticia de IA', 'https://a.com/2', 1),
      item('Nueva noticia de IA - The Verge', 'https://b.com/x', 2), // mismo título, otra fuente
      item('Otra', 'https://www.a.com/2/?utm=1', 3), // misma URL
      item('Segunda', 'https://c.com/3', 5),
    ],
    now,
  );
  assert.deepEqual(r.map((c) => c.title), ['Nueva noticia de IA', 'Segunda']);
  assert.deepEqual(r.map((c) => c.id), [1, 2]);
});

test('parseDigest valida ids y descarta enlaces inventados', () => {
  const cands = selectRecent([item('A', 'https://a.com/1', 1), item('B', 'https://b.com/1', 2)], now);
  const raw = 'Aquí está:\n' + JSON.stringify({
    titulo: 'T',
    descripcion: 'D',
    intro: 'I',
    noticias: [
      { id: 1, titulo: 'a', resumen: 'r', porQueImporta: 'p' },
      { id: 1, titulo: 'dup', resumen: 'r', porQueImporta: 'p' },
      { id: 99, titulo: 'falsa', resumen: 'r', porQueImporta: 'p' },
    ],
  });
  const d = parseDigest(raw, cands);
  assert.deepEqual(d.noticias.map((n) => n.id), [1]);
  assert.throws(() => parseDigest('{"titulo":"T","descripcion":"D","noticias":[]}', cands));
});

test('toMarkdown y toNewsletterHtml generan borrador y escapan HTML', () => {
  const cands = selectRecent([item('A', 'https://a.com/1', 1, 'OpenAI')], now);
  const d = parseDigest(JSON.stringify({ titulo: 'Título "x"', descripcion: 'D', intro: 'I', noticias: [{ id: 1, titulo: '<b>a</b>', resumen: 'r', porQueImporta: 'p' }] }), cands);
  const md = toMarkdown(d, cands, '2026-11-16');
  assert.match(md, /^title: "Título \\"x\\""$/m);
  assert.match(md, /^draft: true$/m);
  assert.match(md, /Fuente: \[OpenAI\]\(https:\/\/a\.com\/1\)/);
  const html = toNewsletterHtml(d, cands);
  assert.ok(html.includes('&lt;b&gt;a&lt;/b&gt;'));
});
