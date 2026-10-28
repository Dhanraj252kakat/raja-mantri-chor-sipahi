// Raja Mantri Chor Sipahi — authoritative real-time game server
// Serves the static frontend from ./public and game traffic over WebSocket at /ws
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 8000;
const PUBLIC = __dirname

const ROLES = ['raja', 'mantri', 'sipahi', 'chor'];
const POINTS = { raja: 1000, mantri: 800, sipahi: 500, chor: 0 };
const GUESS_MS = 30000;
const ROLE_PEEK_MS = 20000; // auto-advance if Raja doesn't call
const LOBBY_DROP_MS = 45000; // drop disconnected players from lobby
const ROOM_IDLE_MS = 3 * 60 * 60 * 1000;
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const AVATARS = ['🐯', '🦚', '🐘', '🐒', '🐫', '🦜', '🐍', '🐄'];

const rooms = new Map();

// ---------- static file server ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/health') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ ok: true, rooms: rooms.size })); }
  let p = decodeURIComponent(url.pathname);
  if (p === '/' || p === '') p = '/Public/index.html';
  const file = path.normalize(path.join(PUBLIC, p));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(data);
  });
});

// ---------- helpers ----------
function newCode() {
  let c;
  do { c = Array.from({ length: 4 }, () => CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]).join(''); } while (rooms.has(c));
  return c;
}
function newId() { return crypto.randomBytes(9).toString('base64url'); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function cleanName(n) { return String(n || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 16); }
function send(ws, msg) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg)); }

function createRoom(hostPlayer) {
  const room = {
    code: newCode(),
    hostId: hostPlayer.id,
    players: [hostPlayer],
    phase: 'lobby', // lobby | roles | guess | result | final
    totalRounds: 5,
    round: 0,
    roles: {},
    peeked: new Set(),
    guess: null,
    guesses: {},
    outcome: null,
    deadline: null,
    history: [],
    timer: null,
    touched: Date.now(),
  };
  rooms.set(room.code, room);
  return room;
}

function makePlayer(name, avatar, ws) {
  return { id: newId(), name, avatar: AVATARS.includes(avatar) ? avatar : AVATARS[0], score: 0, ws, connected: true, dropTimer: null, lastPoints: 0 };
}

function publicState(room, viewerId) {
  const reveal = room.phase === 'result' || room.phase === 'final';
  const players = room.players.map(p => {
    const role = room.roles[p.id];
    let visibleRole = null;
    if (role) {
      if (reveal || p.id === viewerId || role === 'raja' || role === 'mantri') visibleRole = role;
    }
    return { id: p.id, name: p.name, avatar: p.avatar, score: p.score, connected: p.connected, role: visibleRole, lastPoints: reveal ? p.lastPoints : null, peeked: room.peeked.has(p.id) };
  });
  return {
    code: room.code, hostId: room.hostId, phase: room.phase, totalRounds: room.totalRounds, round: room.round,
    players, guess: room.guess, outcome: reveal ? room.outcome : null, deadline: room.deadline, serverNow: Date.now(),
    history: room.history,
  };
}

function broadcast(room) {
  room.touched = Date.now();
  for (const p of room.players) send(p.ws, { t: 'state', you: p.id, room: publicState(room, p.id) });
}

function clearTimer(room) { if (room.timer) { clearTimeout(room.timer); room.timer = null; } }

function startRound(room) {
  clearTimer(room);
  room.round += 1;
  const roles = shuffle(ROLES);
  room.roles = {};
  room.players.forEach((p, i) => { room.roles[p.id] = roles[i]; p.lastPoints = 0; });
  room.peeked = new Set();
  room.guess = null;
  room.guesses = {};
  room.outcome = null;
  room.phase = 'roles';
  room.deadline = Date.now() + ROLE_PEEK_MS;
  room.timer = setTimeout(() => startGuess(room), ROLE_PEEK_MS);
  broadcast(room);
}

function startGuess(room) {
  if (room.phase !== 'roles') return;
  clearTimer(room);
  room.phase = 'guess';
  room.deadline = Date.now() + GUESS_MS;
  room.timer = setTimeout(() => resolveGuesses(room), GUESS_MS);
  broadcast(room);
}

