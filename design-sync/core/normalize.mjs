// Value normalization, so equal-but-differently-written values do not read as a
// false MISMATCH. Every normalization here is explicit and reversible in intent;
// the raw value stays available via provenance `detail`.

/** Normalize a hex color: lowercase, expand #abc → #aabbcc. Returns input if not hex. */
export function normHex(v) {
  if (typeof v !== "string") return v;
  const s = v.trim().toLowerCase();
  const m3 = /^#([0-9a-f]{3})$/.exec(s);
  if (m3) return "#" + m3[1].split("").map((c) => c + c).join("");
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  return s;
}

/** Normalize a length: "4px" | "4" | 4 → "4px". rem/em kept as-is. */
export function normLength(v) {
  if (v == null) return v;
  if (typeof v === "number") return `${v}px`;
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return `${s}px`;
  return s;
}

/** Normalize a typography descriptor into a canonical comparable string. */
export function normType(t) {
  if (t == null) return t;
  if (typeof t === "string") return t.trim();
  // { family, weight, size, lineHeight, letterSpacing }
  const parts = [];
  if (t.family) parts.push(String(t.family).trim());
  if (t.weight != null) parts.push(`w${t.weight}`);
  if (t.size != null) parts.push(`${t.size}px`);
  if (t.lineHeight != null) parts.push(`lh${t.lineHeight}`);
  return parts.join(" / ");
}

/** Lowercase + sort a string array into a canonical set. */
export function normSet(a) {
  if (!Array.isArray(a)) return a;
  return [...new Set(a.map((x) => String(x).toLowerCase()))].sort();
}
