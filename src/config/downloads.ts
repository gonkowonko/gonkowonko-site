import { asset } from '../lib/asset';
// Single source of truth for download links.
// Point these at direct assets once release file names are fixed, e.g.
//   https://github.com/gonkowonko/NightscoutBar/releases/latest/download/NightscoutBar.dmg
export const apps = {
  mac: {
    name: 'NightscoutBar',
    platform: 'macOS',
    repo: 'https://github.com/gonkowonko/NightscoutBar',
    download: 'https://github.com/gonkowonko/NightscoutBar/releases/latest',
    file: '.dmg',
    requirements: 'macOS 13 Ventura or later',
    icon: asset('/icons/nightscoutbar.png'),
  },
  win: {
    name: 'NightscoutWidget',
    platform: 'Windows',
    repo: 'https://github.com/gonkowonko/NightscoutWidget',
    download: 'https://github.com/gonkowonko/NightscoutWidget/releases/latest',
    file: '.exe',
    requirements: 'Windows 10 / 11 (x64)',
    icon: asset('/icons/nightscoutwidget.png'),
  },
} as const;

export type AppKey = keyof typeof apps;
