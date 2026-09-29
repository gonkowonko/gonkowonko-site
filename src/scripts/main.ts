// The Nightscout page's live demos: working copies of both apps, fed by the
// made-up readings in lib/cgm.ts.
import { gsap } from 'gsap';
import { CgmSimulator, arrow, fmt, fmtDelta, macColor, unitLabel, winColor, type CgmState, type Units } from '../lib/cgm';
import { renderChart } from '../lib/chart';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const primary = document.documentElement.dataset.os === 'win' ? 'win' : 'mac';

/* ---------------- scale fixed-size mockups to their boxes ---------------- */
const scaleOf = new WeakMap<Element, number>();
const ro = new ResizeObserver((entries) => {
  for (const e of entries) {
    const box = e.target as HTMLElement;
    const inner = $('[data-scale-inner]', box)!;
    // Narrow screens get a smaller "desktop" so the app UI isn't shrunk to unreadable
    if (box.dataset.mobile) {
      const [w, h] = (e.contentRect.width < 640 ? box.dataset.mobile : box.dataset.desktop!).split('x');
      inner.style.width = `${w}px`;
      inner.style.height = `${h}px`;
      box.style.aspectRatio = `${w}/${h}`;
    }
    const s = e.contentRect.width / inner.offsetWidth;
    inner.style.transform = `scale(${s})`;
    scaleOf.set(inner, s);
  }
});
$$('[data-scale-box]').forEach((b) => ro.observe(b));

/* ---------------- live demos ---------------- */
const sim = new CgmSimulator();

function rollTo(el: HTMLElement, text: string, dir: number) {
  if (el.dataset.v === text) return;
  el.dataset.v = text;
  if (reduced || !el.isConnected) {
    el.textContent = text;
    return;
  }
  const old = document.createElement('span');
  old.textContent = el.textContent;
  const nu = document.createElement('span');
  nu.textContent = text;
  el.classList.add('roll');
  el.replaceChildren(old, nu);
  gsap.fromTo(old, { yPercent: 0, opacity: 1 }, { yPercent: -80 * dir, opacity: 0, duration: 0.5, ease: 'power3.out' });
  gsap.fromTo(nu, { yPercent: 80 * dir, opacity: 0 }, {
    yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
    onComplete: () => { el.classList.remove('roll'); el.textContent = text; },
  });
}

const hhmm = (d = new Date()) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let agoTimer: number | undefined;

function paint(root: HTMLElement, s: CgmState, first: boolean) {
  const isMac = root.dataset.app === 'mac';
  const color = (isMac ? macColor : winColor)(s.sgv);
  const bg = $('[data-bg]', root)!;
  const val = fmt(s.sgv, s.units);
  first ? ((bg.textContent = val), (bg.dataset.v = val)) : rollTo(bg, val, s.delta >= 0 ? 1 : -1);
  bg.style.color = color;
  bg.style.transition = 'color .6s';
  const ar = $('[data-arrow]', root)!;
  ar.textContent = arrow(s.delta);
  ar.style.color = isMac ? color : '#F2F4F8';
  $('[data-delta]', root)!.textContent = fmtDelta(s.delta, s.units);
  const u = $('[data-units]', root);
  if (u) u.textContent = unitLabel(s.units);
  $('[data-iob]', root)!.textContent = isMac ? `${s.iob.toFixed(2)} U` : s.iob.toFixed(2);
  $('[data-cob]', root)!.textContent = isMac ? `${Math.round(s.cob)} g` : String(Math.round(s.cob));
  const mb = $('[data-menubar]', root);
  if (mb) mb.textContent = `${val}${arrow(s.delta)}`;
  const upd = $('[data-updated]', root);
  if (upd) upd.textContent = `Updated ${hhmm()}`;
  drawChart(root, s);
}

function drawChart(root: HTMLElement, s: CgmState) {
  const svg = $<SVGSVGElement>('[data-chart]', root)!;
  const isMac = root.dataset.app === 'mac';
  renderChart(svg, s.history, isMac
    ? { color: macColor, hours: +svg.dataset.hours!, bandFill: 'rgba(48,209,88,.08)', dot: 2.6, grid: true }
    : { color: winColor, hours: +svg.dataset.hours!, bandFill: 'rgba(61,220,132,.07)', dot: 2.2, line: 'rgba(255,255,255,.18)' });
}

