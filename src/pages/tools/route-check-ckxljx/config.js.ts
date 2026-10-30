import type { APIRoute } from 'astro';

// The route checker's Google Maps key (public/tools/route-check-ckxljx/), from the GMAPS_KEY
// repository secret so it isn't in the repo. The key only works on gonkowonko.com and has
// daily caps in Google Cloud. The page itself is copied in by ~/Git/GPXViewer/publish.sh.
export const GET: APIRoute = () =>
  new Response(`window.GMAPS_KEY = ${JSON.stringify(process.env.GMAPS_KEY ?? '')};\n`, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
