// Small decorative effects: the scrolling logo strip and the tilt on the big three cards.
import { TOOLS } from './data.js';
import { $, esc, logo, EXTERNAL, REDUCED, CAN_HOVER } from './utils.js';

// Two rows of logos, each duplicated once so the CSS loop is seamless.
// The duplicate is hidden from screen readers and keyboard focus.
export function initMarquee() {
  const pool = TOOLS.filter(t => t.cat !== 'king');
  const half = Math.ceil(pool.length / 2);
  const item = (t, copy) =>
    `<a class="mq-item" href="${t.url}" ${EXTERNAL}${copy ? ' tabindex="-1" aria-hidden="true"' : ''}>${logo(t.id, 30)}${esc(t.name)}</a>`;
  [[$('#mq1'), pool.slice(0, half)], [$('#mq2'), pool.slice(half)]].forEach(([row, list]) => {
    row.innerHTML = list.map(t => item(t, false)).join('') + list.map(t => item(t, true)).join('');
  });
}

// A gentle 3D tilt that follows the mouse across a big-three card
export function initTilt() {
  if (!CAN_HOVER || REDUCED) return;
  let tilted = null;
  const reset = () => {
    if (!tilted) return;
    tilted.classList.remove('tilting');
    tilted.style.removeProperty('--rx'); tilted.style.removeProperty('--ry');
    tilted = null;
  };
  document.addEventListener('pointermove', e => {
    const card = e.target.closest('.king-card');
    if (card !== tilted) reset();
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    card.classList.add('tilting'); tilted = card;
    card.style.setProperty('--ry', (px * 4).toFixed(2) + 'deg');
    card.style.setProperty('--rx', (-py * 4).toFixed(2) + 'deg');
  }, { passive: true });
}
