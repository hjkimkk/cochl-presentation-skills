() => {
  const hex = (c) => {
    const m = c && c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m || (m[4] !== undefined && Number(m[4]) === 0)) return null;
    return '#' + [m[1], m[2], m[3]].map(n => Number(n).toString(16).padStart(2, '0')).join('');
  };
  const fonts = {}, colors = {};
  const bump = (o, k) => { if (k) o[k] = (o[k] || 0) + 1; };
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      bump(fonts, cs.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, ''));
      bump(colors, hex(cs.color));
    }
    bump(colors, hex(cs.backgroundColor));
    if (parseFloat(cs.borderTopWidth) > 0) bump(colors, hex(cs.borderTopColor));
  }
  const logos = [...document.querySelectorAll('img')]
    .filter(i => /logo/i.test(i.className + ' ' + i.src + ' ' + i.alt))
    .map(i => {
      const r = i.getBoundingClientRect();
      const natural = i.naturalWidth / (i.naturalHeight || 1), rendered = r.width / (r.height || 1);
      return { src: i.src.slice(0, 80), distortion: natural ? Math.abs(rendered / natural - 1) : 0 };
    });
  const slides = [...document.querySelectorAll('section.slide, .slide, .pg, .page')];
  const first = slides[0] ? slides[0].getBoundingClientRect() : { width: innerWidth, height: innerHeight };
  return {
    fonts, colors, logos,
    canvas: [Math.round(first.width), Math.round(first.height)],
    layouts: slides.map(s => s.dataset.layout || s.className),
  };
}
