// Raja Mantri Chor Sipahi — client
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------------- i18n ----------------
const T = {
  hi: {
    brand: 'राजा मंत्री चोर सिपाही',
    heroTitle: 'राजा मंत्री<br>चोर सिपाही',
    heroSub: 'बचपन वाला खेल, अब सबके phone पर। 4 दोस्त, एक room code, और ढेर सारी नौटंकी।',
    yourName: 'आपका नाम', namePh: 'जैसे: Dhanraj', pickAvatar: 'अपना चेहरा चुनें',
    create: 'नया Room बनाएं', or: 'या दोस्त के room में जाएं', codePh: 'CODE', join: 'जुड़ें',
    howTo: 'कैसे खेलें?', invitedTo: 'आपको room में बुलाया गया है',
    roomCode: 'Room Code', shareHint: 'ये code दोस्तों को बताएं या link भेजें', copy: 'Link copy करें', copied: 'Link copy हो गया', copyFail: 'Link select कर दिया है, अब copy करें', share: 'Share',
    players: 'Players', waitingSeat: 'इंतज़ार', host: 'HOST', you: 'आप', offline: 'offline',
    rounds: 'कितने rounds?', start: 'खेल शुरू करें', needMore: (n) => `${n} और player चाहिए`, waitHost: 'Host के खेल शुरू करने का इंतज़ार', leave: 'Room छोड़ें',
    round: (r, t) => `Round ${r}/${t}`,
    tapReveal: 'छूकर अपना role देखें', secret: 'गुप्त<br>पर्ची', keepSecret: 'किसी को दिखाना मत',
    rajaIs: 'राजा', mantriIs: 'मंत्री', peekFirst: 'पहले अपनी पर्ची देखें, फिर पता चलेगा राजा और मंत्री कौन हैं',
    callBtn: '📢 मंत्री, चोर को पकड़ो!', waitRaja: 'राजा के हुक्म का इंतज़ार', autoIn: 's में अपने आप',
    whoChor: 'चोर कौन है?', pickOne: 'इन दोनों में से एक चोर है, एक सिपाही। सोच समझकर चुनें!', thisChor: 'यही चोर है',
    mantriThinking: (n) => `मंत्री ${esc(n)} सोच रहे हैं`, keepFace: 'चेहरा सामान्य रखो, मंत्री देख रहा है!', youAreSuspect: 'आप भी शक के घेरे में हैं',
    drum: 'और चोर है', caught: 'सही पकड़ा!', missed: 'चोर बच गया!', timeout: 'समय खत्म!',
    storyCorrect: (m, c) => `${esc(m)} ने ${esc(c)} को पकड़ लिया। सबको पूरे अंक मिले।`,
    storyWrong: (m, g, c) => `${esc(m)} ने ${esc(g)} को पकड़ा, पर असली चोर ${esc(c)} था। मंत्री के 800 अंक चोर ले गया।`,
    storyTimeout: (m, c) => `${esc(m)} समय पर फैसला नहीं कर पाए। चोर ${esc(c)} को 800 अंक मिल गए।`,
    scoreboard: 'Scoreboard', next: 'अगला Round', seeFinal: 'आखिरी नतीजे देखें', waitNext: 'Host अगला round शुरू करेगा',
    winner: 'विजेता', finalTitle: 'खेल खत्म!', again: 'फिर से खेलें', waitAgain: 'Host फिर से खेल शुरू कर सकता है', stats: (c, w) => `मंत्री ने ${c} बार चोर पकड़ा, ${w} बार चूके`,
    pts: 'अंक', reconnecting: 'जुड़ रहे हैं',
    err: {
      noroom: 'ये room नहीं मिला। Code दोबारा जाँचें।', full: 'Room भर चुका है (4/4)।', started: 'इस room में खेल पहले ही शुरू हो चुका है।',
      nametaken: 'इस नाम का player पहले से है। दूसरा नाम चुनें।', name: 'पहले अपना नाम लिखें।', need4: 'खेलने के लिए ठीक 4 players चाहिए।',
      offline: 'कोई player offline है। उसके लौटने का इंतज़ार करें।', noseat: 'आपकी seat नहीं मिली।', code: '4 अक्षर का room code डालें।',
    },
    roles: { raja: 'राजा', mantri: 'मंत्री', sipahi: 'सिपाही', chor: 'चोर' },
    tips: {
      raja: 'आप राजा हैं! सबको बताइए और मंत्री को चोर पकड़ने का हुक्म दीजिए।',
      mantri: 'चोर और सिपाही में से चोर पहचानिए। गलत हुए तो आपके अंक चोर ले जाएगा!',
      sipahi: 'चेहरा सामान्य रखिए और मंत्री को सही चोर पकड़ने दीजिए।',
      chor: 'पकड़े मत जाना! मंत्री को बहकाओ और उसके 800 अंक चुराओ।',
    },
    helpTitle: 'कैसे खेलें',
    helpSteps: [
      'एक दोस्त room बनाता है और बाकी 3 लोग room code से जुड़ते हैं।',
      'हर round में चार गुप्त पर्चियाँ बँटती हैं: राजा, मंत्री, सिपाही और चोर। अपनी पर्ची छूकर देखें।',
      'राजा और मंत्री सबके सामने आ जाते हैं। राजा हुक्म देता है: "मंत्री, चोर को पकड़ो!"',
      'मंत्री के पास 30 seconds होते हैं। बचे हुए दो लोगों में से उसे चोर चुनना होता है।',
      'सही पकड़ा तो सबको अपने अंक मिलते हैं। गलत हुआ तो मंत्री और चोर के अंक आपस में बदल जाते हैं।',
      'सारे rounds के बाद जिसके सबसे ज़्यादा अंक हों, वही असली बादशाह!',
    ],
    close: 'समझ गया',
    foot: 'बिना login, बिना app। बस room code और दोस्त।',
  },
  en: {
    brand: 'Raja Mantri Chor Sipahi',
    heroTitle: 'Raja Mantri<br>Chor Sipahi',
    heroSub: 'The classic Indian childhood game, now on everyone\'s phone. 4 friends, one room code, plenty of drama.',
    yourName: 'Your name', namePh: 'e.g. Dhanraj', pickAvatar: 'Pick your face',
    create: 'Create a Room', or: 'or join a friend\'s room', codePh: 'CODE', join: 'Join',
    howTo: 'How to play?', invitedTo: 'You\'ve been invited to a room',
    roomCode: 'Room Code', shareHint: 'Tell friends this code or send the link', copy: 'Copy link', copied: 'Link copied', copyFail: 'Link selected, copy it now', share: 'Share',
    players: 'Players', waitingSeat: 'Waiting', host: 'HOST', you: 'You', offline: 'offline',
    rounds: 'How many rounds?', start: 'Start the game', needMore: (n) => `Need ${n} more player${n > 1 ? 's' : ''}`, waitHost: 'Waiting for the host to start', leave: 'Leave room',
    round: (r, t) => `Round ${r}/${t}`,
    tapReveal: 'Tap to see your role', secret: 'Secret<br>Chit', keepSecret: 'Don\'t show anyone',
    rajaIs: 'Raja', mantriIs: 'Mantri', peekFirst: 'Check your chit first to see who the Raja and Mantri are',
    callBtn: '📢 Mantri, catch the Chor!', waitRaja: 'Waiting for the Raja\'s order', autoIn: 's until auto-start',
    whoChor: 'Who is the Chor?', pickOne: 'One of these two is the Chor, the other is the Sipahi. Choose wisely!', thisChor: 'This is the Chor',
    mantriThinking: (n) => `Mantri ${esc(n)} is thinking`, keepFace: 'Keep a straight face, the Mantri is watching!', youAreSuspect: 'You are a suspect too',
    drum: 'And the Chor is', caught: 'Caught!', missed: 'Chor escaped!', timeout: 'Time\'s up!',
    storyCorrect: (m, c) => `${esc(m)} caught ${esc(c)}. Everyone gets their full points.`,
    storyWrong: (m, g, c) => `${esc(m)} accused ${esc(g)}, but the real Chor was ${esc(c)}. The Chor stole the Mantri's 800 points.`,
    storyTimeout: (m, c) => `${esc(m)} ran out of time. ${esc(c)} the Chor walks away with 800 points.`,
    scoreboard: 'Scoreboard', next: 'Next Round', seeFinal: 'See final results', waitNext: 'The host will start the next round',
    winner: 'Winner', finalTitle: 'Game over!', again: 'Play again', waitAgain: 'The host can start a new game', stats: (c, w) => `The Mantri caught the Chor ${c} time${c === 1 ? '' : 's'} and missed ${w}`,
    pts: 'pts', reconnecting: 'Reconnecting',
    err: {
      noroom: 'Room not found. Check the code.', full: 'Room is full (4/4).', started: 'The game in this room has already started.',
      nametaken: 'Someone already has that name. Pick another.', name: 'Enter your name first.', need4: 'Exactly 4 players are needed to play.',
      offline: 'A player is offline. Wait for them to return.', noseat: 'Your seat could not be found.', code: 'Enter a 4-letter room code.',
    },
    roles: { raja: 'Raja', mantri: 'Mantri', sipahi: 'Sipahi', chor: 'Chor' },
    tips: {
      raja: 'You are the King! Announce yourself and order the Mantri to catch the Chor.',
      mantri: 'Find the Chor between the two. Guess wrong and the Chor takes your points!',
      sipahi: 'Keep a straight face and let the Mantri find the real Chor.',
      chor: 'Don\'t get caught! Fool the Mantri and steal their 800 points.',
    },
    helpTitle: 'How to play',
    helpSteps: [
      'One friend creates a room, the other 3 join with the room code.',
      'Each round four secret chits are dealt: Raja, Mantri, Sipahi and Chor. Tap yours to see it.',
      'The Raja and Mantri are revealed to all. The Raja orders: "Mantri, catch the Chor!"',
      'The Mantri gets 30 seconds to pick the Chor from the two remaining players.',
      'Correct guess: everyone gets their points. Wrong guess: the Mantri and Chor swap points.',
      'After all rounds, the highest score is the true emperor!',
    ],
    close: 'Got it',
    foot: 'No login, no app. Just a room code and friends.',
  },
};
const ICON = { raja: '👑', mantri: '📜', sipahi: '🛡️', chor: '🎭' };
const POINTS = { raja: 1000, mantri: 800, sipahi: 500, chor: 0 };
const AVATARS = ['🐯', '🦚', '🐘', '🐒', '🐫', '🦜', '🐍', '🐄'];

