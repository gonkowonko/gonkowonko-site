// Rewax's privacy points and FAQ: shown on /rewax/, emitted as FAQPage structured
// data there, and written out in /rewax/llms.txt, so all three say the same thing.

// Privacy, as the privacy policy says it (/rewax/privacy-policy.html): what's
// read from Strava, and what never is.
export const privacy = {
  facts: [
    ['Ads', 'None'],
    ['Tracking', 'None'],
    ['Talks to', 'Strava only'],
  ],
  reads: [
    'Your name, to show which account is connected',
    'Your Strava account and bike IDs, to match rides to bikes',
    'Your bikes: name, total distance, and whether each is your primary or retired',
    'Your rides from the last 60 days: name, date, distance, bike, and what recorded it, such as a Garmin, a Wahoo or Zwift. Runs and walks are skipped, and private rides are read only if you allow them',
  ],
  never: [
    'Read routes, locations, heart rate, power or photos',
    'Post, edit or delete anything on Strava',
    'Send your data to anyone else',
  ],
};
// Questions the sections above don't already answer. Data has a section of
// its own.
export const faqs: [question: string, answer: string][] = [
  ['Which rides count?', 'Any ride on Strava with one of your bikes chosen for it, indoors or out, from a Garmin, a Wahoo, Zwift or anything else. A ride with no bike set doesn’t count; set one on Strava and it’s counted next time Rewax checks Strava.'],
  ['What limit should I set?', 'Rewax starts at 300 miles (483 km) for every bike. Change it for all of them, or give one bike its own: a lower one for the bike that rides in the wet, say. Miles or kilometres.'],
  ['What’s a top-up?', 'A quick drip of wax between full waxes. Log one and Rewax counts the chain as good for that many more miles from when you put it on: 150 miles or 250 km unless you change it, for all your bikes, one bike or just that top-up. If the old wax has already washed off, say so and the count runs from the top-up alone. The next full wax starts everything again.'],
  ['What happens when I get a new phone?', 'Your wax log comes with you. iCloud Backup and Backup by Google include Rewax like any other app; on Android, connect Strava again afterwards. Or save a backup file from Settings → Backup & restore and restore it on the new phone, iPhone or Android. It shows what will change before anything’s replaced, then reloads your rides from Strava.'],
  ['How far back can I log a wax?', 'Up to 60 days, as long as it’s after the bike’s last wax. If the chain was waxed longer ago than that, start counting from its next wax.'],
  ['Do I need a paid Strava subscription?', 'No, a free Strava account is all Rewax needs.'],
  ['Can I try it without Strava?', 'Yes. Choose Explore with demo data on the first screen and Rewax fills up with sample bikes, so you can try everything before connecting your own.'],
  ['Where can I get it?', 'Rewax is free on the App Store for iPhone (iOS 26 or later) and on Google Play for Android (Android 12 or later).'],
];
