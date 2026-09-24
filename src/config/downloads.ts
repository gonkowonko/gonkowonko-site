import { asset } from '../lib/asset';
// Single source of truth for download links. These always fetch the newest release's file,
// so release asset names must stay NightscoutBar.dmg / NightscoutWidget.exe.
export const apps = {
  mac: {
    name: 'NightscoutBar',
    platform: 'macOS',
    repo: 'https://github.com/gonkowonko/NightscoutBar',
    download: 'https://github.com/gonkowonko/NightscoutBar/releases/latest/download/NightscoutBar.dmg',
    file: '.dmg',
    requirements: 'macOS 13 Ventura or later',
    icon: asset('/icons/nightscoutbar.png'),
  },
  win: {
    name: 'NightscoutWidget',
    platform: 'Windows',
    repo: 'https://github.com/gonkowonko/NightscoutWidget',
    download: 'https://github.com/gonkowonko/NightscoutWidget/releases/latest/download/NightscoutWidget.exe',
    file: '.exe',
    requirements: 'Windows 10 / 11 (x64)',
    icon: asset('/icons/nightscoutwidget.png'),
  },
} as const;

export type AppKey = keyof typeof apps;
