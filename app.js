const STRUCTURES = [
  // Pulmão direito — aparece no lado esquerdo do desenho
  { id: 'R-a', side: 'right', label: 'a', name: 'Brônquio principal direito', x: 28.2, y: 37.1 },
  { id: 'R-b', side: 'right', label: 'b', name: 'Brônquio lobar superior direito', x: 25.7, y: 31.2 },
  { id: 'R-1', side: 'right', label: '1', name: 'Brônquio segmentar apical', x: 27.0, y: 17.0 },
  { id: 'R-2', side: 'right', label: '2', name: 'Brônquio segmentar posterior', x: 15.8, y: 26.0 },
  { id: 'R-3', side: 'right', label: '3', name: 'Brônquio segmentar anterior', x: 15.7, y: 21.1 },
  { id: 'R-c', side: 'right', label: 'c', name: 'Brônquio lobar médio', x: 23.2, y: 44.7 },
  { id: 'R-4', side: 'right', label: '4', name: 'Brônquio segmentar lateral', x: 13.4, y: 51.0 },
  { id: 'R-5', side: 'right', label: '5', name: 'Brônquio segmentar medial', x: 20.4, y: 40.2 },
  { id: 'R-d', side: 'right', label: 'd', name: 'Brônquio lobar inferior direito', x: 22.3, y: 51.7 },
  { id: 'R-6', side: 'right', label: '6', name: 'Brônquio segmentar superior', x: 29.3, y: 59.7 },
  { id: 'R-7', side: 'right', label: '7', name: 'Brônquio segmentar basilar medial', x: 21.4, y: 68.4 },
  { id: 'R-8', side: 'right', label: '8', name: 'Brônquio segmentar basilar anterior', x: 8.8, y: 60.2 },
  { id: 'R-9', side: 'right', label: '9', name: 'Brônquio segmentar basilar lateral', x: 6.7, y: 73.7 },
  { id: 'R-10', side: 'right', label: '10', name: 'Brônquio segmentar basilar posterior', x: 21.1, y: 77.1 },

  // Pulmão esquerdo — aparece no lado direito do desenho
  { id: 'L-e', side: 'left', label: 'e', name: 'Brônquio principal esquerdo', x: 53.6, y: 32.4 },
  { id: 'L-f', side: 'left', label: 'f', name: 'Brônquio lobar superior esquerdo', x: 69.0, y: 36.2 },
  { id: 'L-12', side: 'left', label: '1&2', name: 'Brônquio segmentar apicoposterior', x: 65.1, y: 24.6, wide: true },
  { id: 'L-3', side: 'left', label: '3', name: 'Brônquio segmentar anterior', x: 78.6, y: 30.4 },
  { id: 'L-4', side: 'left', label: '4', name: 'Brônquio segmentar lingular superior', x: 86.3, y: 34.0 },
  { id: 'L-5', side: 'left', label: '5', name: 'Brônquio segmentar lingular inferior', x: 74.7, y: 42.0 },
  { id: 'L-g', side: 'left', label: 'g', name: 'Brônquio lobar inferior esquerdo', x: 69.0, y: 46.7 },
  { id: 'L-6', side: 'left', label: '6', name: 'Brônquio segmentar superior', x: 79.0, y: 52.8 },
  { id: 'L-7', side: 'left', label: '7', name: 'Brônquio segmentar basilar medial', x: 84.2, y: 65.8 },
  { id: 'L-8', side: 'left', label: '8', name: 'Brônquio segmentar basilar anterior', x: 87.8, y: 59.7 },
  { id: 'L-9', side: 'left', label: '9', name: 'Brônquio segmentar basilar lateral', x: 91.0, y: 73.6 },
  { id: 'L-10', side: 'left', label: '10', name: 'Brônquio segmentar basilar posterior', x: 73.0, y: 77.0 }
];

const STORAGE_HISTORY = 'bronchialMatchHistoryV1';
const STORAGE_PLAYER = 'bronchialMatchPlayerV1';
const MAX_HISTORY = 40;