// ---------------- state ----------------
const S = {
  lang: 'hi', muted: false, name: '', avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)], joinCode: '',
  ws: null, wsOpen: false, retry: 0, room: null, you: null, session: null, offset: 0,
  mountedKey: '', cardOpenRound: 0, resultReadyAt: {}, lastTickSec: null, pending: null,
};
const t = (k) => T[S.lang][k];

// ---------------- URL hash (room + seat survive refresh) ----------------
function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  return { r: (h.get('r') || '').toUpperCase(), p: h.get('p') || '', join: (h.get('join') || '').toUpperCase(), lang: h.get('lang') };
}
function writeHash() {
  const h = new URLSearchParams();
  if (S.session) { h.set('r', S.session.code); h.set('p', S.session.pid); }
  if (S.lang !== 'hi') h.set('lang', S.lang);
  const str = h.toString();
  try { history.replaceState(null, '', str ? '#' + str : location.pathname + location.search); } catch {}
}
function inviteUrl(code) {
  const base = location.href.split('#')[0];
  return `${base}#join=${code}${S.lang !== 'hi' ? '&lang=' + S.lang : ''}`;
}

// ---------------- sound (Web Audio, no files) ----------------
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch { AC = null; } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
function tone(freq, dur = 0.12, type = 'sine', vol = 0.18, when = 0) {
  if (S.muted) return; const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(); const t0 = a.currentTime + when;
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
}
const sfx = {
  tap: () => tone(660, 0.06, 'triangle', 0.08),
  join: () => { tone(523, 0.1, 'triangle', 0.12); tone(784, 0.14, 'triangle', 0.12, 0.08); },
  flip: () => { tone(300, 0.08, 'sawtooth', 0.05); tone(900, 0.12, 'triangle', 0.1, 0.06); },
  horn: () => { [392, 523, 659].forEach((f, i) => tone(f, 0.28, 'square', 0.07, i * 0.12)); },
  tick: (hot) => tone(hot ? 1200 : 880, hot ? 0.07 : 0.05, 'square', hot ? 0.09 : 0.05),
  drum: () => { for (let i = 0; i < 12; i++) tone(90 + (i % 2) * 20, 0.08, 'triangle', 0.14, i * 0.13); },
  good: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.12, i * 0.09)); },
  bad: () => { tone(220, 0.35, 'sawtooth', 0.1); tone(160, 0.45, 'sawtooth', 0.1, 0.18); },
  fanfare: () => { [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.12, i * 0.13)); },
};

