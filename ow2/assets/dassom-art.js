// Pixel art shared by the DASSOM page and the homepage phone: the gorilla logo, Menachem's avatar, a 3x5 font.
window.DASSOM = (function () {
  const mirror = half => half.map(r => r + [...r].reverse().join(''));
  const pal = {
    d: '#0b5fa5', b: '#1d9bf0', N: '#0a3a6b', y: '#4f86b8', f: '#8fd0ff', k: '#0a0d14', w: '#ffffff',
    h: '#3a2617', s: '#e8b98f', g: '#111111', n: '#5a3a22', c: '#15151a', W: '#f2f2f2', z: '#b5e3ff'
  };
  const gorilla = mirror([
    '......dd',
    '....ddbb',
    '...dbbbb',
    '..dbbbbb',
    '.dbbbbbb',
    'dbbddddd',
    'dbdNNNNN',
    'ddNwkNNN',
    'ddNNNNNN',
    '.dNNNyyy',
    '.dNyykyy',
    '.dNyyyyy',
    '..dNyyyy',
    '..dNNkkk',
    '...dNNNN',
    '....dddd'
  ]);
  const menachem = mirror([
    'zzzzzzzz',
    'zzzzkkkk',
    'zzzzkkkk',
    'zzzkkkkk',
    'kkkkkkkk',
    'zhhsssss',
    'zhsggggs',
    'zhsgwkgs',
    'zhsggggs',
    'zhssssss',
    'zhnnnWWW',
    'zhnnnnnn',
    'zznnnnnn',
    'zzcccccW',
    'zcccccccW'.slice(0, 8),
    'zcccccccW'.slice(0, 8)
  ]);
  const font = {
    D: ['110', '101', '101', '101', '110'],
    A: ['010', '101', '111', '101', '101'],
    S: ['011', '100', '010', '001', '110'],
    O: ['010', '101', '101', '101', '010'],
    M: ['101', '111', '111', '101', '101']
  };
  function draw(ctx, rows, x0, y0, scale) {
    scale = scale || 1;
    rows.forEach((r, y) => [...r].forEach((ch, x) => {
      if (ch === '.' || !pal[ch]) return;
      ctx.fillStyle = pal[ch]; ctx.fillRect(x0 + x * scale, y0 + y * scale, scale, scale);
    }));
  }
  function text(ctx, str, x0, y0, color, scale) {
    scale = scale || 1; ctx.fillStyle = color; let x = x0;
    for (const ch of str) {
      const g = font[ch]; if (!g) { x += 4 * scale; continue; }
      g.forEach((r, y) => [...r].forEach((v, i) => { if (v === '1') ctx.fillRect(x + i * scale, y0 + y * scale, scale, scale); }));
      x += 4 * scale;
    }
    return x - x0 - scale;
  }
  function image(rows, scale) {
    const cv = document.createElement('canvas'); cv.width = rows[0].length * scale; cv.height = rows.length * scale;
    draw(cv.getContext('2d'), rows, 0, 0, scale); return cv.toDataURL();
  }
  return { gorilla, menachem, draw, text, image, pal };
})();