function idByRole(room, role) {
  return Object.keys(room.roles).find(
    id => room.roles[id] === role
  );
}


  function resolveGuesses(room) {
  if (room.phase !== 'guess') return;

  clearTimer(room);

  const chorId = idByRole(room, 'chor');
  const mantriId = idByRole(room, 'mantri');
  const votes = Object.values(room.guesses);

  const counts = {};
  for (const targetId of votes) {
    counts[targetId] = (counts[targetId] || 0) + 1;
  }

  const maxVotes = Math.max(0, ...Object.values(counts));
  const leaders = Object.keys(counts).filter(
    id => counts[id] === maxVotes
  );

  const guessedId =
    leaders.length === 1 ? leaders[0] : null;

  const correct = guessedId === chorId;

  room.guess = guessedId;

  for (const p of room.players) {
    const role = room.roles[p.id];
    let pts = POINTS[role];

    if (!correct && role === 'mantri') pts = 0;
    if (!correct && role === 'chor') pts = POINTS.mantri;

    p.lastPoints = pts;
    p.score += pts;
  }

  room.outcome = {
    correct,
    timedOut: votes.length === 0,
    chorId,
    mantriId,
    guessedId,
    guesses: { ...room.guesses }
  };

  room.history.push({
    round: room.round,
    correct,
    timedOut: votes.length === 0
  });

  room.phase = 'result';
  room.deadline = null;
  broadcast(room);
}

function nextOrFinish(room) {
  if (room.phase !== 'result') return;
  if (room.round >= room.totalRounds) {
    room.phase = 'final';
    room.deadline = null;
    broadcast(room);
  } else startRound(room);
}

function resetToLobby(room) {
  clearTimer(room);
  room.phase = 'lobby';
  room.round = 0;
  room.roles = {};
  room.peeked = new Set();
  room.guess = null; room.outcome = null; room.deadline = null; room.history = [];
  room.players = room.players.filter(p => p.connected);
  room.players.forEach(p => { p.score = 0; p.lastPoints = 0; });
  if (!room.players.find(p => p.id === room.hostId) && room.players[0]) room.hostId = room.players[0].id;
  broadcast(room);
}

function removePlayer(room, playerId) {
  room.players = room.players.filter(p => p.id !== playerId);
  if (room.players.length === 0) { clearTimer(room); rooms.delete(room.code); return; }
  if (room.hostId === playerId) {
    const next = room.players.find(p => p.connected) || room.players[0];
    room.hostId = next.id;
  }
  broadcast(room);
}

function ensureHost(room) {
  const host = room.players.find(p => p.id === room.hostId);
  if (host && host.connected) return;
  const next = room.players.find(p => p.connected);
  if (next) room.hostId = next.id;
}

// ---------- websocket ----------

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  console.log('WS upgrade request:', req.url);

  const url = new URL(req.url, 'http://x');

  if (!url.pathname.endsWith('/ws')) {
    console.log('Rejected WebSocket path:', url.pathname);
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, ws =>
    wss.emit('connection', ws, req)
  );
});