// ---------------- websocket ----------------

function wsUrl() {

  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';

  return `${protocol}//${location.host}/ws`;

}

function connect() {
  let ws;
  try { ws = new WebSocket(wsUrl()); } catch { return scheduleRetry(); }
  S.ws = ws;
  ws.onopen = () => {
    S.wsOpen = true; S.retry = 0; setConn(true);
    if (S.session) sendRaw({ t: 'resume', code: S.session.code, pid: S.session.pid });
    if (S.pending) { sendRaw(S.pending); S.pending = null; }
  };
  ws.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch { return; } onMsg(m); };
  ws.onclose = () => { S.wsOpen = false; if (S.ws === ws) { setConn(false); scheduleRetry(); } };
  ws.onerror = () => {};
}
function scheduleRetry() { const d = Math.min(8000, 500 * 2 ** S.retry++); setTimeout(connect, d); }
function sendRaw(m) { if (S.ws && S.ws.readyState === 1) S.ws.send(JSON.stringify(m)); else S.pending = m; }
function send(m) { sendRaw(m); }
function setConn(ok) {
  const el = $('#conn'); el.textContent = ok ? '' : t('reconnecting');
  el.classList.toggle('show', !ok && (S.session || S.pending));
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && (!S.ws || S.ws.readyState > 1)) connect(); });



function onMsg(m) {
  if (m.t === 'state') {
    const prev = S.room;
    S.room = m.room;
    S.you = m.you;

    if (typeof window.voiceUpdate === 'function') {
      window.voiceUpdate();
    }

    S.offset = m.room.serverNow - Date.now();
    S.session = { code: m.room.code, pid: m.you };
    writeHash();
    soundForTransition(prev, m.room);
    render();

  } else if (m.t === 'voice-signal') 
  else if (m.t === 'chat-message') {
  chatAddMessage(m);
}
{
    if (typeof window.voiceSignal === 'function') {
      window.voiceSignal(m.from, m.signal);
    }

  } else if (m.t === 'error') {
    if (m.code === 'noroom' || m.code === 'noseat') {
      S.session = null;
      S.room = null;
      writeHash();
      render();
    }
    toast(T[S.lang].err[m.code] || m.code);

  } else if (m.t === 'left') {
    S.session = null;
    S.room = null;
    S.you = null;
    writeHash();
    render();
  }
}


function soundForTransition(prev, next) {
  if (!prev) return;
  if (prev.players.length < next.players.length) sfx.join();
  if (prev.phase !== next.phase) {
    if (next.phase === 'guess') sfx.horn();
    if (next.phase === 'result') sfx.drum();
    if (next.phase === 'final') setTimeout(sfx.fanfare, 200);
  }
}

// ---------------- helpers ----------------
const me = () => S.room?.players.find(p => p.id === S.you);
const byId = (id) => S.room?.players.find(p => p.id === id);
const roleOf = (role) => S.room?.players.find(p => p.role === role);
const isHost = () => S.room && S.room.hostId === S.you;
const now = () => Date.now() + S.offset;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2600); }
function roleName(r) { return S.lang === 'en' ? `${T.en.roles[r]}` : T.hi.roles[r]; }
function roleGloss(r) { return S.lang === 'en' ? ({ raja: 'King', mantri: 'Minister', sipahi: 'Soldier', chor: 'Thief' })[r] : ''; }

// ---------------- render ----------------
function phaseKey() {
  if (!S.room) return 'home';
  const r = S.room;
  if (r.phase === 'result') return `result-${r.round}-${Date.now() < (S.resultReadyAt[r.round] || 0) ? 's' : 'r'}`;
  return `${r.phase}-${r.round}`;
}