const els = {
  hotspots: document.querySelector('#hotspots'),
  nameList: document.querySelector('#nameList'),
  timer: document.querySelector('#timer'),
  attempts: document.querySelector('#attempts'),
  errors: document.querySelector('#errors'),
  matchedCount: document.querySelector('#matchedCount'),
  playerNameDisplay: document.querySelector('#playerNameDisplay'),
  selectionHelp: document.querySelector('#selectionHelp'),
  startModal: document.querySelector('#startModal'),
  playerNameInput: document.querySelector('#playerNameInput'),
  startBtn: document.querySelector('#startBtn'),
  newGameBtn: document.querySelector('#newGameBtn'),
  finishModal: document.querySelector('#finishModal'),
  finishSummary: document.querySelector('#finishSummary'),
  finishTime: document.querySelector('#finishTime'),
  finishAttempts: document.querySelector('#finishAttempts'),
  finishErrors: document.querySelector('#finishErrors'),
  playAgainBtn: document.querySelector('#playAgainBtn'),
  historyBtn: document.querySelector('#historyBtn'),
  finishHistoryBtn: document.querySelector('#finishHistoryBtn'),
  historyPanel: document.querySelector('#historyPanel'),
  historyContent: document.querySelector('#historyContent'),
  closeHistoryBtn: document.querySelector('#closeHistoryBtn'),
  clearHistoryBtn: document.querySelector('#clearHistoryBtn'),
  panelBackdrop: document.querySelector('#panelBackdrop'),
  bestTime: document.querySelector('#bestTime'),
  showTargets: document.querySelector('#showTargets'),
  toast: document.querySelector('#toast')
};

let state = {
  player: '',
  selectedId: null,
  matched: new Map(),
  attempts: 0,
  errors: 0,
  startedAt: null,
  elapsedBeforePause: 0,
  timerId: null,
  sessionId: null,
  running: false,
  filter: 'all'
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sideName(side) {
  return side === 'right' ? 'Pulmão direito' : 'Pulmão esquerdo';
}

function renderHotspots() {
  els.hotspots.innerHTML = '';
  STRUCTURES.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `hotspot${item.wide ? ' wide' : ''}`;
    btn.dataset.id = item.id;
    btn.style.left = `${item.x}%`;
    btn.style.top = `${item.y}%`;
    btn.setAttribute('aria-label', `Alvo ${item.label} — ${sideName(item.side)}`);
    btn.title = `${item.label} • ${sideName(item.side)}`;
    btn.addEventListener('click', () => handleHotspotClick(item, btn));
    els.hotspots.appendChild(btn);
  });
  updateTargetVisibility();
}

function renderNames() {
  els.nameList.innerHTML = '';
  const randomized = shuffle(STRUCTURES);
  randomized.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'name-card';
    btn.dataset.id = item.id;
    btn.dataset.side = item.side;
    btn.innerHTML = `<span class="side-badge">${sideName(item.side)}</span><span class="title">${item.name}</span>`;
    btn.addEventListener('click', () => handleNameClick(item, btn));
    els.nameList.appendChild(btn);
  });
  applyFilter();
}

function handleNameClick(item, btn) {
  if (!state.running || state.matched.has(item.id)) return;
  document.querySelectorAll('.name-card.active').forEach(el => el.classList.remove('active'));
  state.selectedId = item.id;
  const activeColor = nextPairColor();
  btn.style.setProperty('--active-color', activeColor);
  btn.classList.add('active');
  els.selectionHelp.textContent = `Selecionado: ${item.name}. Agora toque em ${item.label} no lado correto do desenho.`;
  highlightSide(item.side);
}

function handleHotspotClick(item, btn) {
  if (!state.running || state.matched.has(item.id)) return;
  if (!state.selectedId) {
    btn.classList.add('selected-target');
    setTimeout(() => btn.classList.remove('selected-target'), 700);
    toast('Primeiro escolha um nome na lista.');
    return;
  }

  state.attempts += 1;
  const selected = STRUCTURES.find(s => s.id === state.selectedId);

  if (selected.id === item.id) {
    const color = nextPairColor();
    state.matched.set(item.id, color);
    btn.style.setProperty('--pair-color', color);
    btn.classList.add('matched');

    const nameBtn = document.querySelector(`.name-card[data-id="${CSS.escape(item.id)}"]`);
    if (nameBtn) {
      nameBtn.classList.remove('active');
      nameBtn.style.setProperty('--pair-color', color);
      nameBtn.classList.add('matched');
    }

    state.selectedId = null;
    els.selectionHelp.textContent = 'Par correto! Escolha outro nome.';
    chirp(true);
    toast(`Correto: ${item.label}`);
  } else {
    state.errors += 1;
    btn.classList.add('wrong');
    setTimeout(() => btn.classList.remove('wrong'), 420);
    const selectedBtn = document.querySelector(`.name-card[data-id="${CSS.escape(selected.id)}"]`);
    if (selectedBtn) {
      selectedBtn.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ], { duration: 280 });
    }
    chirp(false);
    toast('Ainda não. Tente outro alvo.');
  }

  updateStats();
  persistCurrentSession();

  if (state.matched.size === STRUCTURES.length) finishGame();
}

