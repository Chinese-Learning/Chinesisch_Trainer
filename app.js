const $ = (s) => document.querySelector(s);
const app = $('#app');
const unitFilter = $('#unitFilter');
const dirFilter = $('#directionFilter');
const LS = 'chinese_exam_progress_v2';

let tab = 'cards';
let current = null;
let flipped = false;
let chosen = [];
let currentCardPrompt = null;
let progress = JSON.parse(localStorage.getItem(LS) || '{}');
let queues = {};
let lastPicked = {};
let exam = { qs: [], i: 0, ok: 0, bad: 0, wrong: [] };

function setupSelectors() {
  unitFilter.innerHTML = '';
  const all = document.createElement('option');
  all.value = 'all';
  all.textContent = 'All units';
  unitFilter.appendChild(all);

  for (let i = 1; i <= 5; i++) {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = 'Unit ' + i;
    unitFilter.appendChild(o);
  }

  dirFilter.innerHTML = '';
  const modes = [
    ['mixed', 'Mixed'],
    ['hanzi-pinyin', 'Hanzi → Pinyin'],
    ['pinyin-hanzi', 'Pinyin → Hanzi'],
    ['hanzi-meaning', 'Hanzi → Meaning'],
    ['meaning-hanzi', 'Meaning → Hanzi'],
    ['hanzi-full', 'Hanzi → Pinyin + Meaning']
  ];

  for (const [value, label] of modes) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    dirFilter.appendChild(o);
  }
}

function translateMeaning(text) {
  // This keeps the app working even if data.js still contains German meanings.
  // To translate every vocabulary item perfectly, data.js itself must also be translated.
  const dict = {
    'ich': 'I',
    'du': 'you',
    'er': 'he',
    'sie': 'she',
    'wir': 'we',
    'ihr': 'you (plural)',
    'sie (plural)': 'they',
    'hallo': 'hello',
    'danke': 'thank you',
    'bitte': 'please / you are welcome',
    'auf wiedersehen': 'goodbye',
    'name': 'name',
    'heißen': 'to be called',
    'was': 'what',
    'wer': 'who',
    'wo': 'where',
    'woher': 'from where',
    'welche': 'which',
    'land': 'country',
    'deutschland': 'Germany',
    'china': 'China',
    'türkei': 'Turkey',
    'student': 'student',
    'studentin': 'female student',
    'lehrer': 'teacher',
    'arzt': 'doctor',
    'ärztin': 'female doctor',
    'arbeiten': 'to work',
    'wohnen': 'to live',
    'lernen': 'to study / to learn',
    'sprechen': 'to speak',
    'telefonnummer': 'phone number',
    'null': 'zero',
    'eins': 'one',
    'zwei': 'two',
    'drei': 'three',
    'vier': 'four',
    'fünf': 'five',
    'sechs': 'six',
    'sieben': 'seven',
    'acht': 'eight',
    'neun': 'nine',
    'zehn': 'ten'
  };
  const t = String(text || '').trim();
  const low = t.toLowerCase();
  return dict[low] || t;
}

function save() {
  localStorage.setItem(LS, JSON.stringify(progress));
  renderStats();
}

function key(item, type = 'v') {
  return type + ':' + item.u + ':' + (item.h || item.q || item.d || 'item');
}

function mark(item, ok, type = 'v') {
  const k = key(item, type);
  progress[k] = progress[k] || { ok: 0, bad: 0 };
  ok ? progress[k].ok++ : progress[k].bad++;
  save();
}

function pool(arr) {
  const u = unitFilter.value;
  return arr.filter(x => u === 'all' || String(x.u) === u);
}

