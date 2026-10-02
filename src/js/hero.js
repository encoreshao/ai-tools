// Header text effects: the headline word that cycles through work areas, and the demo prompt.
import { byId, taskById } from './data.js';
import { $, esc, logo, wait, REDUCED } from './utils.js';

const HEADLINE_WORDS = ['work', 'marketing', 'sales', 'design', 'video', 'meetings', 'coding', 'research', 'audio'];

// Demo prompt: each entry is a task id and the sentence typed for it
const DEMOS = [
  ['slides', 'I need to build a presentation'],
  ['agent-code', 'I want an AI agent to build my app'],
  ['genvideo', 'I need a short video from a text prompt'],
  ['leads', 'I need to find new sales leads'],
  ['music', 'I need a jingle for our new ad'],
  ['deepresearch', 'I need a research report with sources'],
  ['meetings', 'I want notes from my meetings'],
  ['brand', 'I need a logo for my brand'],
  ['ask', 'I just need quick answers']
];

// Erase `el` back to `keep` characters, then type `text`
async function retype(el, text, { keep = 0, erase = 40, type = 60 } = {}) {
  for (let k = el.textContent.length; k > keep; k--) { el.textContent = el.textContent.slice(0, k - 1); await wait(erase); }
  for (let k = keep + 1; k <= text.length; k++) { el.textContent = text.slice(0, k); await wait(type); }
}

async function cycleHeadline() {
  const el = $('#hw');
  for (let i = 0; ; i = (i + 1) % HEADLINE_WORDS.length) {
    await wait(2200);
    await retype(el, HEADLINE_WORDS[(i + 1) % HEADLINE_WORDS.length], { erase: 45, type: 70 });
  }
}

async function cycleDemo() {
  const line = $('#pt'), answer = $('#pa'), box = line.closest('.prompt');
  let hovering = false;
  box.addEventListener('pointerenter', () => { hovering = true; });
  box.addEventListener('pointerleave', () => { hovering = false; });

  const show = taskId => {
    const task = taskById[taskId], tool = byId[task.tools[0]];
    answer.innerHTML = `<span class="arrow">ai › try</span><span class="chip">${logo(tool.id, 26, { lazy: false })}${esc(tool.name)}</span>` +
      `<button class="show" type="button" data-demo="${task.id}">Show all ${task.tools.length}</button>`;
  };

  line.textContent = DEMOS[0][1];
  show(DEMOS[0][0]);
  for (let i = 1; ; i = (i + 1) % DEMOS.length) {
    await wait(4000);
    // Hold while the pointer rests on the box, but never longer than 8s
    for (let held = 0; hovering && held < 8000; held += 250) await wait(250);
    const [taskId, text] = DEMOS[i];
    answer.classList.remove('on');
    if (REDUCED) { await wait(250); line.textContent = text; }
    else { await retype(line, text, { keep: 10, erase: 16, type: 34 }); await wait(300); }
    show(taskId);
    answer.classList.add('on');
  }
}

export function initHero() {
  if (!REDUCED) cycleHeadline();
  cycleDemo();
}
