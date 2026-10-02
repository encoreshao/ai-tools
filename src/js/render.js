// Page state, rendering and all click/keyboard handling for the tool directory.
import { CATS, TOOLS, TASKS, KING_LINKS, byId, catById, taskById, toolsIn, tasksFor } from './data.js';
import { $, $$, esc, svg, PATHS, EXTERNAL, logo, initials, scrollToEl } from './utils.js';

const STARS_KEY = 'ai-tools-stars';
const EMPTY_SUGGESTIONS = ['slides', 'images', 'code', 'meetings', 'outreach'];
const FOOTER_TASKS = ['ask', 'deepresearch', 'agent-code', 'slides', 'music', 'genvideo'];

const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked: stars last for this visit only */ } }
};

const NO_FILTERS = { q: '', cat: null, task: null, saved: false };
const state = { ...NO_FILTERS, stars: new Set(store.get(STARS_KEY, [])) };

const searchBox = () => $('#q');

// The one way filters change: merge the patch, keep the search box in sync, re-render.
export function setFilters(patch, { scroll = false } = {}) {
  Object.assign(state, patch);
  if ('q' in patch) searchBox().value = state.q;
  render();
  if (scroll) scrollToEl($('#status'));
}

export const selectTask = id => setFilters({ ...NO_FILTERS, task: id }, { scroll: true });

// ---------- markup ----------

const starButton = t => {
  const on = state.stars.has(t.id);
  return `<span class="star" role="button" tabindex="0" data-star="${t.id}" aria-pressed="${on}" aria-label="${on ? 'Unstar' : 'Star'} ${esc(t.name)}">${svg(PATHS.star)}</span>`;
};

const toolCard = (t, { first = false, showCat = false } = {}) => `
  <a class="tool${first ? ' first' : ''}" href="${t.url}" ${EXTERNAL}>
    <span class="mono" aria-hidden="true">${initials(t.name)}${logo(t.id, 44)}</span>
    <span class="tool-body">
      <span class="tool-name">${esc(t.name)}${first ? '<span class="pick">Try first</span>' : ''}${showCat ? `<span class="cat-tag">${catById[t.cat].name}</span>` : ''}</span>
      <span class="tool-blurb">${esc(t.blurb)}</span>
      <span class="tool-url">${esc(t.host)}</span>
    </span>
    <span class="tool-side">${starButton(t)}${svg(PATHS.arrow, 'go')}</span>
  </a>`;

const kingCard = t => `
  <article class="king-card k-${t.id}">
    <div class="k-top">
      <span class="k-logo">${logo(t.id, 72, { lazy: false })}</span>
      <div class="k-title">
        <span class="by">by ${esc(t.maker)}</span>
        <a class="k-name" href="${t.url}" ${EXTERNAL}>${esc(t.name)}</a>
      </div>
      ${starButton(t)}
    </div>
    <p class="k-blurb">${esc(t.blurb)}</p>
    <div class="k-links">${KING_LINKS[t.id].map(([label, url], i) =>
      `<a class="k-link${i === 0 ? ' main' : ''}" href="${url}" ${EXTERNAL}>${esc(label)}${svg(PATHS.arrow)}</a>`).join('')}</div>
  </article>`;

const taskButton = t => `<button class="task" type="button" data-task="${t.id}" aria-pressed="${state.task === t.id}">${esc(t.label)}</button>`;

// ---------- sections ----------

function renderFilters() {
  $('#cats').innerHTML =
    CATS.map(c => `<button class="pill" type="button" data-cat="${c.id}" aria-pressed="${state.cat === c.id}">${c.name}</button>`).join('') +
    `<button class="pill" type="button" data-cat="_saved" aria-pressed="${state.saved}">${svg(PATHS.star)}Starred <span class="count">${state.stars.size}</span></button>`;
}

function renderKings() {
  $('#kings').innerHTML = `<div class="kings-frame reveal">
    <div class="kings-head">
      <h2 class="badge" id="h-king">The big three</h2>
      <p>Not sure where to start? Open one of these. They write, research, analyze and code, and cover most of the tasks below on their own.</p>
    </div>
    <div class="king-grid">${toolsIn('king').map(kingCard).join('')}</div>
  </div>`;
}

function renderTasks() {
  $('#tasks').innerHTML = CATS.map(c => `
    <div class="task-group reveal">
      <span class="lbl">${c.name}</span>
      ${TASKS.filter(t => t.cat === c.id).map(taskButton).join('')}
    </div>`).join('');
}

const matches = (t, q) => {
  const hay = [t.name, t.blurb, t.host, catById[t.cat].name, ...tasksFor(t.id).map(x => x.label)].join(' ').toLowerCase();
  return q.split(/\s+/).every(word => hay.includes(word));
};

