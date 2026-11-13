// Spinning pixel phone button (top right), drawn like a dropped item in Minecraft 1.8:
// a flat sprite extruded a couple of pixels thick, turning on its vertical axis and bobbing.
(function () {
  const W = 12, H = 22, D = 2, S = 4;               // sprite size in pixels, depth, screen scale
  const C = {
    o: '#ff7a1a', l: '#ffa452', d: '#c9560e', e: '#e0650f', k: '#121624', s: '#0c1a3a',
    b: '#3f9bff', c: '#9fe3ff', w: '#ffffff', g: '#2a2f3f'
  };
  const front = [
    'lllllllllllo',
    'lo...kk....d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l.....cww..d',
    'l....ccbcw.d',
    'l...cbbbbc.d',
    'l..cbbbbbbcd',
    'l.cbbbbbbbbd',
    'l..........d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l..........d',
    'l...wwww...d',
    'l..........d',
    'oddddddddddd'
  ];
  const back = [
    'lllllllllllo',
    'leeeeeoooood',
    'legkkgoooood',
    'lekwkkoooood',
    'legkkgoooood',
    'leeeeeoooood'
  ];
  while (back.length < H - 1) back.push('looooooooood');
  back.push('oddddddddddd');

  function sprite(rows, fill) {
    const cv = document.createElement('canvas'); cv.width = rows[0].length; cv.height = rows.length;
    const x = cv.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, i) => {
      x.fillStyle = ch === '.' ? fill : C[ch] || fill; x.fillRect(i, y, 1, 1);
    }));
    return cv.toDataURL();
  }
  function strip(w, h, buttons) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const x = cv.getContext('2d'); x.fillStyle = C.e; x.fillRect(0, 0, w, h);
    if (buttons) { x.fillStyle = C.l; x.fillRect(0, 5, w, 3); x.fillRect(0, 10, w, 2); }
    return cv.toDataURL();
  }

  const BOX = 128;   // room for the phone leaning 45 degrees
  // Hover screen: the DASSOM app, drawn at full resolution (1 canvas pixel = 1 screen pixel).
  function appScreen() {
    const cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S;
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false;
    x.fillStyle = C.o; x.fillRect(0, 0, cv.width, cv.height);
    front.forEach((r, y) => [...r].forEach((ch, i) => { if (ch !== '.') { x.fillStyle = C[ch]; x.fillRect(i * S, y * S, S, S); } }));
    const sx = S, sy = 2 * S, sw = 10 * S, sh = 18 * S;          // screen area inside the rim
    x.fillStyle = '#15202b'; x.fillRect(sx, sy, sw, sh);
    x.fillStyle = C.k; x.fillRect(5 * S, S, 2 * S, S);             // notch
    if (window.DASSOM) {
      const D = window.DASSOM, gw = D.gorilla[0].length;
      const tw = 23, total = gw + 1 + tw, x0 = sx + Math.floor((sw - total) / 2);
      D.draw(x, D.gorilla, x0, sy + 2, 1);
      D.text(x, "DASSOM", x0 + gw + 1, sy + 8, '#1d9bf0', 1);
      x.fillStyle = '#2f3d4d'; x.fillRect(sx, sy + 20, sw, 1);
      for (let i = 0; i < 4; i++) {                                // little posts
        const py = sy + 25 + i * 13;
        x.fillStyle = '#b5e3ff'; x.fillRect(sx + 3, py, 6, 6);
        x.fillStyle = '#e7ecf0'; x.fillRect(sx + 12, py, 14, 2);
        x.fillStyle = '#5b6b7a'; x.fillRect(sx + 12, py + 4, 22, 1); x.fillRect(sx + 12, py + 7, 18, 1);
      }
    }
    return cv.toDataURL();
  }

  const css = `
  .phone-btn{position:fixed;top:6px;right:10px;z-index:20;width:${BOX}px;height:${BOX + 14}px;
    display:block;perspective:600px;text-decoration:none;pointer-events:none}
  .phone-btn .bob{position:absolute;left:${(BOX - W * S) / 2}px;top:${(BOX - H * S) / 2}px;width:${W * S}px;height:${H * S}px;
    transform-style:preserve-3d;animation:phone-bob 2.6s ease-in-out infinite}
  .phone-btn .tilt{position:absolute;inset:0;transform-style:preserve-3d;transform:rotate(45deg);transition:transform .18s ease-out}
  .phone-btn .spin{position:absolute;inset:0;transform-style:preserve-3d;animation:phone-spin 3.2s linear infinite}
  .phone-btn .f{position:absolute;left:50%;top:50%;background-size:100% 100%;image-rendering:pixelated;backface-visibility:hidden;
    pointer-events:auto;cursor:pointer}
  .phone-btn .shadow{position:absolute;left:50%;bottom:4px;width:64px;height:9px;margin-left:-32px;
    background:rgba(0,0,30,.45);border-radius:50%}
  .phone-btn:has(.f:hover) .tilt{transform:rotate(45deg) scale(1.25)}
  .phone-btn:has(.f:hover) .f.front,.phone-btn:focus-visible .f.front{background-image:var(--app)!important}
  .phone-btn:focus-visible .tilt{transform:rotate(45deg) scale(1.25)}
  .phone-btn:focus-visible{outline:none}
  @keyframes phone-spin{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
  @keyframes phone-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @media (prefers-reduced-motion:reduce){.phone-btn .spin,.phone-btn .bob{animation:none}
    .phone-btn .spin{transform:rotateY(-25deg)}}
  @media (max-width:600px){.phone-btn{top:2px;right:0;transform:scale(.7);transform-origin:top right}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const a = document.createElement('a');
  a.className = 'phone-btn';
  a.href = document.currentScript && document.currentScript.dataset.href || '#';
  a.setAttribute('aria-label', document.currentScript && document.currentScript.dataset.label || 'Phone');
  a.innerHTML = '<div class="shadow"></div><div class="bob"><div class="tilt"><div class="spin"></div></div></div>';
  const spin = a.querySelector('.spin');
  const w = W * S, h = H * S, d = D * S;
  const faces = [
    [w, h, sprite(front, C.s), `translateZ(${d / 2}px)`],
    [w, h, sprite(back, C.o), `rotateY(180deg) translateZ(${d / 2}px)`],
    [d, h, strip(D, H, false), `rotateY(-90deg) translateZ(${w / 2}px)`],
    [d, h, strip(D, H, true), `rotateY(90deg) translateZ(${w / 2}px)`],
    [w, d, strip(W, D, false), `rotateX(90deg) translateZ(${h / 2}px)`],
    [w, d, strip(W, D, false), `rotateX(-90deg) translateZ(${h / 2}px)`]
  ];
  faces.forEach(([fw, fh, img, tf], i) => {
    const f = document.createElement('div'); f.className = i === 0 ? 'f front' : 'f';
    f.style.cssText = `width:${fw}px;height:${fh}px;margin:${-fh / 2}px 0 0 ${-fw / 2}px;background-image:url(${img});transform:${tf}`;
    if (i === 0) f.style.setProperty('--app', `url(${appScreen()})`);
    spin.appendChild(f);
  });
  document.body.appendChild(a);
})();
