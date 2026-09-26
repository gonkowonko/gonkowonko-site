// FAQ content: rendered on the page and emitted as FAQPage structured data.
export const faqs: [question: string, answer: string][] = [
  [
    'Which CGMs does it work with?',
    'Any CGM that uploads to Nightscout, including Dexcom (G6, G7, ONE) and FreeStyle Libre (2, 3) through apps such as Dexcom Share bridge, xDrip+, xDrip4iOS, Juggluco, Loop, Trio or AAPS. If you can see your readings on your Nightscout site, the apps can show them.',
  ],
  ['Is it free?', 'Yes, both apps are free and the code is open source on GitHub. There are no accounts, subscriptions or ads.'],
  [
    'Is the Mac app safe to open?',
    'Yes. NightscoutBar is signed with an Apple Developer ID and notarised by Apple, so it opens like any other app with no security warnings. It runs on both Apple Silicon and Intel Macs.',
  ],
  [
    'Windows shows “Windows protected your PC”.',
    'SmartScreen shows this for apps that aren’t code-signed. Click More info, then Run anyway.',
  ],
  [
    'Why is the Windows download around 60 MB?',
    'The .NET runtime is built into the exe, so it runs on any Windows 10 or 11 PC with nothing else to install.',
  ],
  [
    'What’s a “readable” token?',
    'It’s a read-only access token from your Nightscout site. In Nightscout, open Admin Tools, add a subject with the readable role, and copy its token into the app’s settings. If your site is public (AUTH_DEFAULT_ROLES=readable), you don’t need one.',
  ],
  [
    'Where do IOB and COB come from?',
    'From your Nightscout device status. The apps understand uploads from Trio and AAPS (openaps.iob, suggested and enacted) and from Loop (loop.iob and loop.cob).',
  ],
  ['Does my data go anywhere else?', 'No. The apps only connect to the Nightscout URL you enter. Nothing is sent to us or to anyone else.'],
];
