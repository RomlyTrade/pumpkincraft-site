/* Animal caps chart: green = on the islands, gold = in Menachem's private zoo (the rest of the cap). */
window.OW2Beasts = function (el, caps) {
  const NAMES = { COW: 'Cows', SHEEP: 'Sheep', PIG: 'Pigs', CHICKEN: 'Chickens', HORSE: 'Horses', CAT: 'Cats', WOLF: 'Wolves', NAUTILUS: 'Nautilus', PARROT: 'Parrots', VILLAGER: 'Villagers' };
  const FREE = { PIG: true };   // Menachem keeps none of these: they breed freely up to the cap
  const rows = Object.keys(NAMES).filter(k => caps[k]).map(k => {
    const c = caps[k], isl = Math.min(c.count, c.cap), zoo = FREE[k] ? 0 : c.cap - isl;
    return '<div class="beast"><span>' + NAMES[k] + '</span><span class="bar"><i style="width:' + (isl / c.cap * 100) + '%"></i><b style="width:' + (zoo / c.cap * 100) + '%"></b></span><span class="n">' + (FREE[k] ? isl + '/' + c.cap : isl + ' + ' + zoo) + '</span></div>';
  }).join('');
  el.innerHTML = rows ? rows + '<div class="beast-key"><span><i></i>On the islands</span><span><b></b>Menachem\'s zoo</span><span><u></u>Room to breed</span></div>' : '<div class="when">Opening soon.</div>';
};