function render() {
  document.documentElement.lang = S.lang === 'hi' ? 'hi' : 'en';
  $('#btnLang').textContent = S.lang === 'hi' ? 'EN' : 'हि';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  if (S.room && S.room.phase === 'result' && !S.resultReadyAt[S.room.round]) {
    S.resultReadyAt[S.room.round] = Date.now() + 2000;
    setTimeout(render, 2050);
  }
  const key = phaseKey() + '-' + S.lang;
  const html = view();
  const screen = $('#screen');
  if (key !== S.mountedKey) {
    S.mountedKey = key;
    screen.className = 'screen' + (S.room && ['result', 'final'].includes(S.room.phase) ? ' wide' : '');
    void screen.offsetWidth; screen.style.animation = 'none'; void screen.offsetWidth; screen.style.animation = '';
    screen.innerHTML = html;
    afterMount();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  } else {
    // patch only dynamic regions so animations & focus are preserved
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    screen.querySelectorAll('[data-dyn]').forEach(el => {
      const fresh = tmp.querySelector(`[data-dyn="${el.dataset.dyn}"]`);
      if (fresh && fresh.innerHTML !== el.innerHTML) el.innerHTML = fresh.innerHTML;
    });
  }
}

function view() {
  if (!S.room) return viewHome();
  switch (S.room.phase) {
    case 'lobby': return viewLobby();
    case 'roles': return viewRoles();
    case 'guess': return viewGuess();
    case 'result': return Date.now() < (S.resultReadyAt[S.room.round] || 0) ? viewSuspense() : viewResult();
    case 'final': return viewFinal();
  }
  return '';
}

function viewHome() {
  const invited = S.joinCode && S.joinCode.length === 4;
  return `
  <section class="hero">
    <div class="hero-cards" aria-hidden="true">
      ${['raja', 'mantri', 'sipahi', 'chor'].map(r => `<div class="mini-card">${ICON[r]}</div>`).join('')}
    </div>
    <h1 class="h-display title-hero">${t('heroTitle')}</h1>
    <p>${t('heroSub')}</p>
  </section>
  <form class="panel stack" id="homeForm" autocomplete="off" novalidate>
    ${invited ? `<p class="eyebrow center">${t('invitedTo')}: ${esc(S.joinCode)}</p>` : ''}
    <div>
      <label class="lbl" for="name">${t('yourName')}</label>
      <input class="input" id="name" maxlength="16" placeholder="${t('namePh')}" value="${esc(S.name)}" autocapitalize="words" enterkeyhint="go" />
    </div>
    <div>
      <span class="lbl" id="avLbl">${t('pickAvatar')}</span>
      <div class="avatars" role="group" aria-labelledby="avLbl">
        ${AVATARS.map(a => `<button type="button" class="av" data-av="${a}" aria-pressed="${a === S.avatar}" aria-label="${a}">${a}</button>`).join('')}
      </div>
    </div>
    ${invited ? `
      <button type="submit" class="btn primary block big" data-act="join">${t('join')} ${esc(S.joinCode)}</button>
      <div class="divider">${S.lang === 'hi' ? 'या' : 'or'}</div>
      <button type="button" class="btn block" data-act="create">${t('create')}</button>
    ` : `
      <button type="submit" class="btn primary block big" data-act="create">${t('create')}</button>
      <div class="divider">${t('or')}</div>
      <div class="join-row">
        <label class="sr" for="code">${t('roomCode')}</label>
        <input class="input code" id="code" maxlength="4" placeholder="${t('codePh')}" value="${esc(S.joinCode)}" inputmode="text" autocapitalize="characters" />
        <button type="button" class="btn" data-act="join">${t('join')}</button>
      </div>
    `}
  </form>
  <div class="center" style="margin-top:16px"><button class="btn ghost" data-act="help">${t('howTo')}</button></div>
  <p class="foot">${t('foot')}</p>`;
}

function seatHtml(p) {
  if (!p) return `<div class="seat empty"><span class="dots">${t('waitingSeat')}</span></div>`;
  const tags = [p.id === S.room.hostId ? t('host') : '', p.id === S.you ? t('you') : '', !p.connected ? t('offline') : ''].filter(Boolean).join(' · ');
  return `<div class="seat ${p.id === S.you ? 'me' : ''} ${p.connected ? '' : 'off'}">
    <span class="face" aria-hidden="true">${p.avatar}</span>
    <span class="who"><span class="nm">${esc(p.name)}</span><br><span class="tag">${tags}</span></span>
  </div>`;
}

function viewLobby() {
  const r = S.room; const seats = [0, 1, 2, 3].map(i => r.players[i]);
  const need = 4 - r.players.length; const url = inviteUrl(r.code);
  return `
  <div class="panel center">
    <p class="eyebrow">${t('roomCode')}</p>
    <div class="code-tiles" aria-label="${r.code.split('').join(' ')}">${r.code.split('').map(c => `<span class="code-tile">${c}</span>`).join('')}</div>
    <p class="muted small">${t('shareHint')}</p>
    <div class="invite">
      <div class="invite-url" id="inviteUrl" tabindex="0">${esc(url)}</div>
      <button class="btn" data-act="copy">${t('copy')}</button>
    </div>
  </div>
  <div class="panel stack">
    <div class="row" style="justify-content:space-between"><h2 class="h-display title-xl">${t('players')}</h2><span class="pill" data-dyn="count">${r.players.length}/4</span></div>
    <div class="seats" data-dyn="seats">${seats.map(seatHtml).join('')}</div>
    <div data-dyn="hostctl" class="stack">
      <span class="lbl" id="rLbl">${t('rounds')}</span>
      <div class="seg" role="group" aria-labelledby="rLbl">
        ${[5, 10, 15].map(n => `<button data-rounds="${n}" aria-pressed="${r.totalRounds === n}" ${isHost() ? '' : 'disabled'}>${n}</button>`).join('')}
      </div>
      ${isHost()
        ? `<button class="btn primary block big" data-act="start" ${need > 0 ? 'disabled' : ''}>${need > 0 ? t('needMore')(need) : t('start')}</button>`
        : `<p class="status-line"><span class="dots">${t('waitHost')}</span></p>`}
    </div>
  </div>
  <div class="center" style="margin-top:14px"><button class="btn ghost" data-act="leave">${t('leave')}</button></div>`;
}

