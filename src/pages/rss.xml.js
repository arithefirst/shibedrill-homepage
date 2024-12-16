import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
  const posts = await getCollection('posts');
  posts.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
  return rss({
    title: "Shibe Drill's Website",
    description: 'Posts about programming, infrastructure, Linux, and other nerd shit',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      author: "shibedrill1@gmail.com",
      link: `/post/${post.id}`,
      description: sanitizeHtml(marked.parse(post.body.split('!-- more --')[0].slice(0, -2))),
      content: sanitizeHtml(marked.parse(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'p'])
      }),
    }))
  });
}
