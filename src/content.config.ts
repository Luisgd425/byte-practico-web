// Define qué campos lleva cada artículo. Si falta uno obligatorio, `npm run build` falla y te dice cuál.
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_SLUGS } from './consts';

const base = ({ image }: SchemaContext) =>
  z.object({
    title: z.string().max(110),
    description: z.string().max(170), // Se usa como meta description en Google
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Luis'),
    category: z.enum(CATEGORY_SLUGS),
    heroImage: image(),
    heroAlt: z.string().min(5), // Texto alternativo obligatorio (accesibilidad y SEO)
    sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true), // Nada se publica hasta que tú lo pongas en false
  });

// Artículos publicables
const articulos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articulos' }),
  schema: base,
});

// Borradores que genera el script diario. La imagen es opcional porque la eliges tú al revisar.
const borradores = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/borradores' }),
  schema: (ctx) => base(ctx).extend({ heroImage: ctx.image().optional(), heroAlt: z.string().optional() }),
});

export const collections = { articulos, borradores };