function roundHead(timerLabel = true) {
  const r = S.room;
  return `<div class="round-head">
    <span class="pill">${t('round')(r.round, r.totalRounds)}</span>
    <span class="pill">${me()?.avatar || ''} ${esc(me()?.name || '')} · <span class="secs">${me()?.score ?? 0}</span></span>
  </div>`;
}

function knownHtml() {
  const raja = roleOf('raja'), mantri = roleOf('mantri');
  return `<div class="known">
    ${[['raja', raja], ['mantri', mantri]].map(([role, p]) => `
      <div class="k" data-role="${role}"><span class="ic" aria-hidden="true">${ICON[role]}</span>
        <span style="min-width:0"><span class="lb">${roleName(role)}</span><br><span class="nm">${p ? `${p.avatar} ${esc(p.name)}${p.id === S.you ? ` (${t('you')})` : ''}` : '?'}</span></span></div>`).join('')}
  </div>`;
}

function cardHtml(role, open) {
  return `<div class="card-wrap">
    <button class="flip ${open ? 'open' : ''}" id="flip" data-role="${role}" aria-label="${t('tapReveal')}" ${open ? 'aria-pressed="true"' : ''}>
      <span class="face-side card-back"><span class="seal">${t('secret')}</span><span class="hint">${t('tapReveal')}</span></span>
      <span class="face-side card-front">
        <span class="role-icon" aria-hidden="true">${ICON[role]}</span>
        <span class="role-name">${roleName(role)}</span>
        ${roleGloss(role) ? `<span class="small" style="color:#5c4a3a;font-weight:700">${roleGloss(role)}</span>` : ''}
        <span class="role-pts">${POINTS[role]} ${t('pts')}</span>
        <span class="role-tip">${t('tips')[role]}</span>
      </span>
    </button>
  </div>`;
}

function viewRoles() {
  const r = S.room; const m = me(); const role = m?.role; const open = S.cardOpenRound === r.round;
  return `${roundHead()}
  ${cardHtml(role, open)}
  <div class="panel stack">
    <div data-dyn="known">${open ? knownHtml() : `<div class="locked">🔒 ${t('peekFirst')}</div>`}</div>
    <div data-dyn="rolesCtl">${rolesCtl()}</div>
    <div class="timer" aria-hidden="true"><i data-deadline></i></div>
  </div>`;
}
function rolesCtl() {
  const role = me()?.role; const open = S.cardOpenRound === S.room.round;
  if (role === 'raja' && open) return `<button class="btn primary block big" data-act="call">${t('callBtn')}</button>`;
  return `<p class="status-line"><span class="dots">${t('waitRaja')}</span> · <span class="secs" data-secs></span>${t('autoIn')}</p>`;
}

function viewGuess() {
  const r = S.room; const m = me(); const role = m?.role;
  const mantri = roleOf('mantri');
  const suspects = r.players.filter(p => p.id !== roleOf('raja')?.id && p.id !== mantri?.id);
  if (role === 'mantri') {
    return `${roundHead()}
    <div class="panel stack center">
      <p class="eyebrow">${ICON.mantri} ${roleName('mantri')}</p>
      <h2 class="h-display title-2xl">${t('whoChor')}</h2>
      <p class="muted">${t('pickOne')}</p>
      <div class="timer" aria-hidden="true"><i data-deadline></i></div>
      <p><span class="secs" data-secs style="font-size:var(--text-xl)"></span><span class="muted">s</span></p>
      <div class="suspects">
        ${suspects.map(p => `<button class="suspect" data-guess="${p.id}"><span class="face">${p.avatar}</span><span class="nm">${esc(p.name)}</span><span class="cta">${t('thisChor')}</span></button>`).join('')}
      </div>
    </div>`;
  }
  const amSuspect = role === 'chor' || role === 'sipahi';
  return `${roundHead()}
  <div class="panel stack center">
    <p class="eyebrow">${ICON.mantri} ${mantri ? esc(mantri.name) : ''}</p>
    <h2 class="h-display title-xl"><span class="dots">${t('mantriThinking')(mantri?.name || '')}</span></h2>
    <div class="thinking" aria-hidden="true"><span>🤔</span><span>🔍</span><span>📜</span></div>
    <div class="timer" aria-hidden="true"><i data-deadline></i></div>
    <p><span class="secs" data-secs style="font-size:var(--text-xl)"></span><span class="muted">s</span></p>
    ${amSuspect ? `<p class="story">${role === 'chor' ? '🎭 ' : '🛡️ '}${t('keepFace')}</p>` : ''}
    <div class="suspects">
      ${suspects.map(p => `<div class="suspect ${p.id === S.you ? 'me-sus' : ''}" data-role="${p.id === S.you ? role : ''}" aria-disabled="true"><span class="face">${p.avatar}</span><span class="nm">${esc(p.name)}</span><span class="cta" style="color:var(--faint)">${p.id === S.you ? `${t('you')} · ${roleName(role)}` : '?'}</span></div>`).join('')}
    </div>
  </div>`;
}

function viewSuspense() {
  return `<div class="suspense">
    <div class="drum" aria-hidden="true">🥁</div>
    <h2 class="h-display title-2xl" style="margin-top:16px"><span class="dots">${t('drum')}</span></h2>
  </div>`;
}

function boardHtml(showGain) {
  const ps = [...S.room.players].sort((a, b) => b.score - a.score);
  return `<ol class="board">${ps.map((p, i) => `<li class="${p.id === S.you ? 'me' : ''}">
    <span class="rk">${i + 1}</span><span class="fc" aria-hidden="true">${p.avatar}</span>
    <span class="nm">${esc(p.name)}${p.connected ? '' : ` <span class="muted small">(${t('offline')})</span>`}</span>
    <span class="sc">${p.score}${showGain && p.lastPoints != null ? `<span class="gain">+${p.lastPoints}</span>` : ''}</span></li>`).join('')}</ol>`;
}

