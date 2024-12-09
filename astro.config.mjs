// @ts-check
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'catppuccin-mocha'
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ['nofollow norefer'],
          target: ['_blank']
        }
      ]
    ]
  }
});
