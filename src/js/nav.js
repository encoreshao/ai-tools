// Top bar: the badge on "New" counts launches from the last two weeks.
import { RELEASES } from './data.js';
import { $, ageInDays } from './utils.js';

export function initNav() {
  const fresh = RELEASES.filter(r => ageInDays(r.date) <= 14).length;
  const badge = $('#new-count');
  if (!fresh || !badge) return;
  badge.textContent = fresh;
  badge.hidden = false;
  badge.setAttribute('aria-label', `${fresh} launches in the last two weeks`);
}

// On the New page the search box sends you to the tool map with that search applied.
export function initNewPageSearch() {
  const box = $('#q');
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' && box.value.trim()) location.href = './#q=' + encodeURIComponent(box.value.trim());
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== box) { e.preventDefault(); box.focus(); }
  });
}