function renderList() {
  const out = $('#out'), status = $('#status');
  const q = state.q.trim().toLowerCase();

  if (!q && !state.cat && !state.task && !state.saved) {
    status.innerHTML = `<p>Showing all <b>${TOOLS.length} tools</b> across ${CATS.length - 1} work areas, plus the big three above.</p>`;
    out.innerHTML = `<div class="board">${CATS.filter(c => c.id !== 'king').map(c => `
      <section class="panel reveal" aria-labelledby="h-${c.id}">
        <div class="panel-head">
          <h2 class="badge" id="h-${c.id}">${svg(c.icon)}${c.name}</h2>
          <span class="tagline">${c.tag}</span>
        </div>
        <div class="grid">${toolsIn(c.id).map(t => toolCard(t)).join('')}</div>
      </section>`).join('')}</div>`;
    return;
  }

  let list = state.task ? taskById[state.task].tools.map(id => byId[id]) : TOOLS;
  if (state.cat) list = list.filter(t => t.cat === state.cat);
  if (state.saved) list = list.filter(t => state.stars.has(t.id));
  if (q) list = list.filter(t => matches(t, q));

  const parts = [
    state.task && `for <b>${esc(taskById[state.task].label.toLowerCase())}</b>`,
    state.cat && `in <b>${catById[state.cat].name}</b>`,
    state.saved && 'that you <b>starred</b>',
    q && `matching <b>“${esc(state.q.trim())}”</b>`
  ].filter(Boolean);
  status.innerHTML = `<p><b>${list.length}</b> ${list.length === 1 ? 'tool' : 'tools'} ${parts.join(' ')}</p><button class="clear" type="button" data-clear>Show all ${TOOLS.length}</button>`;

  if (!list.length) {
    const msg = state.saved && !state.stars.size
      ? '<h3>No starred tools yet</h3><p>Tap the star on any tool card to keep it here.</p>'
      : '<h3>Nothing matches that</h3><p>Try one of these tasks instead:</p>';
    out.innerHTML = `<div class="empty">${msg}<div class="row">${EMPTY_SUGGESTIONS.map(id => taskButton(taskById[id])).join('')}</div></div>`;
    return;
  }
  const oneArea = state.cat && !state.task;
  out.innerHTML = `<div class="results"><div class="grid">${list.map((t, i) => toolCard(t, { first: !!state.task && i === 0, showCat: !oneArea })).join('')}</div></div>`;
}

export function render() {
  renderFilters();
  renderKings();
  renderTasks();
  renderList();
}

// Counts and footer lists only depend on the data, so they render once.
function renderStatic() {
  $$('[data-count]').forEach(el => { el.textContent = TOOLS.length; });
  $('#foot-cats').innerHTML = CATS.map(c =>
    `<li><button type="button" data-foot-cat="${c.id}">${c.name} <span style="color:var(--muted)">${toolsIn(c.id).length}</span></button></li>`).join('');
  $('#foot-tasks').innerHTML = FOOTER_TASKS.map(id => `<li><button type="button" data-task="${id}">${esc(taskById[id].label)}</button></li>`).join('');
}

// ---------- events ----------

function toggleStar(id) {
  state.stars.has(id) ? state.stars.delete(id) : state.stars.add(id);
  store.set(STARS_KEY, [...state.stars]);
  render();
  document.querySelector(`[data-star="${id}"]`)?.focus();
}

// Each clickable data attribute and what it does
const ACTIONS = {
  star: el => toggleStar(el.dataset.star),
  cat: el => {
    const id = el.dataset.cat, fromFooter = !!el.closest('#footer');
    if (id === '_saved') setFilters({ saved: !state.saved }, { scroll: fromFooter });
    else setFilters({ cat: state.cat === id ? null : id }, { scroll: fromFooter });
  },
  footCat: el => setFilters({ ...NO_FILTERS, cat: el.dataset.footCat }, { scroll: true }),
  task: el => {
    const id = state.task === el.dataset.task ? null : el.dataset.task;
    setFilters(id ? { task: id, q: '', cat: null } : { task: null, q: '' }, { scroll: !!id });
  },
  demo: el => selectTask(el.dataset.demo),
  jump: el => scrollToEl(document.getElementById(el.dataset.jump)),
  top: () => window.scrollTo({ top: 0 }),
  clear: () => setFilters(NO_FILTERS)
};
const ACTION_SELECTOR = '[data-star],[data-cat],[data-foot-cat],[data-task],[data-demo],[data-jump],[data-top],[data-clear]';

function actionFor(el) {
  for (const key of Object.keys(ACTIONS)) if (key in el.dataset) return ACTIONS[key];
  return null;
}

export function initDirectory() {
  renderStatic();
  render();

  document.addEventListener('click', e => {
    const el = e.target.closest(ACTION_SELECTOR);
    if (!el) return;
    if ('star' in el.dataset) { e.preventDefault(); e.stopPropagation(); }
    actionFor(el)?.(el);
  });

  searchBox().addEventListener('input', e => setFilters({ q: e.target.value }));

  document.addEventListener('keydown', e => {
    const star = e.target.closest?.('[data-star]');
    if (star && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); toggleStar(star.dataset.star); return; }
    if (e.key === '/' && document.activeElement !== searchBox()) { e.preventDefault(); searchBox().focus(); }
    if (e.key === 'Escape' && document.activeElement === searchBox()) setFilters({ q: '' });
  });
}