function highlightSide(side) {
  document.querySelectorAll('.hotspot').forEach(h => {
    const item = STRUCTURES.find(s => s.id === h.dataset.id);
    if (!item || state.matched.has(item.id)) return;
    h.style.opacity = item.side === side ? '1' : '.46';
  });
  setTimeout(() => {
    document.querySelectorAll('.hotspot').forEach(h => h.style.opacity = '');
  }, 900);
}

function nextPairColor() {
  const i = state.matched.size;
  const hue = (i * 47 + 8) % 360;
  return `hsl(${hue} 82% 48%)`;
}

function updateTargetVisibility() {
  document.querySelectorAll('.hotspot').forEach(h => {
    h.classList.toggle('hidden-target', !els.showTargets.checked && !h.classList.contains('matched'));
  });
}

function updateStats() {
  els.attempts.textContent = state.attempts;
  els.errors.textContent = state.errors;
  els.matchedCount.textContent = state.matched.size;
  els.playerNameDisplay.textContent = state.player || '—';
}

function formatTime(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
  const sec = (totalSec % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

function currentElapsed() {
  if (!state.startedAt) return state.elapsedBeforePause || 0;
  return state.elapsedBeforePause + (Date.now() - state.startedAt);
}

function startTimer() {
  clearInterval(state.timerId);
  state.startedAt = Date.now();
  state.timerId = setInterval(() => {
    const elapsed = currentElapsed();
    els.timer.textContent = formatTime(elapsed);
    if (Math.floor(elapsed / 1000) % 5 === 0) persistCurrentSession();
  }, 250);
}

function stopTimer() {
  const elapsed = currentElapsed();
  clearInterval(state.timerId);
  state.timerId = null;
  state.elapsedBeforePause = elapsed;
  state.startedAt = null;
  els.timer.textContent = formatTime(elapsed);
  return elapsed;
}

function startGame(playerName) {
  interruptPreviousOpenSession();
  state = {
    player: playerName.trim() || 'Jogador',
    selectedId: null,
    matched: new Map(),
    attempts: 0,
    errors: 0,
    startedAt: null,
    elapsedBeforePause: 0,
    timerId: null,
    sessionId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    running: true,
    filter: state.filter || 'all'
  };

  localStorage.setItem(STORAGE_PLAYER, state.player);
  els.startModal.classList.remove('open');
  els.finishModal.classList.remove('open');
  els.timer.textContent = '00:00';
  els.selectionHelp.textContent = 'Toque em um nome para começar um par.';
  renderHotspots();
  renderNames();
  updateStats();
  startTimer();
  persistCurrentSession(true);
}

function finishGame() {
  state.running = false;
  const elapsed = stopTimer();
  persistCurrentSession(false, 'completed');
  updateBestTime();
  els.finishTime.textContent = formatTime(elapsed);
  els.finishAttempts.textContent = state.attempts;
  els.finishErrors.textContent = state.errors;
  els.finishSummary.textContent = `${state.player}, você relacionou as 26 estruturas do desenho.`;
  setTimeout(() => els.finishModal.classList.add('open'), 500);
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]'); }
  catch { return []; }
}

function setHistory(history) {
  localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function persistCurrentSession(isNew = false, forcedStatus = null) {
  if (!state.sessionId) return;
  const history = getHistory();
  const elapsed = currentElapsed();
  const record = {
    id: state.sessionId,
    player: state.player,
    startedIso: new Date((state.startedAt || Date.now()) - state.elapsedBeforePause).toISOString(),
    updatedIso: new Date().toISOString(),
    elapsedMs: elapsed,
    attempts: state.attempts,
    errors: state.errors,
    matched: state.matched.size,
    status: forcedStatus || (state.running ? 'in_progress' : 'interrupted')
  };
  const idx = history.findIndex(h => h.id === record.id);
  if (idx >= 0) history[idx] = { ...history[idx], ...record };
  else history.unshift(record);
  setHistory(history);
  if (!isNew) renderHistory();
}

function interruptPreviousOpenSession() {
  const history = getHistory();
  let changed = false;
  history.forEach(h => {
    if (h.status === 'in_progress') {
      h.status = 'interrupted';
      h.updatedIso = new Date().toISOString();
      changed = true;
    }
  });
  if (changed) setHistory(history);
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) {
    els.historyContent.innerHTML = '<div class="empty">Nenhuma tentativa registrada ainda.</div>';
    return;
  }
  els.historyContent.innerHTML = history.map((h, index) => {
    const date = new Date(h.startedIso);
    const dateText = Number.isNaN(date.getTime()) ? 'Data indisponível' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    const completed = h.status === 'completed';
    return `
      <article class="history-row">
        <div class="history-top">
          <div><strong>${escapeHtml(h.player || 'Jogador')}</strong><br><small>${dateText}</small></div>
          <span class="status-pill ${completed ? '' : 'interrupted'}">${completed ? 'Concluída' : 'Interrompida'}</span>
        </div>
        <div class="history-metrics">
          <div><span>Tempo</span><b>${formatTime(h.elapsedMs || 0)}</b></div>
          <div><span>Tentativas</span><b>${h.attempts ?? 0}</b></div>
          <div><span>Erros</span><b>${h.errors ?? 0}</b></div>
        </div>
      </article>`;
  }).join('');
}

function updateBestTime() {
  const completed = getHistory().filter(h => h.status === 'completed' && Number.isFinite(h.elapsedMs));
  if (!completed.length) {
    els.bestTime.textContent = 'Melhor tempo: —';
    return;
  }
  const best = Math.min(...completed.map(h => h.elapsedMs));
  els.bestTime.textContent = `Melhor tempo: ${formatTime(best)}`;
}

function openHistory() {
  renderHistory();
  els.historyPanel.classList.add('open');
  els.panelBackdrop.classList.add('open');
  els.historyPanel.setAttribute('aria-hidden', 'false');
}

function closeHistory() {
  els.historyPanel.classList.remove('open');
  els.panelBackdrop.classList.remove('open');
  els.historyPanel.setAttribute('aria-hidden', 'true');
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => els.toast.classList.remove('show'), 1400);
}

