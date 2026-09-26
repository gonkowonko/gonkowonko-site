import { CgmSimulator, arrow, fmt, fmtDelta, macColor, unitLabel, winColor } from '../lib/cgm';
import { renderChart } from '../lib/chart';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);

// The Nightscout card shows the /nightscout/ demo mockups as a still: one
// reading and its history, painted once. There's no live feed on this page.
const s = new CgmSimulator().state;
document.querySelectorAll<HTMLElement>('[data-app]').forEach((root) => {
  const mac = root.dataset.app === 'mac';
  const color = (mac ? macColor : winColor)(s.sgv);
  const val = fmt(s.sgv, s.units);
  const bg = $('[data-bg]', root)!;
  bg.textContent = val;
  bg.style.color = color;
  const ar = $('[data-arrow]', root)!;
  ar.textContent = arrow(s.delta);
  ar.style.color = mac ? color : '#F2F4F8';
  $('[data-delta]', root)!.textContent = fmtDelta(s.delta, s.units);
  const u = $('[data-units]', root);
  if (u) u.textContent = unitLabel(s.units);
  const mb = $('[data-menubar]', root);
  if (mb) mb.textContent = `${val}${arrow(s.delta)}`;
  const svg = $<SVGSVGElement>('[data-chart]', root)!;
  renderChart(svg, s.history, mac
    ? { color: macColor, hours: +svg.dataset.hours!, bandFill: 'rgba(48,209,88,.08)', dot: 2.6, grid: true }
    : { color: winColor, hours: +svg.dataset.hours!, bandFill: 'rgba(61,220,132,.07)', dot: 2.2, line: 'rgba(255,255,255,.18)' });
  // A still has no need for the "latest reading" pulse.
  svg.querySelector('.pulse')?.remove();
});

// Scale fixed-size compositions to fit their box, centred.
const ro = new ResizeObserver((entries) => {
  for (const { target, contentRect: box } of entries) {
    const inner = $('[data-fit-inner]', target)!;
    const s = Math.min(box.width / inner.offsetWidth, box.height / inner.offsetHeight);
    const x = (box.width - inner.offsetWidth * s) / 2;
    const y = (box.height - inner.offsetHeight * s) / 2;
    inner.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }
});
document.querySelectorAll('[data-fit]').forEach((b) => ro.observe(b));
