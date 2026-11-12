/* Old-school (Alpha/Beta) procedural water background */
(function () {
  const cv = document.getElementById('water');
  if (!cv) return;
  const S = 16, PX = 5;
  let cur = new Float32Array(S * S), nxt = new Float32Array(S * S);
  const heat = new Float32Array(S * S), heatA = new Float32Array(S * S);
  const tile = document.createElement('canvas'); tile.width = tile.height = S;
  const tctx = tile.getContext('2d'); const img = tctx.createImageData(S, S);
  const ctx = cv.getContext('2d');
  function resize() {
    cv.width = Math.ceil(innerWidth / PX); cv.height = Math.ceil(innerHeight / PX);
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
  }
  addEventListener('resize', resize); resize();
  function step() {
    for (let x = 0; x < S; x++) for (let y = 0; y < S; y++) {
      let sum = 0;
      for (let dx = x - 1; dx <= x + 1; dx++) sum += cur[(dx & 15) + (y & 15) * S];
      nxt[x + y * S] = sum / 3.3 + heat[x + y * S] * 0.8;
    }
    for (let i = 0; i < S * S; i++) {
      heat[i] += heatA[i] * 0.05;
      if (heat[i] < 0) heat[i] = 0;
      heatA[i] -= 0.1;
      if (Math.random() < 0.05) heatA[i] = 0.5;
    }
    const t = cur; cur = nxt; nxt = t;
    for (let i = 0; i < S * S; i++) {
      let f = cur[i]; if (f > 1) f = 1; if (f < 0) f = 0; f *= f;
      const k = i * 4;
      img.data[k] = 32 + f * 32; img.data[k + 1] = 50 + f * 64; img.data[k + 2] = 255; img.data[k + 3] = 146 + f * 50;
    }
    tctx.putImageData(img, 0, 0);
    ctx.fillStyle = '#0b2a6b'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = ctx.createPattern(tile, 'repeat'); ctx.fillRect(0, 0, cv.width, cv.height);
  }
  for (let i = 0; i < 40; i++) step();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(step, 50);
})();

/* Copy-to-clipboard buttons */
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  const msg = document.getElementById('copied');
  try { await navigator.clipboard.writeText(b.dataset.copy); if (msg) msg.textContent = 'COPIED!'; }
  catch (e) { if (msg) msg.textContent = b.dataset.copy; }
  clearTimeout(window.__ct); window.__ct = setTimeout(() => { if (msg) msg.textContent = ''; }, 1800);
}));

/* Screenshot lightbox */
(function () {
  const box = document.querySelector('.lightbox');
  if (!box) return;
  const big = box.querySelector('img');
  document.querySelectorAll('.gallery a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); big.src = a.href; big.alt = a.querySelector('img').alt; box.classList.add('open');
  }));
  box.addEventListener('click', () => box.classList.remove('open'));
  addEventListener('keydown', e => { if (e.key === 'Escape') box.classList.remove('open'); });
})();

/* Live data (written by the server every few minutes) */
window.OW2 = {
  fmt: n => Number(n).toLocaleString('en-GB'),
  esc: s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
  live: () => fetch('/data/live.json', { cache: 'no-store' }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
  board(id, rows, unit) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!rows || !rows.length) { el.innerHTML = '<li class="empty">No entries yet</li>'; return; }
    el.innerHTML = rows.map(r => '<li><span class="who">' + OW2.esc(r.label ? r.label + ' — ' + r.name : r.name)
      + '</span><span class="val">' + OW2.fmt(r.value) + (unit ? ' ' + unit : '') + '</span></li>').join('');
  },
  stamp(d) {
    const el = document.getElementById('updated');
    if (!el || !d.updated) return;
    const mins = Math.max(0, Math.round((Date.now() - Date.parse(d.updated)) / 60000));
    el.textContent = 'Updated ' + (mins < 1 ? 'just now' : mins + ' min ago');
  },
  online(d) {
    const el = document.getElementById('online');
    if (!el) return;
    el.innerHTML = d.online && d.online.length
      ? d.online.map(n => '<span>' + OW2.esc(n) + '</span>').join('')
      : '<span style="border-color:var(--muted);background:none">Nobody right now</span>';
  }
};
