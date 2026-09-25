// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'node:fs';

// Defaults are for the live site at the domain root. The preview deploy on
// github.io overrides them via env (see .github/workflows/deploy.yml):
//   SITE=https://gonkowonko.github.io BASE=/gonkowonko-site
export default defineConfig({
  site: process.env.SITE ?? 'https://gonkowonko.com',
  base: process.env.BASE ?? '/',
  // Pages build to name.html (folder/index.astro to folder/index.html), so
  // app pages can have .html addresses such as /rewax/privacy-policy.html.
  build: { format: 'preserve' },
  integrations: [
    sitemap({
      // The sitemap drops the ending 'preserve' builds with; put it back so
      // each URL matches its page's canonical: a slash for a folder's index,
      // .html for anything else.
      serialize(item) {
        if (!item.url.endsWith('/')) {
          const base = (process.env.BASE ?? '/').replace(/\/$/, '');
          const page = new URL(item.url).pathname.slice(base.length).replace(/^\//, '');
          item.url += existsSync(`src/pages/${page}/index.astro`) ? '/' : '.html';
        }
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
