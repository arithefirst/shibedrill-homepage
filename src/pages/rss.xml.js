import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const posts = await getCollection('posts');
    return rss({
        title: 'Shibe Drill\'s Website',
        description: "Posts about programming, infrastructure, Linux, and other nerd shit",
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            date: post.data.pubDate,
            link: `/post/${post.id}`,
        })),
    })
}