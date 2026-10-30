// Banner for the New page: a launch radar. The centre is today, each ring is one more week back,
// and every release is a logo placed by its age. A beam sweeps round and lights each one as it passes.
// With reduce-motion on, the beam stays still and every logo stays lit.
import { RELEASES, byId } from './data.js';
import { $, REDUCED, cssVar, sizeCanvas, loadLogo, initials, animate, ageInDays } from './utils.js';

const GOLDEN = 2.399963; // radians: spreads blips evenly round the dial
const FLATTEN = .92;
const TAU = Math.PI * 2;

export function initRadar() {
  const canvas = $('#radar'), box = $('#radar-box'), hit = $('#radar-hit');
  const pal = { ink: cssVar('--ink'), muted: cssVar('--muted'), line: cssVar('--line-strong'), bg: cssVar('--bg'), accent: cssVar('--accent') };
  const plotted = RELEASES.filter(r => r.tool).slice(0, 14); // only releases tied to a tool have a logo to plot
  const ages = plotted.map(r => ageInDays(r.date));
  const weeks = Math.max(4, Math.ceil((Math.max(...ages) + 1) / 7)); // rings drawn, one per week
  const blips = plotted.map((r, i) => ({
    r, id: r.tool, angle: (i * GOLDEN) % TAU,
    dist: .17 + .29 * (ages[i] / (weeks * 7)), size: r.kind === 'new' ? .085 : .065
  }));
  const imgs = Object.fromEntries(blips.map(b => [b.id, loadLogo(b.id)]));

  let ctx, W = 0, beam = -Math.PI / 2, last = 0, hover = null;
  const drawn = [];

  const resize = () => { W = canvas.getBoundingClientRect().width; ctx = sizeCanvas(canvas, W, W); };
  const at = b => [W / 2 + Math.cos(b.angle) * W * b.dist, W / 2 + Math.sin(b.angle) * W * b.dist * FLATTEN];
  // 1 right as the beam passes a blip, fading to 0 over most of a turn
  const glow = b => REDUCED ? 1 : Math.max(0, 1 - (((beam - b.angle) % TAU + TAU) % TAU) / (TAU * .8));

  function drawLogo(x, y, s, id, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, s * .26); ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = pal.line; ctx.stroke();
    ctx.clip();
    const im = imgs[id];
    if (im.complete && im.naturalWidth) ctx.drawImage(im, x - s / 2, y - s / 2, s, s);
    else if (im.complete) { // no logo file for this tool: show its initials
      ctx.fillStyle = pal.line; ctx.fillRect(x - s / 2, y - s / 2, s, s);
      ctx.fillStyle = pal.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `700 ${Math.round(s * .38)}px "Bricolage Grotesque", system-ui, sans-serif`;
      ctx.fillText(initials(byId[id].name), x, y + s * .02);
    }
    ctx.restore();
  }

  function frame(ms) {
    const dt = last ? Math.min((ms - last) / 1000, .05) : 0; last = ms;
    if (!REDUCED && !hover) beam = (beam + dt * .9) % TAU;
    const cx = W / 2, cy = W / 2;
    ctx.clearRect(0, 0, W, W);

    // Week rings, with the day count on the right-hand side
    ctx.lineWidth = 1; ctx.strokeStyle = pal.line;
    for (let k = 1; k <= weeks; k++) {
      const d = .17 + .29 * (k * 7 / (weeks * 7));
      ctx.setLineDash(k === weeks ? [] : [2, 6]);
      ctx.beginPath(); ctx.ellipse(cx, cy, W * d, W * d * FLATTEN, 0, 0, TAU); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = pal.muted; ctx.font = `500 ${Math.max(10, W * .02)}px "JetBrains Mono", monospace`; ctx.textAlign = 'left';
    for (let k = 1; k <= weeks; k++) ctx.fillText(`${k * 7}d`, cx + W * (.17 + .29 * k / weeks) + 4, cy - 4);

    // Beam: a fading wedge trailing behind the leading edge
    if (ctx.createConicGradient) {
      const g = ctx.createConicGradient(beam - TAU * .22, cx, cy);
      g.addColorStop(0, 'rgba(138,162,255,0)'); g.addColorStop(.22, 'rgba(138,162,255,.28)'); g.addColorStop(.2201, 'rgba(138,162,255,0)');
      ctx.fillStyle = g;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, FLATTEN); ctx.translate(-cx, -cy);
      ctx.beginPath(); ctx.arc(cx, cy, W * .47, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.strokeStyle = pal.accent; ctx.lineWidth = 1.5; ctx.globalAlpha = .8;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(beam) * W * .47, cy + Math.sin(beam) * W * .47 * FLATTEN); ctx.stroke();
    ctx.globalAlpha = 1;

    // Core
    const R = W * .07;
    ctx.fillStyle = pal.ink; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    ctx.fillStyle = pal.bg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.round(R * .62)}px "Bricolage Grotesque", system-ui, sans-serif`;
    ctx.fillText('NEW', cx, cy + R * .04);

    // Blips: a ripple at the moment the beam passes, then the logo fading back to dim
    drawn.length = 0;
    blips.forEach(b => {
      const [x, y] = at(b), gl = glow(b), s = W * b.size * (hover === b ? 1.18 : 1);
      if (!REDUCED && gl > .85) {
        ctx.strokeStyle = pal.accent; ctx.globalAlpha = (gl - .85) / .15 * .8; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, s * (.6 + (1 - gl) * 9), 0, TAU); ctx.stroke();
      }
      drawLogo(x, y, s, b.id, .45 + .55 * gl);
      drawn.push({ b, x, y, s });
    });
    ctx.globalAlpha = 1;
  }

  const loop = animate(frame);

  function setHover(node) {
    hover = node?.b ?? null;
    if (REDUCED) loop.once();
    if (!node) { hit.hidden = true; return; }
    hit.href = node.b.r.url; hit.firstChild.textContent = node.b.r.name; hit.setAttribute('aria-label', 'Open ' + node.b.r.name);
    hit.style.left = (node.x / W * 100) + '%'; hit.style.top = (node.y / W * 100) + '%';
    hit.style.width = hit.style.height = (node.s + 8) + 'px';
    hit.hidden = false;
  }
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const found = drawn.findLast(d => Math.abs(x - d.x) < d.s / 2 + 4 && Math.abs(y - d.y) < d.s / 2 + 4);
    if (found) setHover(found); else if (hover) setHover(null);
  });
  canvas.addEventListener('pointerleave', e => { if (!hit.contains(e.relatedTarget)) setHover(null); });
  hit.addEventListener('pointerleave', e => { if (e.relatedTarget !== canvas) setHover(null); });

  const redrawIfStill = () => { if (REDUCED) loop.once(); };
  resize();
  new ResizeObserver(() => { resize(); redrawIfStill(); }).observe(canvas);
  new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { last = 0; loop.start(); } else loop.stop(); }).observe(box);
  Object.values(imgs).forEach(im => { im.addEventListener('load', redrawIfStill); im.addEventListener('error', redrawIfStill); });
  document.fonts?.ready.then(redrawIfStill);
}
