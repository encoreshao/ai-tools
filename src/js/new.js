// The "New" page: headlines, models, releases by category, open-source picks and jobs to try, all from data.js.
import { RELEASES, RELEASE_AREAS, HEADLINES, MODELS, OPEN_SOURCE, TRY_THIS, byId, taskById } from './data.js';
import { $, ageInDays, esc, svg, PATHS, EXTERNAL, logo, initials, scrollToEl } from './utils.js';
import { initNav, initNewPageSearch } from './nav.js';
import { initSky } from './sky.js';
import { initRadar } from './radar.js';

const longDay = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });
const shortDay = iso => new Date(iso + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' });
const mark = id => `<span class="mono sm" aria-hidden="true">${initials(byId[id].name)}${logo(id, 32)}</span>`;
const marks = ids => `<span class="marks">${ids.map(mark).join('')}</span>`;

// ---------- sections ----------

$('#headlines').innerHTML = HEADLINES.map(h => `
  <a class="story" href="${h.url}" ${EXTERNAL}>
    ${marks(h.tools)}
    <h3>${esc(h.title)}</h3>
    <p>${esc(h.what)}</p>
    <p class="why"><b>Why it matters</b> ${esc(h.why)}</p>
    <span class="more">${esc(h.link)}${svg(PATHS.arrow)}</span>
  </a>`).join('');

$('#models').innerHTML = MODELS.map(m => `
  <a class="model" href="${m.url}" ${EXTERNAL}>
    <span class="model-top">${mark(m.tool)}<span class="date">${shortDay(m.date)}</span></span>
    <span class="model-name">${esc(m.name)}</span>
    <span class="model-by">${esc(m.maker)}</span>
    <span class="model-note">${esc(m.note)}</span>
  </a>`).join('');

let area = null;
const releaseRow = r => `
  <a class="rel" href="${r.url}" ${EXTERNAL}>
    <span class="rel-name">${esc(r.name)}<span class="rel-by">${esc(r.maker)}</span>
      <span class="tag${r.kind === 'new' ? ' new' : ''}">${r.kind === 'new' ? 'New' : 'Update'}</span>${r.status ? `<span class="tag">${esc(r.status)}</span>` : ''}</span>
    ${svg(PATHS.arrow, 'go')}
    <span class="rel-blurb">${esc(r.blurb)}${r.tool ? ` <span class="rel-tool">${esc(byId[r.tool].name)}</span>` : ''}</span>
  </a>`;

function renderReleases() {
  $('#rel-chips').innerHTML =
    [{ id: null, name: 'All' }, ...RELEASE_AREAS].map(a =>
      `<button class="pill" type="button" data-area="${a.id ?? ''}" aria-pressed="${area === a.id}">${a.name}<span class="count">${RELEASES.filter(r => !a.id || r.area === a.id).length}</span></button>`).join('');
  const list = RELEASES.filter(r => !area || r.area === area);
  const days = [...new Set(list.map(r => r.date))];
  $('#releases-list').innerHTML = `<div class="rel-list">${days.map(d =>
    `<h3 class="rel-day">${longDay(d)}</h3>${list.filter(r => r.date === d).map(releaseRow).join('')}`).join('')}</div>`;
}
renderReleases();

$('#oss').innerHTML = OPEN_SOURCE.map(o => `
  <a class="oss" href="${o.url}" ${EXTERNAL}>
    <span class="oss-name">${esc(o.name)}${svg(PATHS.arrow, 'go')}</span>
    <span class="oss-by">${esc(o.maker)}</span>
    <span class="oss-what">${esc(o.what)}</span>
  </a>`).join('');

$('#try').innerHTML = TRY_THIS.map(id => {
  const t = taskById[id], first = byId[t.tools[0]];
  return `<a class="try" href="./#task=${id}">
    <span class="mono" aria-hidden="true">${initials(first.name)}${logo(first.id, 44)}</span>
    <span class="try-body"><span class="try-label">${esc(t.label)}</span><span class="try-first">Try first: ${esc(first.name)}</span></span>
    ${svg(PATHS.arrow, 'go')}
  </a>`;
}).join('');

// ---------- banner copy and events ----------

const recent = RELEASES.filter(r => ageInDays(r.date) <= 30);
$('#stat-new').textContent = recent.filter(r => r.kind === 'new').length;
$('#stat-upd').textContent = recent.filter(r => r.kind === 'update').length;
$('#stat-days').textContent = Math.max(...RELEASES.map(r => ageInDays(r.date))) + 1;

document.addEventListener('click', e => {
  const jump = e.target.closest('[data-jump]');
  if (jump) { scrollToEl(document.getElementById(jump.dataset.jump)); return; }
  const chip = e.target.closest('[data-area]');
  if (chip) { area = chip.dataset.area || null; renderReleases(); }
});

initNav();
initNewPageSearch();
initSky();
initRadar();
