// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Defaults are for the live site at the domain root. The preview deploy on
// github.io overrides them via env (see .github/workflows/deploy.yml):
//   SITE=https://gonkowonko.github.io BASE=/gonkowonko-site
export default defineConfig({
  site: process.env.SITE ?? 'https://gonkowonko.com',
  base: process.env.BASE ?? '/',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
