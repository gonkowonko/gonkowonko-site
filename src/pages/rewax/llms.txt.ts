import type { APIRoute } from 'astro';
import { projects } from '../../config/projects';
import { privacy, faqs } from '../../config/rewax';

// Plain-text summary for AI assistants and LLM crawlers (https://llmstxt.org).
// The privacy points and FAQ come from the same text as the page.
export const GET: APIRoute = ({ site }) => {
  const root = new URL(import.meta.env.BASE_URL, site).href;
  const home = new URL('rewax/', root).href;
  const { stores } = projects.find((p) => p.id === 'rewax')!;
  const body = `# Rewax

> Free iPhone and Android app for cyclists who wax their bike chains. Rewax reads the rides you record on Strava, counts the miles on each bike's chain since its last wax, and tells you when it's time to rewax. It also tracks drip-wax top-ups and how many more times each reusable quick link can be refitted.

## Get it

- [App Store](${stores.appStore}): iPhone, iOS 26 or later.
- [Google Play](${stores.googlePlay}): Android 12 or later.

## Key facts

- Price: free. No account of its own (you connect with Strava), no ads, no analytics, no tracking.
- Each bike shows the miles left before its next wax, or how far it's gone over, with a chain that fills as you ride and turns amber, then red, as the limit nears. A forecast says roughly when the next wax is due, from the last four weeks of riding.
- Limits: 300 miles (483 km) by default, one for every bike or its own for any bike. Miles or kilometres.
- Log a wax up to 60 days back, with a note. An alert when a chain is overdue has Log wax and Topped up buttons on it.
- Top-ups: log a quick drip of wax between full waxes and the chain counts as good for another 150 miles or 250 km from when it went on, or however far you set, for all bikes, one bike or a single top-up.
- Chain links: tracks the uses left on each chain's reusable quick link.
- History: a chart of how far each wax lasted against the limit, with top-ups, the average, shortest and longest, and a log of every wax, top-up and chain link.
- Widgets: Home Screen and Lock Screen widgets on iPhone, and a badge on the app icon counting overdue bikes; resizable widgets on Android.
- Backups: a backup file from Settings → Backup & restore moves your wax log between phones, iPhone or Android.
- Try it first with demo data: no Strava account needed.
- Rewax is independent, and isn't made, sponsored or endorsed by Strava.

## Privacy

Your bikes, wax log and chain links are kept on your phone. Rewax talks only to Strava, read-only, and never sends your data to the developer or anyone else.

What it reads from Strava:

${privacy.reads.map((r) => `- ${r}.`).join('\n')}

What it never does:

${privacy.never.map((r) => `- ${r}.`).join('\n')}

## FAQ

${faqs.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}

## Links

- [Website](${home})
- [Privacy policy](${new URL('privacy-policy.html', home).href})
- [More apps by the same developer](${root})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
