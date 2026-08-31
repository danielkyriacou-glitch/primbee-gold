export const KEY = 'primbee-gold:state';
export const SCHEMA_VERSION = 2;
const featureDefaults = () => ({ active: false, total: 0, played: 0, remaining: 0, paused: false });
export const defaults = () => ({ version: SCHEMA_VERSION, credits: 0, sound: true, settings: { volume: 0.65, reducedMotion: false, startingCredits: 20 }, feature: featureDefaults(), lastWin: 0, pendingOutcome: null });
const uint = value => Number.isInteger(value) && value >= 0;
const validFeature = value => value && typeof value.active === 'boolean' && uint(value.total) && uint(value.played) && uint(value.remaining) && typeof value.paused === 'boolean' && value.played <= value.total && value.remaining <= value.total && value.total <= 18;
const validGrid = grid => Array.isArray(grid) && grid.length === 5 && grid.every(reel => Array.isArray(reel) && reel.length === 3 && reel.every(symbol => typeof symbol === 'string'));
const validOutcome = value => value === null || (value && validGrid(value.grid) && uint(value.payout) && typeof value.free === 'boolean' && typeof value.trigger === 'boolean' && Array.isArray(value.lines) && uint(value.credits));
export function validate(value) {
  const settings = value?.settings;
  if (!value || value.version !== SCHEMA_VERSION || !uint(value.credits) || typeof value.sound !== 'boolean' || !validFeature(value.feature) || !uint(value.lastWin) || !validOutcome(value.pendingOutcome) || !settings || typeof settings.reducedMotion !== 'boolean' || !Number.isFinite(settings.volume) || settings.volume < 0 || settings.volume > 1 || ![10, 20, 50].includes(settings.startingCredits)) return null;
  return { version: SCHEMA_VERSION, credits: value.credits, sound: value.sound, settings: { ...settings }, feature: { ...value.feature }, lastWin: value.lastWin, pendingOutcome: value.pendingOutcome ? structuredClone(value.pendingOutcome) : null };
}
export function load(storage = localStorage) { try { return validate(JSON.parse(storage.getItem(KEY))) || defaults(); } catch { return defaults(); } }
export function save(value, storage = localStorage) { const record = validate({ ...value, version: SCHEMA_VERSION }); if (!record) throw Error('Refusing to save invalid Primbee Gold state'); storage.setItem(KEY, JSON.stringify(record)); return record; }
export function reset(storage = localStorage) { storage.removeItem(KEY); return defaults(); }
export function addCredits(state, amount) { if (![10, 20, 50].includes(amount)) throw Error('Invalid refill'); state.credits += amount; return state; }