const roots = $$('[data-app]');
let first = true;
sim.subscribe((s) => {
  roots.forEach((r) => paint(r, s, first));
  first = false;
  $$('[data-ago]').forEach((a) => (a.textContent = 'just now'));
  clearTimeout(agoTimer);
  agoTimer = window.setTimeout(() => $$('[data-ago]').forEach((a) => (a.textContent = '1 min ago')), 1800);
});

// run only while a demo is on screen
const visible = new Set<Element>();
const io = new IntersectionObserver((es) => {
  es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
  visible.size ? sim.start() : sim.stop();
});
roots.forEach((r) => io.observe(r));

// hours pickers
$$('[data-hours-picker]').forEach((p) => {
  const root = p.closest<HTMLElement>('[data-app]')!;
  p.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-hours]');
    if (!b) return;
    $$('[data-hours]', p).forEach((x) => x.classList.toggle('bg-white/20', x === b));
    $<SVGSVGElement>('[data-chart]', root)!.dataset.hours = b.dataset.hours!;
    drawChart(root, sim.state);
  });
});

// units
const setUnits = (u: Units) => {
  sim.setUnits(u);
  $$('[data-unit]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.unit === u)));
};
$$('[data-unit]').forEach((b) => b.addEventListener('click', () => setUnits(b.dataset.unit as Units)));
setUnits('mmol');

// mac popover toggle
$$('[data-mac-toggle]').forEach((btn) => {
  const pop = $('[data-mac-popover]', btn.closest('[data-app]')!)!;
  let open = true;
  btn.addEventListener('click', () => {
    open = !open;
    btn.classList.toggle('bg-white/20', open);
    gsap.to(pop, open
      ? { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.7)' }
      : { autoAlpha: 0, scale: 0.92, y: -8, duration: 0.2, ease: 'power2.in' });
  });
});

// windows widget drag (coordinates are in the unscaled desktop's space, 960×600 or 560×620)
$$('[data-win-widget]').forEach((w) => {
  const inner = w.closest<HTMLElement>('[data-scale-inner]');
  let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
  w.addEventListener('pointerdown', (e) => {
    dragging = true;
    w.setPointerCapture(e.pointerId);
    sx = e.clientX; sy = e.clientY;
    ox = +(gsap.getProperty(w, 'x') as number); oy = +(gsap.getProperty(w, 'y') as number);
    gsap.to(w, { scale: 1.03, duration: 0.2 });
    const hint = $('[data-drag-hint]', w);
    if (hint) gsap.to(hint, { autoAlpha: 0, duration: 0.3 });
  });
  w.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const s = (inner && scaleOf.get(inner)) || 1;
    gsap.set(w, { x: ox + (e.clientX - sx) / s, y: oy + (e.clientY - sy) / s });
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    gsap.to(w, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
  };
  w.addEventListener('pointerup', end);
  w.addEventListener('pointercancel', end);
});

// platform tabs
const pill = $('[data-tab-pill]')!;
const tabs = $$('[data-tab]');
const placePill = () => {
  const btn = tabs.find((t) => t.getAttribute('aria-selected') === 'true')!;
  pill.style.width = `${btn.offsetWidth}px`;
  pill.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
};
function showTab(key: string, animate = true) {
  const btn = tabs.find((t) => t.dataset.tab === key)!;
  tabs.forEach((t) => t.setAttribute('aria-selected', String(t === btn)));
  placePill();
  $$('[data-panel]').forEach((p) => {
    const on = p.dataset.panel === key;
    if (!animate || reduced) {
      gsap.set(p, { autoAlpha: on ? 1 : 0 });
      return;
    }
    gsap.to(p, { autoAlpha: on ? 1 : 0, duration: 0.3, ease: 'power1.out' });
  });
}
tabs.forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab!)));
showTab(primary, false);
// buttons are first measured before Inter loads; re-place the pill when they change size (font swap, resize)
const tabRo = new ResizeObserver(placePill);
tabs.forEach((t) => tabRo.observe(t));

// clocks
const tick = () => {
  const d = new Date();
  $$('[data-clock]').forEach((c) => (c.textContent = `${d.toLocaleDateString([], { weekday: 'short' })} ${hhmm(d)}`));
  $$('[data-clock-short]').forEach((c) => (c.textContent = hhmm(d)));
  $$('[data-date]').forEach((c) => (c.textContent = d.toLocaleDateString()));
};
tick();
setInterval(tick, 15_000);
