import { HIGH, LOW, type Reading } from './cgm';

type Opts = {
  color: (sgv: number) => string;
  hours: number;
  min?: number;
  max?: number;
  dot?: number;
  bandFill: string;
  line?: string;
  grid?: boolean;
};

const NS = 'http://www.w3.org/2000/svg';

/** Draws a glucose chart into an <svg> sized by its viewBox (w×h). */
export function renderChart(svg: SVGSVGElement, history: Reading[], o: Opts) {
  const vb = svg.viewBox.baseVal;
  const w = vb.width;
  const h = vb.height;
  const pts = history.slice(-Math.round(o.hours * 12));
  const min = o.min ?? 40;
  const max = o.max ?? 300;
  const pad = 6;
  const x = (i: number) => pad + (i / Math.max(1, pts.length - 1)) * (w - pad * 2 - (o.dot ?? 3));
  const y = (v: number) => pad + (1 - (Math.min(max, Math.max(min, v)) - min) / (max - min)) * (h - pad * 2);

  let html = '';
  const yh = y(HIGH);
  const yl = y(LOW);
  html += `<rect x="0" y="${yh}" width="${w}" height="${yl - yh}" fill="${o.bandFill}"/>`;
  html += `<line x1="0" x2="${w}" y1="${yh}" y2="${yh}" stroke="#FF9F0A" stroke-opacity=".45" stroke-dasharray="4 4"/>`;
  html += `<line x1="0" x2="${w}" y1="${yl}" y2="${yl}" stroke="#FF453A" stroke-opacity=".45" stroke-dasharray="4 4"/>`;
  if (o.grid) {
    for (let i = 1; i < o.hours; i++) {
      const gx = pad + (i / o.hours) * (w - pad * 2);
      html += `<line x1="${gx}" x2="${gx}" y1="0" y2="${h}" stroke="#fff" stroke-opacity=".05"/>`;
    }
  }
  if (o.line) {
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.sgv).toFixed(1)}`).join('');
    html += `<path d="${d}" fill="none" stroke="${o.line}" stroke-width="1.2" stroke-linejoin="round"/>`;
  }
  const r = o.dot ?? 2.4;
  pts.forEach((p, i) => {
    const last = i === pts.length - 1;
    const c = o.color(p.sgv);
    if (last) {
      html += `<circle class="pulse" cx="${x(i)}" cy="${y(p.sgv)}" r="${r * 2.2}" fill="${c}" opacity=".35"/>`;
    }
    html += `<circle cx="${x(i)}" cy="${y(p.sgv)}" r="${last ? r * 1.5 : r}" fill="${c}"${
      last ? ' stroke="#fff" stroke-width="1.5"' : ''
    }/>`;
  });
  svg.innerHTML = html;
}

export { NS };
