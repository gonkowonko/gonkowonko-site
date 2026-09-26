import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { CgmSimulator, arrow, fmt, fmtDelta, macColor, unitLabel, winColor, type CgmState, type Units } from '../lib/cgm';
import { renderChart } from '../lib/chart';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------------- smooth scroll ---------------- */
if (!reduced) {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      const el = id === '#top' ? 0 : $(id);
      if (el === null) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement | number, { offset: id === '#download' ? -140 : 0 });
    }),
  );
}

/* ---------------- OS-aware download buttons ---------------- */
const os = document.documentElement.dataset.os;
const primary = os === 'win' ? 'win' : 'mac';
$$('[data-dl]').forEach((b) => b.classList.toggle('is-primary', b.dataset.dl === primary));

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

/* ---------------- hero intro ---------------- */
const title = $('[data-split]');
if (title) {
  // wrap words for a staggered rise, keeping inner spans (gradient text) intact
  const wrap = (node: Node): Node[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent!.split(/(\s+)/).map((w) => {
        if (!w.trim()) return document.createTextNode(w);
        const o = document.createElement('span');
        o.className = 'inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom';
        const i = document.createElement('span');
        i.className = 'word inline-block';
        i.textContent = w;
        o.append(i);
        return o;
      });
    }
    const el = node as HTMLElement;
    const kids = [...el.childNodes].flatMap(wrap);
    el.replaceChildren(...kids);
    return [el];
  };
  [...title.childNodes].forEach((n) => {
    const out = wrap(n);
    if (out[0] !== n) n.replaceWith(...out);
  });
  // background-clip:text doesn't reach transformed children, so move the gradient onto each word
  $$('.text-gradient', title).forEach((g) => {
    g.classList.remove('text-gradient');
    $$('.word', g).forEach((w) => w.classList.add('text-gradient'));
  });
}

if (!reduced) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-icon', { y: 40, scale: 0.6, opacity: 0, rotate: -12, duration: 1.4, ease: 'back.out(1.6)' })
    .from('.hero-kicker', { y: 16, opacity: 0, duration: 0.8 }, '-=1')
    .from('.word', { yPercent: 110, rotate: 4, duration: 1.1, stagger: 0.06 }, '-=0.8')
    .from('.hero-sub', { y: 20, opacity: 0, filter: 'blur(8px)', duration: 1 }, '-=0.8')
    .from('.hero-cta', { y: 20, opacity: 0, duration: 0.9, stagger: 0.1 }, '-=0.7')
    .fromTo('.trace-line', { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0.3)
    .from('.trace-dot', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.025, ease: 'back.out(3)' }, 0.4);

  // hero parallax on scroll
  gsap.to('#top > .relative.z-10', {
    yPercent: -25,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
  });

  // icon tilt
  const icon = $('[data-tilt]');
  if (icon && matchMedia('(pointer:fine)').matches) {
    gsap.to(icon, { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    window.addEventListener('pointermove', (e) => {
      const rx = (e.clientY / innerHeight - 0.5) * -18;
      const ry = (e.clientX / innerWidth - 0.5) * 18;
      gsap.to(icon, { rotateX: rx, rotateY: ry, transformPerspective: 600, duration: 0.8 });
    });
  }
}

/* ---------------- scroll reveals ---------------- */
if (reduced) {
  $$('[data-reveal]').forEach((el) => (el.style.opacity = '1'));
  $$('.glow-card').forEach((el) => el.classList.add('in-view'));
} else {
  $$('[data-reveal]').forEach((el) => {
    const side = el.dataset.reveal === 'side';
    gsap.fromTo(
      el,
      { opacity: 0, y: side ? 0 : 40, x: side ? (el.dataset.from === 'right' ? 80 : -80) : 0, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      },
    );
  });
  $$('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      opacity: 0, y: 40, scale: 0.97, duration: 0.9, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: {
        trigger: group, start: 'top 85%',
        onEnter: () => $$('.glow-card', group).forEach((c) => c.classList.add('in-view')),
      },
    });
  });

  // demo frame tilts flat as it scrolls into view
  gsap.fromTo('[data-stage-frame]', { rotateX: 22, scale: 0.9, y: 40 }, {
    rotateX: 0, scale: 1, y: 0, ease: 'none',
    scrollTrigger: { trigger: '[data-stage-frame]', start: 'top 95%', end: 'top 30%', scrub: 0.6 },
  });

  // setup timeline line
  gsap.fromTo('[data-steps-line]', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
  });
}

// pointer glow on cards
$$('.glow-card').forEach((c) =>
  c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }),
);

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
  $$('[data-unit]').forEach((b) => {
    const on = b.dataset.unit === u;
    b.classList.toggle('bg-white/15', on);
    b.classList.toggle('text-fg/50', !on);
  });
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

// windows widget drag (coordinates are in the unscaled 960×600 / 520×360 space)
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
  tabs.forEach((t) => {
    t.classList.toggle('text-ink', t === btn);
    t.classList.toggle('text-fg/60', t !== btn);
    t.setAttribute('aria-selected', String(t === btn));
  });
  placePill();
  $$('[data-panel]').forEach((p) => {
    const on = p.dataset.panel === key;
    if (!animate || reduced) {
      gsap.set(p, { autoAlpha: on ? 1 : 0 });
      return;
    }
    gsap.to(p, on
      ? { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', delay: 0.1 }
      : { autoAlpha: 0, scale: 1.04, filter: 'blur(10px)', duration: 0.4, ease: 'power2.in' });
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
