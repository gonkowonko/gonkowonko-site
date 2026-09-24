import type { APIRoute } from 'astro';
import { apps } from '../config/downloads';
import { faqs } from '../config/faq';

// Plain-text summary for AI assistants and LLM crawlers (https://llmstxt.org).
export const GET: APIRoute = ({ site }) => {
  const home = new URL(import.meta.env.BASE_URL, site).href;
  const body = `# NightscoutBar & NightscoutWidget

> Free, open-source (MIT) desktop apps that show your Nightscout continuous glucose monitor (CGM) data: NightscoutBar puts your glucose and trend arrow in the macOS menu bar; NightscoutWidget is a floating, always-on-top widget for Windows. Both show the trend arrow, change since the last reading, minutes since the last reading, a glucose chart, IOB (insulin on board) and COB (carbs on board). Not a medical device.

## Apps

- [${apps.mac.name} for macOS](${apps.mac.download}): menu bar app for ${apps.mac.requirements}. Universal (Apple Silicon and Intel), signed with an Apple Developer ID and notarised. Source: ${apps.mac.repo}
- [${apps.win.name} for Windows](${apps.win.download}): floating desktop widget for ${apps.win.requirements}. Single portable .exe with no install and no .NET runtime needed. Source: ${apps.win.repo}

## Key facts

- Price: free. Licence: MIT. No account, no ads, no analytics.
- Data: the apps connect only to the user's own Nightscout site. Nothing is sent to the developer or any third party. Access tokens are stored in the macOS Keychain or encrypted with Windows DPAPI.
- Works with any CGM that uploads to Nightscout (e.g. Dexcom G6/G7/ONE, FreeStyle Libre 2/3 via Dexcom Share bridge, xDrip+, xDrip4iOS, Juggluco, Loop, Trio or AAPS).
- Units: mmol/L and mg/dL. IOB/COB from Trio, oref/AAPS and Loop device status.
- Not affiliated with the Nightscout Foundation.

## FAQ

${faqs.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}

## Links

- [Website](${home})
- [Privacy](${new URL('privacy/', home).href})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