function viewResult() {
  const r = S.room; const o = r.outcome || {};
  const mantri = byId(o.mantriId), chor = byId(o.chorId), guessed = byId(o.guessedId);
  const stampCls = o.correct ? 'good' : 'bad';
  const stampTxt = o.correct ? t('caught') : (o.timedOut ? t('timeout') : t('missed'));
  const story = o.correct ? t('storyCorrect')(mantri?.name, chor?.name) : (o.timedOut ? t('storyTimeout')(mantri?.name, chor?.name) : t('storyWrong')(mantri?.name, guessed?.name, chor?.name));
  const order = ['raja', 'mantri', 'sipahi', 'chor'];
  const cards = order.map(role => r.players.find(p => p.role === role)).filter(Boolean);
  const last = r.round >= r.totalRounds;
  return `${roundHead()}
  <div class="panel center stack">
    <div><span class="stamp ${stampCls}">${stampTxt}</span></div>
    <p class="story">${story}</p>
    <div class="reveal-grid">
      ${cards.map(p => {
        const swapped = !o.correct && (p.role === 'mantri' || p.role === 'chor');
        return `<div class="rv ${p.id === o.guessedId ? 'picked' : ''}" data-role="${p.role}">
          <div class="ic" aria-hidden="true">${ICON[p.role]}</div><div class="rn">${roleName(p.role)}</div>
          <div class="nm">${p.avatar} ${esc(p.name)}</div>
          <div class="pts ${p.lastPoints === 0 ? 'zero' : ''} ${swapped && p.role === 'chor' ? 'swap' : ''}">+${p.lastPoints}</div></div>`;
      }).join('')}
    </div>
  </div>
  <div class="panel stack">
    <h2 class="h-display title-xl">${t('scoreboard')}</h2>
    <div data-dyn="board">${boardHtml(true)}</div>
    <div data-dyn="nextCtl">${isHost()
      ? `<button class="btn primary block big" data-act="next">${last ? t('seeFinal') : t('next')}</button>`
      : `<p class="status-line"><span class="dots">${t('waitNext')}</span></p>`}</div>
  </div>`;
}

function viewFinal() {
  const r = S.room; const ps = [...r.players].sort((a, b) => b.score - a.score);
  const [p1, p2, p3] = ps;
  const pod = (p, cls, n) => p ? `<div class="pod ${cls}"><div class="face">${n === 1 ? `<span class="crown-bounce">👑</span><br>` : ''}${p.avatar}</div><div class="nm">${esc(p.name)}</div><div class="sc">${p.score}</div><div class="block">${n}</div></div>` : '<div></div>';
  const caught = r.history.filter(h => h.correct).length, missed = r.history.length - caught;
  return `
  <div class="panel center">
    <p class="eyebrow">${t('finalTitle')}</p>
    <h1 class="h-display title-2xl" style="margin-top:6px">${t('winner')}: ${esc(p1?.name || '')}</h1>
    <div class="podium">${pod(p2, 'p2', 2)}${pod(p1, 'p1', 1)}${pod(p3, 'p3', 3)}</div>
    <p class="muted small">${t('stats')(caught, missed)}</p>
  </div>
  <div class="panel stack">
    <h2 class="h-display title-xl">${t('scoreboard')}</h2>
    <div data-dyn="board">${boardHtml(false)}</div>
    <div data-dyn="againCtl">${isHost()
      ? `<button class="btn primary block big" data-act="again">${t('again')}</button>`
      : `<p class="status-line">${t('waitAgain')}</p>`}</div>
  </div>
  <div class="center" style="margin-top:14px"><button class="btn ghost" data-act="leave">${t('leave')}</button></div>`;
}

function afterMount() {
  if (!S.room) { const n = $('#name'); if (n && !S.name) setTimeout(() => n.focus({ preventScroll: true }), 50); }
  if (S.room?.phase === 'result' && phaseKey().endsWith('-r')) {
    const o = S.room.outcome; if (o) (o.correct ? sfx.good : sfx.bad)();
  }
  if (S.room?.phase === 'final') confetti();
}

function confetti() {
  const box = document.createElement('div'); box.className = 'confetti';
  const colors = ['#e8b649', '#f6cf6d', '#e0566a', '#7cc3dc', '#74d39b', '#f4e7c8'];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement('i');
    c.style.left = Math.random() * 100 + 'vw'; c.style.background = colors[i % colors.length];
    c.style.animationDuration = 2.2 + Math.random() * 2 + 's'; c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.transform = `rotate(${Math.random() * 360}deg)`; box.appendChild(c);
  }
  document.body.appendChild(box); setTimeout(() => box.remove(), 5200);
}

// ---------------- timers (rAF) ----------------
function loop() {
  const r = S.room;
  if (r && r.deadline && (r.phase === 'roles' || r.phase === 'guess')) {
    const total = r.phase === 'guess' ? 30000 : 20000;
    const left = Math.max(0, r.deadline - now());
    const frac = Math.min(1, left / total);
    const secs = Math.ceil(left / 1000);
    document.querySelectorAll('[data-deadline]').forEach(el => { el.style.transform = `scaleX(${frac})`; el.parentElement.classList.toggle('hot', r.phase === 'guess' && secs <= 10); });
    document.querySelectorAll('[data-secs]').forEach(el => { if (el.textContent !== String(secs)) el.textContent = secs; });
    if (r.phase === 'guess' && secs !== S.lastTickSec) {
      S.lastTickSec = secs;
      if (secs <= 10 && secs > 0) sfx.tick(secs <= 5);
    }
  } else S.lastTickSec = null;
  requestAnimationFrame(loop);
}

