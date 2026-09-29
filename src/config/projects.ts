import { asset } from '../lib/asset';

// The portfolio: one entry per project, in the order the home page lists them.
// purpose is the home page card's one sentence. The home page cards, /llms.txt and the home page's structured data all read this.
export const author = { name: 'Gary Dalley', github: 'https://github.com/gonkowonko' };

export const projects = [
  {
    id: 'nightscout',
    name: 'NightscoutBar & NightscoutWidget',
    href: asset('/nightscout/'),
    cta: 'More about the Nightscout apps',
    icon: asset('/icons/nightscoutbar-256.png'),
    summary:
      'See your Nightscout glucose without picking up your phone. NightscoutBar puts your reading and trend arrow in the macOS menu bar; NightscoutWidget is a small always-on-top widget for Windows. Both add a chart, IOB and COB.',
    purpose: 'Your Nightscout glucose and trend arrow in the Mac menu bar or a small Windows widget, so it’s there without picking up your phone.',
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
      'Know when to rewax your bike chain. Rewax counts the miles on each chain from your Strava rides and tells you when it’s due.',
    purpose: 'Counts the miles on each bike chain from your Strava rides and tells you when it’s time to rewax.',
    platforms: 'iPhone · Android',
    status: { label: 'In closed beta', live: false },
  },
] as const;