function chirp(success) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(success ? 620 : 180, ctx.currentTime);
    if (success) osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + .12);
    gain.gain.setValueAtTime(.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .18);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + .18);
  } catch {}
}

function applyFilter() {
  document.querySelectorAll('.name-card').forEach(btn => {
    const hide = state.filter !== 'all' && btn.dataset.side !== state.filter;
    btn.classList.toggle('hidden-by-filter', hide);
  });
  document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === state.filter));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

els.startBtn.addEventListener('click', () => {
  const name = els.playerNameInput.value.trim();
  if (!name) { els.playerNameInput.focus(); toast('Digite o nome do jogador.'); return; }
  startGame(name);
});
els.playerNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') els.startBtn.click(); });
els.newGameBtn.addEventListener('click', () => {
  if (state.running && state.matched.size < STRUCTURES.length) {
    const ok = confirm('Iniciar uma nova tentativa? A atual ficará registrada como interrompida.');
    if (!ok) return;
    stopTimer();
    state.running = false;
    persistCurrentSession(false, 'interrupted');
  }
  els.playerNameInput.value = state.player || localStorage.getItem(STORAGE_PLAYER) || '';
  els.startModal.classList.add('open');
  setTimeout(() => els.playerNameInput.focus(), 100);
});
els.playAgainBtn.addEventListener('click', () => {
  els.finishModal.classList.remove('open');
  els.playerNameInput.value = state.player;
  els.startModal.classList.add('open');
});
els.historyBtn.addEventListener('click', openHistory);
els.finishHistoryBtn.addEventListener('click', () => { els.finishModal.classList.remove('open'); openHistory(); });
els.closeHistoryBtn.addEventListener('click', closeHistory);
els.panelBackdrop.addEventListener('click', closeHistory);
els.clearHistoryBtn.addEventListener('click', () => {
  if (!confirm('Apagar todo o histórico salvo neste aparelho?')) return;
  localStorage.removeItem(STORAGE_HISTORY);
  renderHistory();
  updateBestTime();
});
els.showTargets.addEventListener('change', updateTargetVisibility);
document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  state.filter = btn.dataset.filter;
  applyFilter();
}));

window.addEventListener('pagehide', () => {
  if (state.sessionId && state.running) persistCurrentSession(false, 'interrupted');
});
window.addEventListener('beforeunload', () => {
  if (state.sessionId && state.running) persistCurrentSession(false, 'interrupted');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

interruptPreviousOpenSession();
renderHotspots();
renderNames();
renderHistory();
updateBestTime();
els.playerNameInput.value = localStorage.getItem(STORAGE_PLAYER) || '';
setTimeout(() => els.playerNameInput.focus(), 200);
