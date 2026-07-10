const data = window.COURSE_DATA;
const panel = document.getElementById('panel');
const unitSelect = document.getElementById('unitSelect');
const directionSelect = document.getElementById('directionSelect');
const statsEl = document.getElementById('stats');
const tabs = [...document.querySelectorAll('.tabs button')];
const state = JSON.parse(localStorage.getItem('cet-state') || '{"correct":0,"attempts":0,"seen":{}}');
let activeTab = 'cards';
let current = null;

function save(){localStorage.setItem('cet-state',JSON.stringify(state)); renderStats()}
function norm(s){return s.trim().toLowerCase().replace(/[，。！？,.!?\s]/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function selectedUnits(){const id=unitSelect.value; return id==='all'?data.units:data.units.filter(u=>String(u.id)===id)}
function allVocab(){return selectedUnits().flatMap(u=>u.vocab.map(v=>({unit:u.id,hanzi:v[0],pinyin:v[1],meaning:v[2]})))}
function allSentences(){return selectedUnits().flatMap(u=>u.sentences.map(v=>({unit:u.id,hanzi:v[0],pinyin:v[1],meaning:v[2]})))}
function allGrammar(){return selectedUnits().flatMap(u=>u.grammar.map(v=>({unit:u.id,pattern:v[0],example:v[1],meaning:v[2]})))}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function renderStats(){
  const pct=state.attempts?Math.round(state.correct/state.attempts*100):0;
  statsEl.innerHTML=`<div class="stat"><strong>${state.correct}</strong>Correct</div><div class="stat"><strong>${state.attempts}</strong>Attempts</div><div class="stat"><strong>${pct}%</strong>Accuracy</div>`;
}

function getDirection(item){
  const d=directionSelect.value;
  if(d==='hanzi-pinyin') return [item.hanzi,item.pinyin];
  if(d==='pinyin-hanzi') return [item.pinyin,item.hanzi];
  if(d==='hanzi-meaning') return [item.hanzi,item.meaning];
  return [item.meaning,item.hanzi];
}

function renderCards(){
  current=pick(allVocab()); const [q,a]=getDirection(current);
  panel.innerHTML=`<div class="small">Unit ${current.unit}</div><div class="prompt">${esc(q)}</div><div id="reveal" class="answer hidden">${esc(a)}<br><span class="small">${esc(current.hanzi)} · ${esc(current.pinyin)} · ${esc(current.meaning)}</span></div><div class="actions"><button class="primary" id="show">Show answer</button><button class="secondary" id="next">Next</button></div>`;
  document.getElementById('show').onclick=()=>document.getElementById('reveal').classList.remove('hidden');
  document.getElementById('next').onclick=renderCards;
}

function renderWrite(){
  current=pick(allVocab()); const [q,a]=getDirection(current);
  panel.innerHTML=`<div class="small">Unit ${current.unit}</div><div class="prompt">${esc(q)}</div><div class="input-row"><input id="answerInput" autocomplete="off" placeholder="Type your answer"><button class="primary" id="check">Check</button></div><div id="feedback" class="feedback"></div><div class="actions"><button class="secondary" id="next">Next</button></div>`;
  const check=()=>{const val=document.getElementById('answerInput').value; const ok=norm(val)===norm(a); state.attempts++; if(ok)state.correct++; save(); document.getElementById('feedback').className='feedback '+(ok?'correct':'wrong'); document.getElementById('feedback').innerHTML=ok?'Correct':`Expected: ${esc(a)}`};
  document.getElementById('check').onclick=check; document.getElementById('answerInput').onkeydown=e=>{if(e.key==='Enter')check()}; document.getElementById('next').onclick=renderWrite;
}

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function renderSentences(){
  current=pick(allSentences()); const parts=current.hanzi.replace(/[。！？]/g,'').split(/(?<=[\u4e00-\u9fff])|\s+/).filter(Boolean); let built=[];
  panel.innerHTML=`<div class="small">Unit ${current.unit} · Arrange the sentence</div><div class="sentence" id="built">—</div><div class="tokens" id="tokens"></div><div id="feedback" class="feedback"></div><div class="actions"><button class="primary" id="check">Check</button><button class="secondary" id="reset">Reset</button><button class="secondary" id="next">Next</button></div><p class="subprompt">${esc(current.meaning)}</p>`;
  const tokenBox=document.getElementById('tokens');
  shuffle(parts).forEach((t,i)=>{const b=document.createElement('button');b.className='token';b.textContent=t;b.onclick=()=>{built.push(t);b.disabled=true;document.getElementById('built').textContent=built.join('')};tokenBox.appendChild(b)});
  document.getElementById('check').onclick=()=>{const ok=norm(built.join(''))===norm(current.hanzi);state.attempts++;if(ok)state.correct++;save();const f=document.getElementById('feedback');f.className='feedback '+(ok?'correct':'wrong');f.textContent=ok?'Correct':`Answer: ${current.hanzi} (${current.pinyin})`};
  document.getElementById('reset').onclick=renderSentences;document.getElementById('next').onclick=renderSentences;
}

function renderCloze(){
  current=pick(allSentences()); const chars=[...current.hanzi].filter(c=>/[\u4e00-\u9fff]/.test(c)); const target=pick(chars); const q=current.hanzi.replace(target,'＿');
  panel.innerHTML=`<div class="small">Unit ${current.unit} · Fill the blank</div><div class="prompt">${esc(q)}</div><p class="subprompt">${esc(current.meaning)}</p><div class="input-row"><input id="answerInput" maxlength="4" placeholder="Missing Hanzi"><button class="primary" id="check">Check</button></div><div id="feedback" class="feedback"></div><div class="actions"><button class="secondary" id="next">Next</button></div>`;
  const check=()=>{const ok=norm(document.getElementById('answerInput').value)===norm(target);state.attempts++;if(ok)state.correct++;save();const f=document.getElementById('feedback');f.className='feedback '+(ok?'correct':'wrong');f.textContent=ok?'Correct':`Expected: ${target} · ${current.hanzi} · ${current.pinyin}`};
  document.getElementById('check').onclick=check;document.getElementById('next').onclick=renderCloze;
}

function renderGrammar(){
  current=pick(allGrammar());
  panel.innerHTML=`<div class="small">Unit ${current.unit}</div><div class="prompt" style="font-size:2.2rem">${esc(current.pattern)}</div><div class="answer">${esc(current.example)}</div><p class="subprompt">${esc(current.meaning)}</p><div class="actions"><button class="primary" id="next">Next grammar card</button></div>`;
  document.getElementById('next').onclick=renderGrammar;
}

function renderExam(){
  const vocab=shuffle(allVocab()).slice(0,6), sent=shuffle(allSentences()).slice(0,4); const qs=[];
  vocab.forEach((v,i)=>qs.push({q:`${v.hanzi} → Pinyin`,a:v.pinyin}));
  sent.forEach((s,i)=>qs.push({q:`Translate into Chinese: ${s.meaning}`,a:s.hanzi}));
  panel.innerHTML=`<h2>10-question exam</h2><div class="progress"><span style="width:0%" id="examProgress"></span></div><form id="examForm">${qs.map((x,i)=>`<div class="exam-question"><h3>${i+1}. ${esc(x.q)}</h3><input name="q${i}" style="width:100%"></div>`).join('')}<button class="primary" type="submit">Grade exam</button></form><div id="examResult"></div>`;
  document.getElementById('examForm').onsubmit=e=>{e.preventDefault();let score=0;const details=[];qs.forEach((x,i)=>{const val=e.target.elements[`q${i}`].value;const ok=norm(val)===norm(x.a);if(ok)score++;details.push(`<li class="${ok?'correct':'wrong'}">${ok?'✓':'✗'} ${esc(x.q)} — ${esc(x.a)}</li>`)});state.attempts+=qs.length;state.correct+=score;save();document.getElementById('examProgress').style.width=`${score*10}%`;document.getElementById('examResult').innerHTML=`<h2>${score}/10</h2><ul>${details.join('')}</ul>`};
}

function renderReference(){
  const html=selectedUnits().map(u=>`<section><h2>${esc(u.title)}</h2><div class="reference-grid"><div class="ref-block"><h3>Vocabulary (${u.vocab.length})</h3><ul class="ref-list">${u.vocab.map(v=>`<li><strong>${esc(v[0])}</strong> — ${esc(v[1])}<br><span class="small">${esc(v[2])}</span></li>`).join('')}</ul></div><div class="ref-block"><h3>Sentences (${u.sentences.length})</h3><ul class="ref-list">${u.sentences.map(v=>`<li><strong>${esc(v[0])}</strong><br>${esc(v[1])}<br><span class="small">${esc(v[2])}</span></li>`).join('')}</ul></div><div class="ref-block"><h3>Grammar</h3><ul class="ref-list">${u.grammar.map(v=>`<li><strong>${esc(v[0])}</strong><br>${esc(v[1])}<br><span class="small">${esc(v[2])}</span></li>`).join('')}</ul></div></div></section>`).join('');
  panel.innerHTML=html;
}

function render(){({cards:renderCards,write:renderWrite,sentences:renderSentences,cloze:renderCloze,grammar:renderGrammar,exam:renderExam,reference:renderReference}[activeTab])()}

data.units.forEach(u=>unitSelect.add(new Option(`Unit ${u.id}`,u.id)));unitSelect.add(new Option('All units','all'),0);unitSelect.value='all';
tabs.forEach(b=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove('active'));b.classList.add('active');activeTab=b.dataset.tab;render()});
unitSelect.onchange=render;directionSelect.onchange=render;
document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset all saved progress?')){state.correct=0;state.attempts=0;state.seen={};save();render()}};
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
renderStats();render();
