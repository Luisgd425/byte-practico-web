// Datos globales del sitio. Cambia aquí el nombre, la URL o las redes y se actualiza en todas las páginas.

export const SITE = {
  name: 'Byte Práctico',
  description:
    'Noticias y guías prácticas de tecnología e inteligencia artificial en español, explicadas para usarlas hoy.',
  author: 'Luis',
  locale: 'es_MX',
  lang: 'es',
  // TODO: cambia por un correo real que revises (puede ser un Gmail gratuito creado para el proyecto)
  email: 'iaxpress3.1415@gmail.com',
  country: 'México',
} as const;

export const SOCIAL = [
  { name: 'Instagram', url: 'https://www.instagram.com/bytepractico' },
  { name: 'Facebook', url: 'https://www.facebook.com/bytepractico' },
  { name: 'YouTube', url: 'https://www.youtube.com/@bytepractico' },
] as const;

// El orden de esta lista es el orden del menú.
export const CATEGORIES = [
  { slug: 'noticias-ia', name: 'Noticias IA', description: 'Lo más importante que pasa en inteligencia artificial, explicado sin ruido.' },
  { slug: 'herramientas-ia', name: 'Herramientas IA', description: 'Apps y servicios de IA probados, con lo bueno y lo malo.' },
  { slug: 'tutoriales', name: 'Tutoriales', description: 'Guías paso a paso para sacarle provecho a la tecnología.' },
  { slug: 'productividad', name: 'Productividad', description: 'Trucos y flujos de trabajo para ahorrar tiempo cada día.' },
  { slug: 'gadgets', name: 'Gadgets', description: 'Dispositivos, reseñas y qué vale la pena comprar.' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

// Tupla de slugs para validar la categoría en el frontmatter de cada artículo.
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];

export const LEGAL_LINKS = [
  { name: 'Política de privacidad', href: '/politica-de-privacidad' },
  { name: 'Política de cookies', href: '/politica-de-cookies' },
  { name: 'Términos', href: '/terminos' },
  { name: 'Aviso legal', href: '/aviso-legal' },
] as const;
