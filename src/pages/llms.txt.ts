import type { APIRoute } from 'astro';
import { author, projects } from '../config/projects';

// Plain-text index for AI assistants and LLM crawlers (https://llmstxt.org).
// Each project with a full page has its own, more detailed llms.txt.
export const GET: APIRoute = ({ site }) => {
  const url = (href: string) => new URL(href, site).href;
  const body = `# gonkowonko

> Apps by ${author.name}, each built to solve a problem the developer ran into, and kept simple.

## Projects

${projects.map((p) => `- [${p.name}](${url(p.href)}): ${p.summary} Platforms: ${p.platforms}. Status: ${p.status.label}.`).join('\n')}

## More

- [NightscoutBar & NightscoutWidget in detail](${url(projects[0].href + 'llms.txt')})
- [GitHub](${author.github})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