function shuffle(a) {
  const copy = [...a];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function itemId(x) {
  return String(x.u) + ':' + (x.h || x.q || x.d || JSON.stringify(x));
}

function pick(arr) {
  const items = pool(arr);
  if (!items.length) return null;

  const type = arr === VOCAB ? 'vocab' : arr === SENTENCES ? 'sentences' : arr === DIALOGUE_Q ? 'dialogue' : 'other';
  const poolKey = unitFilter.value + ':' + type;

  if (!queues[poolKey] || queues[poolKey].length === 0) {
    queues[poolKey] = shuffle(items);

    if (
      queues[poolKey].length > 1 &&
      lastPicked[poolKey] &&
      itemId(queues[poolKey][0]) === itemId(lastPicked[poolKey])
    ) {
      [queues[poolKey][0], queues[poolKey][1]] = [queues[poolKey][1], queues[poolKey][0]];
    }
  }

  const next = queues[poolKey].shift();
  lastPicked[poolKey] = next;
  return next;
}

function norm(s) {
  return (s || '').trim().toLowerCase().replace(/[，。！？?！.,;；:：\s]/g, '');
}

function renderStats() {
  const vals = Object.values(progress);
  const ok = vals.reduce((a, b) => a + b.ok, 0);
  const bad = vals.reduce((a, b) => a + b.bad, 0);
  const mastered = Object.entries(progress).filter(([k, v]) => v.ok >= 3 && v.ok > v.bad).length;

  $('#stats').innerHTML = `
    <div class="stat"><b>${VOCAB.length}</b><span>Vocabulary</span></div>
    <div class="stat"><b>${SENTENCES.length}</b><span>Sentences</span></div>
    <div class="stat"><b>${ok}/${bad}</b><span>correct/wrong</span></div>
    <div class="stat"><b>${mastered}</b><span>mastered</span></div>`;
}

function src(u) {
  return `<div class="source">Source: Unit ${u}</div>`;
}

function render() {
  if (tab === 'cards') return renderCards();
  if (tab === 'write') return renderWrite();
  if (tab === 'order') return renderOrder();
  if (tab === 'cloze') return renderCloze();
  if (tab === 'dialogue') return renderDialogue();
  if (tab === 'exam') return renderExam();
  if (tab === 'list') return renderList();
}

function getCardPrompt(v) {
  let mode = dirFilter.value;
  if (mode === 'mixed') {
    mode = shuffle(['hanzi-pinyin', 'pinyin-hanzi', 'hanzi-meaning', 'meaning-hanzi', 'hanzi-full'])[0];
  }

  if (mode === 'hanzi-pinyin') {
    return { q: v.h, sub: 'Hanzi → Pinyin', ans: v.p, type: 'Pinyin' };
  }
  if (mode === 'pinyin-hanzi') {
    return { q: v.p, sub: 'Pinyin → Hanzi', ans: v.h, type: 'Hanzi' };
  }
  if (mode === 'hanzi-meaning') {
    return { q: v.h, sub: 'Hanzi → Meaning', ans: translateMeaning(v.d), type: 'Meaning' };
  }
  if (mode === 'meaning-hanzi') {
    return { q: translateMeaning(v.d), sub: 'Meaning → Hanzi', ans: v.h + ' · ' + v.p, type: 'Hanzi' };
  }
  return { q: v.h, sub: 'Hanzi → Pinyin + Meaning', ans: v.p + ' · ' + translateMeaning(v.d), type: 'Pinyin + Meaning' };
}

function renderCards() {
  current = pick(VOCAB);
  if (!current) return app.innerHTML = '<h2>Flashcards</h2><p>No cards found.</p>';
  currentCardPrompt = getCardPrompt(current);
  flipped = false;
  drawCard();
}

function drawCard() {
  const c = currentCardPrompt;
  app.innerHTML = `
    <h2>Flashcards</h2>
    <div class="card" id="flip">
      <div class="hanzi">${c.q}</div>
      <div class="pinyin">${c.sub}</div>
      ${flipped ? `<div class="meaning">${c.ans}</div>` : ''}
    </div>
    ${src(current.u)}
    <div class="row">
      <button class="primary" id="show">${flipped ? 'Next card' : 'Show answer'}</button>
      ${flipped ? '<button id="ok">Correct</button><button id="bad">Wrong</button>' : ''}
    </div>`;

  $('#show').onclick = () => {
    if (flipped) renderCards();
    else { flipped = true; drawCard(); }
  };
  $('#flip').onclick = () => $('#show').click();

  if (flipped) {
    $('#ok').onclick = () => { mark(current, true); renderCards(); };
    $('#bad').onclick = () => { mark(current, false); renderCards(); };
  }
}

function renderWrite() {
  current = pick(VOCAB);
  const c = getCardPrompt(current);
  app.innerHTML = `
    <h2>Writing mode</h2>
    <div class="question">${c.q}</div>
    <div class="small">Required: ${c.type}</div>
    <input id="answer" autocomplete="off" placeholder="Type your answer">
    <div id="fb" class="feedback"></div>
    ${src(current.u)}
    <div class="row"><button class="primary" id="check">Check</button><button id="next">Next</button></div>`;

  $('#check').onclick = () => {
    const val = $('#answer').value;
    const ans = c.ans;
    const ok = norm(ans).includes(norm(val)) || norm(val).includes(norm(current.h)) || norm(val).includes(norm(current.p)) || norm(val).includes(norm(translateMeaning(current.d)));
    $('#fb').innerHTML = ok ? `<span class="ok">Correct.</span> ${ans}` : `<span class="bad">Wrong.</span> Correct: ${ans}`;
    mark(current, ok);
  };
  $('#next').onclick = renderWrite;
  $('#answer').focus();
}

function renderOrder() {
  current = pick(SENTENCES);
  chosen = [];
  drawOrder();
}

function drawOrder() {
  let words = current.h.replace(/[。？！]/g, '').split(/(?=[\u4e00-\u9fff])/).filter(Boolean);
  if (words.length > 12) words = current.h.replace(/[，。？！]/g, '').match(/.{1,2}/g) || words;
  const chips = shuffle(words);

  app.innerHTML = `
    <h2>Sentence order</h2>
    <div class="small">Build the sentence: ${translateMeaning(current.d)}</div>
    <div class="target" id="target"></div>
    <div class="chips">${chips.map(w => `<button class="chip">${w}</button>`).join('')}</div>
    <div id="fb" class="feedback"></div>
    ${src(current.u)}
    <div class="row"><button class="primary" id="check">Check</button><button id="clear">Reset</button><button id="next">Next</button></div>`;

  document.querySelectorAll('.chip').forEach(b => b.onclick = () => {
    chosen.push(b.textContent);
    b.classList.add('used');
    b.disabled = true;
    $('#target').innerHTML = chosen.map(x => `<span class="chip">${x}</span>`).join('');
  });

  $('#check').onclick = () => {
    const ok = norm(chosen.join('')) === norm(current.h);
    $('#fb').innerHTML = ok ? `<span class="ok">Correct.</span>` : `<span class="bad">Wrong.</span> Correct: ${current.h} (${current.p})`;
    mark(current, ok, 's');
  };
  $('#clear').onclick = drawOrder;
  $('#next').onclick = renderOrder;
}

function renderCloze() {
  current = pick(SENTENCES);
  const chars = [...current.h].filter(ch => /[\u4e00-\u9fff]/.test(ch));
  const missing = chars[Math.floor(Math.random() * chars.length)];
  const blank = current.h.replace(missing, '___');

  app.innerHTML = `
    <h2>Cloze exercise</h2>
    <div class="question hanzi">${blank}</div>
    <div class="small">Meaning: ${translateMeaning(current.d)}</div>
    <input id="answer" placeholder="Missing Hanzi">
    <div id="fb" class="feedback"></div>
    ${src(current.u)}
    <div class="row"><button class="primary" id="check">Check</button><button id="next">Next</button></div>`;

  $('#check').onclick = () => {
    const ok = norm($('#answer').value) === norm(missing);
    $('#fb').innerHTML = ok ? `<span class="ok">Correct.</span>` : `<span class="bad">Wrong.</span> Correct: ${missing} → ${current.h}`;
    mark(current, ok, 'c');
  };
  $('#next').onclick = renderCloze;
  $('#answer').focus();
}

function renderDialogue() {
  current = pick(DIALOGUE_Q);
  app.innerHTML = `
    <h2>Dialogue questions</h2>
    <div class="question">${current.q}</div>
    <input id="answer" placeholder="Answer in Chinese">
    <div id="fb" class="feedback"></div>
    ${src(current.u)}
    <div class="row"><button class="primary" id="check">Check</button><button id="next">Next</button></div>`;

  $('#check').onclick = () => {
    const ok = norm($('#answer').value) === norm(current.a);
    $('#fb').innerHTML = ok ? `<span class="ok">Correct.</span>` : `<span class="bad">Wrong.</span> Correct: ${current.a}`;
    mark({ u: current.u, h: current.q }, ok, 'd');
  };
  $('#next').onclick = renderDialogue;
  $('#answer').focus();
}

function makeExamQ() {
  const type = shuffle(['v', 's', 'c', 'd'])[0];

  if (type === 'v') {
    const v = pick(VOCAB);
    const right = translateMeaning(v.d);
    const opts = shuffle([right, ...shuffle(pool(VOCAB).filter(x => x !== v)).slice(0, 3).map(x => translateMeaning(x.d))]);
    return { type, q: v.h + ' · ' + v.p, opts, ans: right, u: v.u };
  }

  if (type === 's') {
    const s = pick(SENTENCES);
    return { type, q: 'Translate into Chinese: ' + translateMeaning(s.d), ans: s.h, u: s.u, input: true };
  }

  if (type === 'c') {
    const s = pick(SENTENCES);
    const chars = [...s.h].filter(ch => /[\u4e00-\u9fff]/.test(ch));
    const m = chars[Math.floor(Math.random() * chars.length)];
    return { type, q: s.h.replace(m, '___') + ' · ' + translateMeaning(s.d), ans: m, u: s.u, input: true };
  }

  const d = pick(DIALOGUE_Q);
  return { type, q: d.q, ans: d.a, u: d.u, input: true };
}

function renderExam(start = false) {
  if (start) exam = { qs: Array.from({ length: 25 }, makeExamQ), i: 0, ok: 0, bad: 0, wrong: [] };

  if (!exam.qs.length) {
    app.innerHTML = `<h2>Exam mode</h2><p>25 mixed questions from all selected units.</p><button class="primary" id="start">Start</button>`;
    $('#start').onclick = () => renderExam(true);
    return;
  }

  if (exam.i >= exam.qs.length) {
    const pct = Math.round(exam.ok / exam.qs.length * 100);
    app.innerHTML = `
      <h2>Result: ${pct}%</h2>
      <p>Correct: ${exam.ok} · Wrong: ${exam.bad}</p>
      <div class="progressbar"><span style="width:${pct}%"></span></div>
      <h3>Mistakes</h3>
      ${exam.wrong.length ? '<ul>' + exam.wrong.map(w => `<li><b>${w.q}</b><br>Correct: ${w.ans}</li>`).join('') + '</ul>' : '<p>No mistakes.</p>'}
      <button class="primary" id="again">New exam</button>`;
    $('#again').onclick = () => renderExam(true);
    return;
  }

  const q = exam.qs[exam.i];
  app.innerHTML = `
    <h2>Exam mode</h2>
    <div class="small">Question ${exam.i + 1}/${exam.qs.length} · Unit ${q.u}</div>
    <div class="question">${q.q}</div>
    ${q.input ? '<input id="answer" placeholder="Answer"><div id="fb" class="feedback"></div><div class="row"><button class="primary" id="check">Check</button></div>' : `<div class="options">${q.opts.map(o => `<button>${o}</button>`).join('')}</div><div id="fb" class="feedback"></div>`}`;

  function check(val) {
    const ok = norm(val) === norm(q.ans);
    ok ? exam.ok++ : (exam.bad++, exam.wrong.push(q));
    $('#fb').innerHTML = ok ? '<span class="ok">Correct.</span>' : `<span class="bad">Wrong.</span> Correct: ${q.ans}`;
    setTimeout(() => { exam.i++; renderExam(); }, 900);
  }

  if (q.input) {
    $('#check').onclick = () => check($('#answer').value);
    $('#answer').focus();
  } else {
    document.querySelectorAll('.options button').forEach(b => b.onclick = () => check(b.textContent));
  }
}

function renderList() {
  const rows = pool(VOCAB).map(v => `
    <tr><td>${v.u}</td><td class="hanzi" style="font-size:24px">${v.h}</td><td>${v.p}</td><td>${translateMeaning(v.d)}</td></tr>`).join('');

  app.innerHTML = `
    <h2>Vocabulary list</h2>
    <table class="table"><thead><tr><th>Unit</th><th>Hanzi</th><th>Pinyin</th><th>Meaning</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function setupTabs() {
  const labels = {
    cards: 'Flashcards',
    write: 'Writing',
    order: 'Sentence order',
    cloze: 'Cloze',
    dialogue: 'Dialogue',
    exam: 'Exam',
    list: 'Vocabulary'
  };

  document.querySelectorAll('.tabs button').forEach(b => {
    if (labels[b.dataset.tab]) b.textContent = labels[b.dataset.tab];
    b.onclick = () => {
      document.querySelectorAll('.tabs button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      tab = b.dataset.tab;
      render();
    };
  });
}

setupSelectors();
setupTabs();
unitFilter.onchange = () => { queues = {}; render(); };
dirFilter.onchange = render;
$('#resetBtn').textContent = 'Reset progress';
$('#resetBtn').onclick = () => {
  if (confirm('Really delete your progress?')) {
    progress = {};
    save();
    render();
  }
};

renderStats();
render();
