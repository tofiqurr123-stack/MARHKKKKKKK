// Tiny localStorage helper with JSON + safe fallbacks
export function loadLS<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode */
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}
