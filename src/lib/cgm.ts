// Fake-but-plausible CGM feed that drives every demo on the page.
// Values are mg/dL internally; formatting mirrors the apps (mmol/L default).

export type Reading = { t: number; sgv: number };
export type Units = 'mmol' | 'mgdl';

export const LOW = 70; // 3.9 mmol/L
export const HIGH = 180; // 10.0 mmol/L
export const URGENT_LOW = 54;
export const URGENT_HIGH = 250;

export const fmt = (mgdl: number, u: Units) =>
  u === 'mmol' ? (mgdl / 18).toFixed(1) : String(Math.round(mgdl));

export const fmtDelta = (d: number, u: Units) => {
  const v = u === 'mmol' ? (d / 18).toFixed(1) : String(Math.round(d));
  return (d >= 0 ? '+' : '') + v;
};

export const unitLabel = (u: Units) => (u === 'mmol' ? 'mmol/L' : 'mg/dL');

export function arrow(delta: number) {
  if (delta > 15) return '⇈';
  if (delta > 10) return '↑';
  if (delta > 5) return '↗';
  if (delta > -5) return '→';
  if (delta > -10) return '↘';
  if (delta > -15) return '↓';
  return '⇊';
}

/** NightscoutBar (SwiftUI): green in range, orange high, red low. */
export function macColor(sgv: number) {
  if (sgv < LOW) return '#FF453A';
  if (sgv > HIGH) return '#FF9F0A';
  return '#30D158';
}

/** NightscoutWidget (WPF) palette. */
export function winColor(sgv: number) {
  if (sgv < URGENT_LOW || sgv > URGENT_HIGH) return '#FF4D5E';
  if (sgv < LOW) return '#FFB340';
  if (sgv > HIGH) return '#FFD54A';
  return '#3DDC84';
}

type Listener = (s: CgmState) => void;
export type CgmState = {
  history: Reading[];
  sgv: number;
  delta: number;
  iob: number;
  cob: number;
  units: Units;
};

export class CgmSimulator {
  history: Reading[] = [];
  iob = 1.35;
  cob = 12;
  units: Units = 'mmol';
  private vel = 0;
  private event: { kind: 'meal' | 'drop'; left: number } | null = null;
  private listeners = new Set<Listener>();
  private timer: number | undefined;

  constructor(points = 288) {
    let sgv = 118;
    const now = Date.now();
    // Seed 24h of 5-minute readings: a few meal bumps and one low that recovers.
    for (let i = points - 1; i >= 0; i--) {
      const k = (points - 1 - i) / points;
      sgv =
        125 +
        45 * Math.sin(k * Math.PI * 8 + 0.4) +
        20 * Math.sin(k * Math.PI * 22) +
        -45 * Math.exp(-((k - 0.9) ** 2) / 0.0006) +
        (Math.random() - 0.5) * 6;
      this.history.push({ t: now - i * 300_000, sgv: Math.round(sgv) });
    }
  }

  get state(): CgmState {
    const h = this.history;
    const sgv = h[h.length - 1].sgv;
    return { history: h, sgv, delta: sgv - h[h.length - 2].sgv, iob: this.iob, cob: this.cob, units: this.units };
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  setUnits(u: Units) {
    this.units = u;
    this.emit();
  }

  step() {
    const last = this.history[this.history.length - 1].sgv;
    if (!this.event && Math.random() < 0.08) {
      this.event = { kind: last < 150 && Math.random() < 0.7 ? 'meal' : 'drop', left: 8 };
      if (this.event.kind === 'meal') {
        this.cob += 35;
        this.iob += 2.5;
      }
    }
    let push = (120 - last) * 0.03; // mean-reverting toward target
    if (this.event) {
      push += this.event.kind === 'meal' ? 7 : -7;
      if (--this.event.left <= 0) this.event = null;
    }
    this.vel = this.vel * 0.7 + push + (Math.random() - 0.5) * 5;
    this.vel = Math.max(-18, Math.min(18, this.vel));
    const sgv = Math.round(Math.max(45, Math.min(290, last + this.vel)));
    this.history.push({ t: this.history[this.history.length - 1].t + 300_000, sgv });
    this.history.shift();
    this.iob = Math.max(0, this.iob * 0.93);
    this.cob = Math.max(0, this.cob * 0.9 - 0.5);
    this.emit();
  }

  start(ms = 3200) {
    if (this.timer) return;
    this.timer = window.setInterval(() => this.step(), ms);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  private emit() {
    const s = this.state;
    this.listeners.forEach((fn) => fn(s));
  }
}
