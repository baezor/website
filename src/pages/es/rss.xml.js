import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION } from "../../const";

export async function GET(context) {
  const blog = await getCollection("blog", ({ data }) => data.lang === 'es');

  return rss({
    title: SITE_TITLE.es,
    description: SITE_DESCRIPTION.es,
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/es/blog/${post.slug}/`,
    })),
    customData: `<language>es-MX</language>`,
  });
}
