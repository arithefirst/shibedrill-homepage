import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';

export async function GET(context) {
    const posts = await getCollection('posts');
    return rss({
        title: 'Shibe Drill\'s Website',
        description: "Posts about programming, infrastructure, Linux, and other nerd shit",
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            link: `/post/${post.id}`,
            description: post.body.split('!-- more --')[0].slice(0, -2),
        })),
    })
}
