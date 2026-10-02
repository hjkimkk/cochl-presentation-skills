import { test } from 'node:test';
import assert from 'node:assert/strict';
import { themeVars, rewrite } from '../hex-to-var.mjs';

const theme = '# t\n```css\n:root {\n  --bg: #0B0B12;\n  --text: #fff;\n  --accent: #4B68FF;\n  --link: #4b68ff;\n}\n```\n';

test('themeVars normalises case and 3-digit hex; first name wins', () => {
  const v = themeVars(theme);
  assert.equal(v.get('#0b0b12'), '--bg');
  assert.equal(v.get('#ffffff'), '--text');
  assert.equal(v.get('#4b68ff'), '--accent');
});

test('rewrite replaces hex only inside fenced code', () => {
  const src = 'Prose #4B68FF stays.\n```html\n<div style="color:#4B68FF;background:#FFF">\n```\n';
  const r = rewrite(src, themeVars(theme));
  assert.equal(r.replaced, 2);
  assert.match(r.text, /color:var\(--accent\);background:var\(--text\)/);
  assert.match(r.text, /Prose #4B68FF stays/);
});

test('rewrite reports unmapped hex and leaves it', () => {
  const r = rewrite('```css\na{color:#123456}\n```', themeVars(theme));
  assert.deepEqual(r.unmapped, ['#123456']);
  assert.match(r.text, /#123456/);
});
