// Night-sky background. Each star layer is painted once into its own tile and slid around each
// frame (drift, scroll parallax, a little mouse depth), so a frame costs a few image copies
// instead of hundreds of shapes. A handful of brighter stars twinkle, and the odd shooting star crosses.
import { $, REDUCED, rnd, wrap, sizeCanvas, offscreen, animate } from './utils.js';

const LAYERS = [
  { n: 240, r: [.3, .8], a: [.25, .6], par: .03, drift: .6, look: 4 },
  { n: 100, r: [.6, 1.2], a: [.45, .8], par: .08, drift: 1.4, look: 9 },
  { n: 30, r: [1, 1.7], a: [.65, .95], par: .16, drift: 2.6, look: 16 }
];
const NEAR = LAYERS[2];
const MAX_DPR = 1.5; // stars are tiny; more resolution costs speed without a visible gain

export function initSky() {
  const canvas = $('#sky');
  let ctx, W = 0, H = 0, tiles = [], twinklers = [], sprite, shoot = null, nextShoot = rnd(4, 8);
  const mouse = { x: 0, y: 0, on: false }, look = { x: 0, y: 0 };

  function build() {
    W = innerWidth; H = innerHeight;
    ctx = sizeCanvas(canvas, W, H, MAX_DPR);
    const area = Math.max((W * H) / (1440 * 900), .35);
    tiles = LAYERS.map(L => {
      const { canvas: tile, ctx: g } = offscreen(W, H, MAX_DPR);
      for (let k = 0; k < Math.round(L.n * area); k++) {
        const tint = Math.random() < .12 ? (Math.random() < .5 ? '200,214,255' : '255,232,210') : '255,255,255';
        g.fillStyle = `rgba(${tint},${rnd(...L.a).toFixed(2)})`;
        g.beginPath(); g.arc(Math.random() * W, Math.random() * H, rnd(...L.r), 0, Math.PI * 2); g.fill();
      }
      return tile;
    });
    // One soft star sprite, reused for every twinkling star
    const s = offscreen(24, 24, 1);
    const gr = s.ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    s.ctx.fillStyle = gr; s.ctx.fillRect(0, 0, 24, 24);
    sprite = s.canvas;
    twinklers = Array.from({ length: Math.round(28 * area) }, () => ({ x: Math.random() * W, y: Math.random() * H, size: rnd(5, 10), tw: rnd(.5, 1.4), ph: rnd(0, 6.28) }));
  }

  // Draw a full-screen tile shifted by (ox, oy), wrapping at the edges
  function tiled(img, ox, oy) {
    const x = wrap(ox, W), y = wrap(oy, H);
    for (const dx of [x - W, x]) for (const dy of [y - H, y]) ctx.drawImage(img, dx, dy, W, H);
  }

  function drawShootingStar(t) {
    if (!shoot && t > nextShoot) {
      const ang = rnd(.35, .6);
      shoot = { x: rnd(W * .1, W * .8), y: rnd(0, H * .4), vx: Math.cos(ang) * 900, vy: Math.sin(ang) * 900, start: t };
      nextShoot = t + rnd(8, 15);
    }
    if (!shoot) return;
    const life = t - shoot.start, k = life / .9;
    const x = shoot.x + shoot.vx * life, y = shoot.y + shoot.vy * life, tx = x - shoot.vx * .12, ty = y - shoot.vy * .12;
    const g = ctx.createLinearGradient(x, y, tx, ty);
    g.addColorStop(0, `rgba(255,255,255,${Math.max(0, 1 - k) * .9})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
    if (k >= 1) shoot = null;
  }

  function frame(ms) {
    const t = REDUCED ? 0 : ms / 1000, sy = scrollY;
    const tx = mouse.on ? (mouse.x / W - .5) * 2 : 0, ty = mouse.on ? (mouse.y / H - .5) * 2 : 0;
    look.x += (tx - look.x) * .06; look.y += (ty - look.y) * .06;
    const shift = L => [t * L.drift - look.x * L.look, -sy * L.par - look.y * L.look];

    ctx.clearRect(0, 0, W, H);
    LAYERS.forEach((L, i) => tiled(tiles[i], ...shift(L)));
    const [nx, ny] = shift(NEAR);
    for (const s of twinklers) {
      ctx.globalAlpha = REDUCED ? .7 : .35 + .55 * (.5 + .5 * Math.sin(t * s.tw + s.ph));
      ctx.drawImage(sprite, wrap(s.x + nx, W) - s.size / 2, wrap(s.y + ny, H) - s.size / 2, s.size, s.size);
    }
    ctx.globalAlpha = 1;
    if (!REDUCED) drawShootingStar(t);
    return !REDUCED; // with reduce-motion on, redraw only on scroll and resize
  }

  const loop = animate(frame);
  build();
  let resizeTimer = 0;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { build(); loop.once(); }, 150); });
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') Object.assign(mouse, { x: e.clientX, y: e.clientY, on: true }); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { mouse.on = false; });
  if (REDUCED) { addEventListener('scroll', () => loop.once(), { passive: true }); loop.once(); }
  else loop.start();
}
