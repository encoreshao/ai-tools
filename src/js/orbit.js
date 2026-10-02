// Header orbit: an "AI" core with tool logos on three rings.
// Motion plays once: the rings turn in alternating directions for 60s, ease into reverse,
// run backwards for a while, then slow to a stop. With reduce-motion on it still turns,
// at about a third of the speed and without the travelling light pulses.
import { byId } from './data.js';
import { $, REDUCED, cssVar, sizeCanvas, loadLogo, animate } from './utils.js';

// Rings from the inside out: radius and logo size are fractions of the canvas width, speed in radians/s
const RINGS = [
  { r: .23, speed: .16, size: .1, ids: ['claude', 'chatgpt', 'gemini'] },
  { r: .355, speed: -.1, size: .062, ids: ['kimi', 'cursor', 'midjourney', 'perplexity', 'notion', 'elevenlabs', 'canva', 'deepseek', 'suno', 'lovable'] },
  { r: .445, speed: .065, size: .05, ids: ['gamma', 'heygen', 'apollo', 'manus', 'kling', 'qwen', 'copilot', 'granola', 'clay', 'runway', 'ideogram', 'hubspot', 'bolt', 'notebooklm', 'zapier', 'comet'] }
];
// Timeline in seconds: forward, ease into reverse, reversed, slow down, stopped
const T_FWD = 60, T_FLIP = 63, T_REV = 75, T_END = 93;
const PACE = REDUCED ? .35 : 1;
const FLATTEN = .92; // the rings are drawn as slightly squashed ellipses

const direction = t => {
  if (t < T_FWD) return 1;
  if (t < T_FLIP) return Math.cos(Math.PI * (t - T_FWD) / (T_FLIP - T_FWD));
  if (t < T_REV) return -1;
  if (t < T_END) { const k = 1 - (t - T_REV) / (T_END - T_REV); return -k * k; }
  return 0;
};

export function initOrbit() {
  const canvas = $('#orbit'), box = $('#orbit-box'), hit = $('#orbit-hit');
  const pal = { ink: cssVar('--ink'), line: cssVar('--line-strong'), bg: cssVar('--bg'), accent: cssVar('--accent') };
  const imgs = Object.fromEntries(RINGS.flatMap(g => g.ids).map(id => [id, loadLogo(id)]));
  const pulses = Array.from({ length: 14 }, (_, k) => ({ ring: k % 3, node: k, t: Math.random(), v: .004 + Math.random() * .006 }));

  let ctx, W = 0, clock = 0, motion = 0, last = 0, speed = 1, hover = null, done = false;
  const drawn = []; // logo positions from the last frame, for hover hit-testing

  const resize = () => { W = canvas.getBoundingClientRect().width; ctx = sizeCanvas(canvas, W, W); };
  const pos = (g, j) => {
    const a = (j / g.ids.length) * Math.PI * 2 + clock * g.speed;
    return [W / 2 + Math.cos(a) * W * g.r, W / 2 + Math.sin(a) * W * g.r * FLATTEN];
  };

  function drawLogo(x, y, s, id) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, s * .26); ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = pal.line; ctx.stroke();
    ctx.clip();
    const im = imgs[id];
    if (im.complete && im.naturalWidth) ctx.drawImage(im, x - s / 2, y - s / 2, s, s);
    else { ctx.fillStyle = pal.line; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
    ctx.restore();
  }

  function frame(ms) {
    const dt = last ? Math.min((ms - last) / 1000, .05) : 0; last = ms;
    speed += ((hover ? 0 : 1) - speed) * .08; // ease to a stop while a logo is hovered
    motion += dt * speed;
    const dir = direction(motion), strength = Math.abs(dir);
    clock += dt * speed * dir * PACE;
    done = motion >= T_END;

    const cx = W / 2, cy = W / 2, P = RINGS.map(g => g.ids.map((_, j) => pos(g, j)));
    ctx.clearRect(0, 0, W, W);
    ctx.strokeStyle = pal.line; ctx.lineWidth = 1;

    RINGS.forEach((g, gi) => {
      ctx.setLineDash(gi === 0 ? [] : [2, 6]);
      ctx.beginPath(); ctx.ellipse(cx, cy, W * g.r, W * g.r * FLATTEN, 0, 0, Math.PI * 2); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Links: core to the inner ring, then each logo to its nearest neighbour one ring in
    const link = (a, b) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
    const dist2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
    ctx.globalAlpha = .7;
    P[0].forEach(p => link([cx, cy], p));
    [[1, 0], [2, 1]].forEach(([outer, inner]) => P[outer].forEach(p =>
      link(P[inner].reduce((best, q) => (dist2(q, p) < dist2(best, p) ? q : best)), p)));
    ctx.globalAlpha = 1;

    // Light pulses travelling outward from the core
    if (strength > .01 && !REDUCED) {
      ctx.fillStyle = pal.accent;
      ctx.globalAlpha = strength;
      pulses.forEach(p => {
        const ring = P[p.ring], [tx, ty] = ring[p.node % ring.length];
        ctx.beginPath(); ctx.arc(cx + (tx - cx) * p.t, cy + (ty - cy) * p.t, 2.4, 0, Math.PI * 2); ctx.fill();
        p.t += p.v * speed * strength;
        if (p.t > 1) { p.t = 0; p.node = Math.floor(Math.random() * 40); }
      });
      ctx.globalAlpha = 1;
    }

    // Core with two turning arcs
    const R = W * .1 * (REDUCED || done ? 1 : 1 + Math.sin(ms / 500) * .04 * Math.max(strength, .3));
    ctx.fillStyle = pal.ink; ctx.beginPath(); ctx.arc(cx, cy, R * .92, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(clock * .6);
    ctx.strokeStyle = pal.accent; ctx.lineWidth = Math.max(2, W * .005); ctx.lineCap = 'round';
    [0, Math.PI].forEach(a => { ctx.beginPath(); ctx.arc(0, 0, R * 1.12, a, a + Math.PI * .5); ctx.stroke(); });
    ctx.restore();
    ctx.fillStyle = pal.bg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${Math.round(R * .7)}px "Bricolage Grotesque", system-ui, sans-serif`;
    ctx.fillText('AI', cx, cy + R * .04);

    // Logos, outer ring first so the big three sit on top
    drawn.length = 0;
    for (let gi = RINGS.length - 1; gi >= 0; gi--) {
      P[gi].forEach(([x, y], j) => {
        const id = RINGS[gi].ids[j], s = W * RINGS[gi].size * (hover?.id === id ? 1.18 : 1);
        drawLogo(x, y, s, id);
        drawn.push({ x, y, s, id });
      });
    }
    return !done;
  }

  const loop = animate(frame);

  // Hover a logo to stop the rings and show a link to that tool
  function setHover(node) {
    hover = node;
    if (done) loop.once();
    if (!node) { hit.hidden = true; return; }
    const t = byId[node.id];
    hit.href = t.url; hit.firstChild.textContent = t.name; hit.setAttribute('aria-label', 'Open ' + t.name);
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

  const redrawIfStill = () => { if (done) loop.once(); };
  resize();
  new ResizeObserver(() => { resize(); redrawIfStill(); }).observe(canvas);
  // Only animate while the orbit is on screen
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { last = 0; loop.start(); } else loop.stop();
  }).observe(box);
  Object.values(imgs).forEach(im => im.addEventListener('load', redrawIfStill));
  document.fonts?.ready.then(redrawIfStill);
}