wss.on('connection', ws => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });
  ws.ctx = { room: null, player: null };

  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m.t !== 'string') return;
    const err = (code) => send(ws, { t: 'error', code });
    const ctx = ws.ctx;

    if (m.t === 'ping') return send(ws, { t: 'pong', serverNow: Date.now(), c: m.c });

    if (m.t === 'create') {
      const name = cleanName(m.name); if (!name) return err('name');
      const p = makePlayer(name, m.avatar, ws);
      const room = createRoom(p);
      ctx.room = room; ctx.player = p;
      return broadcast(room);
    }

    if (m.t === 'join' || m.t === 'resume') {
      const code = String(m.code || '').toUpperCase().trim();
      const room = rooms.get(code); if (!room) return err('noroom');
      // resume an existing seat by player id (refresh / reconnect)
      let p = m.pid ? room.players.find(x => x.id === m.pid) : null;
      if (!p && m.t === 'join') {
        const name = cleanName(m.name); if (!name) return err('name');
        // allow reclaiming a disconnected seat with the same name
        p = room.players.find(x => !x.connected && x.name.toLowerCase() === name.toLowerCase());
        if (!p) {
          if (room.phase !== 'lobby') return err('started');
          if (room.players.length >= 4) return err('full');
          if (room.players.some(x => x.name.toLowerCase() === name.toLowerCase())) return err('nametaken');
          let av = AVATARS.includes(m.avatar) ? m.avatar : AVATARS[0];
          if (room.players.some(x => x.avatar === av)) av = AVATARS.find(a => !room.players.some(x => x.avatar === a)) || av;
          p = makePlayer(name, av, ws);
          room.players.push(p);
        }
      }
      if (!p) return err('noseat');
      if (p.ws && p.ws !== ws) { try { p.ws.ctx = { room: null, player: null }; p.ws.close(4000, 'replaced'); } catch {} }
      p.ws = ws; p.connected = true;
      if (p.dropTimer) { clearTimeout(p.dropTimer); p.dropTimer = null; }
      ctx.room = room; ctx.player = p;
      ensureHost(room);
      return broadcast(room);
    }

    const room = ctx.room, me = ctx.player;
    if (!room || !me || !rooms.has(room.code)) return err('noroom');
    const isHost = room.hostId === me.id;

    switch (m.t) {

  case 'voice-signal': {
  const targetId = String(m.to || '');
  const target = room.players.find(
    p => p.id === targetId && p.connected
  );

  if (!target || target.id === me.id) return;

  if (!m.signal || typeof m.signal !== 'object') return;

  send(target.ws, {
    t: 'voice-signal',
    from: me.id,
    signal: m.signal
  });

  return;
}
        
      case 'chat-message': {
        const text = String(m.text || '').trim().slice(0, 500);
        if (!text) return;

        const message = {
          t: 'chat-message',
          from: me.id,
          name: me.name,
          text,
          time: Date.now()
        };

        for (const player of room.players) {
          if (player.connected) {
            send(player.ws, message);
          }
        }
        return;
      }

      case 'rounds':
        if (!isHost || room.phase !== 'lobby') return;
        if ([5, 10, 15].includes(m.n)) { room.totalRounds = m.n; broadcast(room); }
        return;
      case 'start':
        if (!isHost || room.phase !== 'lobby') return;
        if (room.players.length !== 4) return err('need4');
        if (room.players.some(p => !p.connected)) return err('offline');
        room.players.forEach(p => { p.score = 0; });
        room.round = 0; room.history = [];
        return startRound(room);
      case 'peek':
        if (room.phase !== 'roles') return;
        room.peeked.add(me.id); return broadcast(room);
      case 'call':
        if (room.phase !== 'roles' || room.roles[me.id] !== 'raja') return;
        return startGuess(room);
      case 'guess': {
  if (room.phase !== 'guess') return;
  if (room.guesses[me.id]) return;

  const target = room.players.find(
    p => p.id === m.target
  );

  if (!target || target.id === me.id) return;

  room.guesses[me.id] = target.id;
  broadcast(room);
  return;
}
      case 'next':
        if (!isHost) return;
        return nextOrFinish(room);
      case 'again':
        if (!isHost || room.phase !== 'final') return;
        return resetToLobby(room);
      case 'leave':
        ctx.room = null; ctx.player = null;
        if (room.phase === 'lobby' || room.phase === 'final') removePlayer(room, me.id);
        else { me.connected = false; me.ws = null; ensureHost(room); broadcast(room); }
        return send(ws, { t: 'left' });
    }
  });

  ws.on('close', () => {
    const { room, player } = ws.ctx;
    if (!room || !player || player.ws !== ws) return;
    player.connected = false; player.ws = null;
    ensureHost(room);
    if (room.phase === 'lobby') {
      player.dropTimer = setTimeout(() => { if (!player.connected && rooms.has(room.code) && room.phase === 'lobby') removePlayer(room, player.id); }, LOBBY_DROP_MS);
    }
    if (rooms.has(room.code)) broadcast(room);
  });
});

setInterval(() => {
  for (const ws of wss.clients) { if (!ws.isAlive) { ws.terminate(); continue; } ws.isAlive = false; try { ws.ping(); } catch {} }
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.touched > ROOM_IDLE_MS && !room.players.some(p => p.connected)) { clearTimer(room); rooms.delete(code); }
  }
}, 15000);

server.listen(PORT, '0.0.0.0', () => console.log(`RMCS server on :${PORT}`));
