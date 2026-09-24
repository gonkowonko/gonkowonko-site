import type { APIRoute } from 'astro';

// Live site: welcome every crawler, including AI assistants (GPTBot, ClaudeBot, PerplexityBot…).
// Preview deploy (PUBLIC_NOINDEX): keep everything out of search results.
export const GET: APIRoute = ({ site }) => {
  const body = import.meta.env.PUBLIC_NOINDEX
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', new URL(import.meta.env.BASE_URL, site))}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