// ---------------- events ----------------
function readForm() {
  const n = $('#name'); if (n) S.name = n.value.trim();
  const c = $('#code'); if (c) S.joinCode = c.value.trim().toUpperCase();
}
function doCreate() {
  readForm(); if (!S.name) { toast(t('err').name); $('#name')?.focus(); return; }
  send({ t: 'create', name: S.name, avatar: S.avatar });
}
function doJoin() {
  readForm(); if (!S.name) { toast(t('err').name); $('#name')?.focus(); return; }
  if (!/^[A-Z]{4}$/.test(S.joinCode)) { toast(t('err').code); $('#code')?.focus(); return; }
  send({ t: 'join', code: S.joinCode, name: S.name, avatar: S.avatar });
}
async function doCopy() {
  const url = inviteUrl(S.room.code);
  try {
    if (navigator.share && matchMedia('(pointer:coarse)').matches) { await navigator.share({ title: 'Raja Mantri Chor Sipahi', text: `Room code: ${S.room.code}`, url }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); toast(t('copied')); return; } catch {}
  const el = $('#inviteUrl'); const rng = document.createRange(); rng.selectNodeContents(el);
  const sel = getSelection(); sel.removeAllRanges(); sel.addRange(rng);
  let ok = false; try { ok = document.execCommand('copy'); } catch {}
  toast(ok ? t('copied') : t('copyFail'));
}

document.addEventListener('click', (e) => {
  ac();
  const av = e.target.closest('[data-av]');
  if (av) { readForm(); S.avatar = av.dataset.av; document.querySelectorAll('[data-av]').forEach(b => b.setAttribute('aria-pressed', b.dataset.av === S.avatar)); sfx.tap(); return; }
  const rb = e.target.closest('[data-rounds]');
  if (rb && isHost()) { send({ t: 'rounds', n: +rb.dataset.rounds }); sfx.tap(); return; }
  const g = e.target.closest('[data-guess]');
  if (g && S.room?.phase === 'guess') { document.querySelectorAll('[data-guess]').forEach(b => b.disabled = true); send({ t: 'guess', target: g.dataset.guess }); return; }
  if (e.target.closest('#flip') && S.room?.phase === 'roles') {
    const f = $('#flip');
    if (S.cardOpenRound !== S.room.round) {
      S.cardOpenRound = S.room.round; f.classList.add('open'); sfx.flip(); send({ t: 'peek' });
      setTimeout(render, 50);
    } else { f.classList.toggle('open'); sfx.tap(); }
    return;
  }
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (!act) return;
  if (act !== 'help') sfx.tap();
  switch (act) {
    case 'create': e.preventDefault(); doCreate(); break;
    case 'join': e.preventDefault(); doJoin(); break;
    case 'copy': doCopy(); break;
    case 'start': send({ t: 'start' }); break;
    case 'call': send({ t: 'call' }); break;
    case 'next': send({ t: 'next' }); break;
    case 'again': send({ t: 'again' }); break;
    case 'leave': send({ t: 'leave' }); S.session = null; S.room = null; writeHash(); render(); break;
    case 'help': openHelp(); break;
  }
});
document.addEventListener('submit', (e) => {
  if (e.target.id !== 'homeForm') return; e.preventDefault();
  const invited = S.joinCode && S.joinCode.length === 4 && !$('#code');
  invited ? doJoin() : doCreate();
});
document.addEventListener('input', (e) => {
  if (e.target.id === 'code') { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4); S.joinCode = e.target.value; }
  if (e.target.id === 'name') S.name = e.target.value;
});
document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'code') { e.preventDefault(); doJoin(); } });

$('#btnLang').addEventListener('click', () => { readForm(); S.lang = S.lang === 'hi' ? 'en' : 'hi'; writeHash(); S.mountedKey = ''; render(); if ($('#help').open) openHelp(); setConn(S.wsOpen); });
$('#btnMute').addEventListener('click', (e) => { S.muted = !S.muted; e.currentTarget.setAttribute('aria-pressed', S.muted); e.currentTarget.setAttribute('aria-label', S.muted ? 'Unmute sound' : 'Mute sound'); });
$('#btnHelp').addEventListener('click', openHelp);

function openHelp() {
  const d = $('#help');
  $('#helpBody').innerHTML = `
    <h2 class="h-display title-xl" id="helpTitle">${t('helpTitle')}</h2>
    <div class="role-table">${['raja', 'mantri', 'sipahi', 'chor'].map(r => `<div class="rt" data-role="${r}"><div class="ic">${ICON[r]}</div><div class="rn">${roleName(r)}</div><div class="pt">${POINTS[r]}</div></div>`).join('')}</div>
    <ol class="rules">${t('helpSteps').map((s, i) => `<li><span class="n">${i + 1}</span><span>${s}</span></li>`).join('')}</ol>
    <button class="btn primary block" id="helpClose">${t('close')}</button>`;
  $('#helpClose').onclick = () => d.close();
  if (!d.open) { try { d.showModal(); } catch { d.setAttribute('open', ''); } }
}
$('#help').addEventListener('click', (e) => { if (e.target.id === 'help') e.currentTarget.close(); });

