// Funciones para obtener artículos. Todas las páginas usan esto para no repetir filtros.
import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, type CategorySlug } from '../consts';

export type Article = CollectionEntry<'articulos'> | CollectionEntry<'borradores'>;

// En `npm run dev` se ven también los borradores (para que los revises).
// En el sitio publicado (`npm run build`) solo aparece lo que tiene draft: false.
const visible = ({ data }: Article) => import.meta.env.DEV || !data.draft;

/** Todos los artículos visibles, del más nuevo al más viejo. */
export async function getArticles(): Promise<Article[]> {
  const all = [...(await getCollection('articulos', visible)), ...(await getCollection('borradores', visible))];
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const articleUrl = (a: Article) => `/articulos/${a.id}/`;

export const categoryName = (slug: CategorySlug) => CATEGORIES.find((c) => c.slug === slug)!.name;

/** Minutos de lectura aproximados (200 palabras por minuto). */
export function readingTime(body = ''): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
