// Small helpers shared by every module.

export const $ = sel => document.querySelector(sel);
export const $$ = sel => document.querySelectorAll(sel);

export const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const CAN_HOVER = matchMedia('(hover: hover)').matches;

export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
export const rnd = (min, max) => min + Math.random() * (max - min);
export const wrap = (value, size) => ((value % size) + size) % size;
export const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
export const initials = name => name.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

// Attributes for every link that leaves the site
export const EXTERNAL = 'target="_blank" rel="noopener noreferrer"';

// 24×24 stroke icons
export const PATHS = {
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z"/>',
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>'
};
export const svg = (paths, cls = '') =>
  `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// A tool logo. If the file is missing the image removes itself, so whatever sits behind it shows.
export const logo = (id, size, { lazy = true } = {}) =>
  `<img src="logos/${id}.png" alt="" width="${size}" height="${size}"${lazy ? ' loading="lazy"' : ''} decoding="async" onerror="this.remove()">`;

export const loadLogo = id => Object.assign(new Image(), { src: `logos/${id}.png` });

export const scrollToEl = el => el?.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });

// A canvas sized for the screen's pixel density. Drawing code works in CSS pixels.
export function sizeCanvas(canvas, width, height, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
export const offscreen = (width, height, maxDpr) => {
  const canvas = document.createElement('canvas');
  return { canvas, ctx: sizeCanvas(canvas, width, height, maxDpr) };
};

// Calls `frame(ms)` on every animation frame while the tab is visible.
// `frame` returns false to stop the loop; `start()` resumes it.
export function animate(frame) {
  let raf = 0, running = false;
  const tick = ms => {
    if (frame(ms) === false || !running) { running = false; return; }
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (running || document.hidden) return; running = true; raf = requestAnimationFrame(tick); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  return { start, stop, once: () => requestAnimationFrame(frame) };
}
