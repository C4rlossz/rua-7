export const STORAGE_KEYS = Object.freeze(['rua7.catalog.v1', 'rua7.cart.v1', 'rua7.favorites.v1']);
export const ORDER_KEY = 'rua7.demo-orders';
export function readStored(storage, key, fallback) {
  try { const raw = storage.getItem(key); if (!raw || raw.length > 512000) return fallback; return JSON.parse(raw) ?? fallback; } catch { return fallback; }
}
export function writeStored(storage, key, value) { try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
export function clearStoreData(local, session) {
  let success = true;
  for (const key of STORAGE_KEYS) { try { local.removeItem(key); } catch { success = false; } }
  try { session.removeItem(ORDER_KEY); } catch { success = false; }
  return success;
}