// ---------------- boot ----------------
(function boot() {
  
/* ---------------- room voice chat ---------------- */
const Voice = {
  stream: null,
  peers: new Map(),
  micOn: false,
  speakerOn: true,
  panel: null,
};

function voiceSend(to, signal) {
  send({ t: 'voice-signal', to, signal });
}

function voicePanel() {
  if (Voice.panel) return Voice.panel;

  const panel = document.createElement('div');
  panel.id = 'voicePanel';
  panel.style.cssText = [
    'position:fixed',
    'bottom:12px',
    'left:12px',
    'right:12px',
    'z-index:9999',
    'padding:12px',
    'border-radius:14px',
    'background:#202020',
    'color:white',
    'display:none',
    'gap:8px',
    'align-items:center',
    'justify-content:center',
    'flex-wrap:wrap',
    'box-shadow:0 4px 18px #0005'
  ].join(';');

  panel.innerHTML = `
    <strong style="width:100%;text-align:center">🎙️ Room Voice Chat</strong>
    <button id="voiceMic" type="button">🎤 Mic ON</button>
    <button id="voiceSpeaker" type="button">🔊 Sound ON</button>
    <span id="voiceStatus" style="font-size:12px">Mic चालू करके बात करें</span>
    <div id="voiceAudios" style="display:none"></div>
  `;

  document.body.appendChild(panel);
  Voice.panel = panel;

  $('#voiceMic').addEventListener('click', async () => {
    if (Voice.micOn) {
      Voice.stream?.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      Voice.micOn = false;
      $('#voiceMic').textContent = '🎤 Mic OFF';
      $('#voiceStatus').textContent = 'आपका mic बंद है';
      return;
    }

    try {
      if (!Voice.stream) {
        Voice.stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
      }

      Voice.stream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });

      Voice.micOn = true;
      $('#voiceMic').textContent = '🎤 Mic ON';

      await voiceConnectPeers();
      $('#voiceStatus').textContent = 'Mic चालू है';
    } catch (err) {
      $('#voiceStatus').textContent =
        'Mic permission दें और HTTPS पर खोलें';
    }
  });

  $('#voiceSpeaker').addEventListener('click', () => {
    Voice.speakerOn = !Voice.speakerOn;

    Voice.peers.forEach(peer => {
      if (peer.audio) peer.audio.muted = !Voice.speakerOn;
    });

    $('#voiceSpeaker').textContent =
      Voice.speakerOn ? '🔊 Sound ON' : '🔇 Sound OFF';
  });

  return panel;
}

function voicePeer(id) {
  if (Voice.peers.has(id)) return Voice.peers.get(id);

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  });

  const peer = { pc, audio: null };
  Voice.peers.set(id, peer);

  if (Voice.stream) {
    Voice.stream.getAudioTracks().forEach(track => {
      pc.addTrack(track, Voice.stream);
    });
  }

  pc.onicecandidate = event => {
    if (event.candidate) {
      voiceSend(id, {
        type: 'candidate',
        candidate: event.candidate
      });
    }
  };

  pc.ontrack = event => {
    if (!peer.audio) {
      peer.audio = document.createElement('audio');
      peer.audio.autoplay = true;
      peer.audio.playsInline = true;
      peer.audio.muted = !Voice.speakerOn;
      $('#voiceAudios').appendChild(peer.audio);
    }

    peer.audio.srcObject = event.streams[0];
    peer.audio.play().catch(() => {});
  };

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed') {
      $('#voiceStatus').textContent =
        'Voice connection नहीं हुआ; दोबारा कोशिश करें';
    }
  };

  return peer;
}

async function voiceConnectPeers() {
  if (!S.room || !S.you || !Voice.stream) return;

  const others = S.room.players.filter(p =>
    p.connected && p.id !== S.you
  );

  for (const p of others) {
    const peer = voicePeer(p.id);

    // Only one player creates the offer for each pair.
    if (String(S.you) < String(p.id) &&
        peer.pc.signalingState === 'stable') {
      try {
        const offer = await peer.pc.createOffer();
        await peer.pc.setLocalDescription(offer);
        voiceSend(p.id, {
          type: 'offer',
          sdp: peer.pc.localDescription
        });
      } catch (err) {
        console.error('Voice offer failed:', err);
      }
    }
  }

  // Remove connections for players who left.
  for (const [id, peer] of Voice.peers) {
    if (!others.some(p => p.id === id)) {
      peer.pc.close();
      peer.audio?.remove();
      Voice.peers.delete(id);
    }
  }
}

async function voiceSignal(from, signal) {
  if (!from || !signal || !S.room) return;

  const player = S.room.players.find(p =>
    p.id === from && p.connected
  );
  if (!player || player.id === S.you) return;

  const peer = voicePeer(from);
  const pc = peer.pc;

  try {
    if (signal.type === 'offer') {
      if (!Voice.stream) {
        // The receiver can accept the call after enabling their mic.
        $('#voiceStatus').textContent =
          'बात करने के लिए Mic ON करें';
        return;
      }

      await pc.setRemoteDescription(signal.sdp);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      voiceSend(from, {
        type: 'answer',
        sdp: pc.localDescription
      });
    } else if (signal.type === 'answer') {
      await pc.setRemoteDescription(signal.sdp);
    } else if (signal.type === 'candidate' && signal.candidate) {
      await pc.addIceCandidate(signal.candidate);
    }
  } catch (err) {
    console.error('Voice signal failed:', err);
  }
}
window.voiceSignal = voiceSignal;
function voiceUpdate() {
  const panel = voicePanel();
  const inRoom = !!S.room && S.room.players.length > 1;

  panel.style.display = inRoom ? 'flex' : 'none';

  if (inRoom && Voice.stream) {
    voiceConnectPeers();
  }

  if (!inRoom) {
    Voice.peers.forEach(peer => {
      peer.pc.close();
      peer.audio?.remove();
    });
    Voice.peers.clear();
  }
}

  const h = readHash();
  if (h.lang === 'en') S.lang = 'en';
  if (h.r && h.p) S.session = { code: h.r, pid: h.p };
  if (h.join) S.joinCode = h.join.replace(/[^A-Z]/g, '').slice(0, 4);
  render();
  connect();
  requestAnimationFrame(loop);
})();
