import { asset } from '../lib/asset';

// The portfolio: one entry per project, in the order the home page lists them.
// The home page cards, /llms.txt and the home page's structured data all read this.
export const author = { name: 'Gary Dalley', github: 'https://github.com/gonkowonko' };

export const projects = [
  {
    id: 'nightscout',
    name: 'NightscoutBar & NightscoutWidget',
    href: asset('/nightscout/'),
    cta: 'More about the apps',
    icon: asset('/icons/nightscoutbar-256.png'),
    summary:
      'See your Nightscout glucose without picking up your phone. NightscoutBar puts your reading and trend arrow in the macOS menu bar; NightscoutWidget is a small always-on-top widget for Windows. Both add a chart, IOB and COB.',
    platforms: 'macOS · Windows',
    status: { label: 'Released', live: true },
  },
  {
    id: 'rewax',
    name: 'Rewax',
    href: asset('/rewax/'),
    cta: 'More about Rewax',
    icon: asset('/rewax/icon-256.png'),
    summary:
      'Know when to rewax your bike chain. Rewax reads your rides from Strava, counts how far each bike has gone since its chain was last waxed, and reminds you when it’s due.',
    platforms: 'iPhone',
    status: { label: 'Beta · coming soon', live: false },
  },
] as const;
