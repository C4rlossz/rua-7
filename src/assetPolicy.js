const extraOrigins = (import.meta.env?.VITE_TRUSTED_ASSET_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const trusted = new Set(extraOrigins.filter(value => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password && u.origin === value; } catch { return false; } }));

export function isTrustedAsset(value, kind = 'image') {
  if (typeof value !== 'string' || !value || value.length > 2048) return false;
  if (value.startsWith('/')) {
    if (value.includes('..') || value.includes('//') || value.includes('\\')) return false;
    return kind === 'model' ? /^\/models\/[a-zA-Z0-9_-]+\.glb$/.test(value) : /^\/images\/[a-zA-Z0-9._/-]+\.(png|jpe?g|webp|avif|svg)$/.test(value);
  }
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && !u.username && !u.password && trusted.has(u.origin)
      && (kind !== 'model' || /\.glb$/i.test(u.pathname));
  } catch { return false; }
}
