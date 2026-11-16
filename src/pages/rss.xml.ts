// Feed RSS en /rss.xml (lo usan lectores de noticias y servicios como beehiiv o Google News)
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { getArticles, articleUrl } from '../lib/articles';

export async function GET(context: APIContext) {
  const articles = (await getArticles()).filter((a) => !a.data.draft); // Nunca borradores, ni en dev
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    customData: '<language>es-mx</language>',
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: articleUrl(a),
      categories: [a.data.category],
    })),
  });
}
