export function parseList(value) {
  try { const data = typeof value === 'string' ? JSON.parse(value) : value; return Array.isArray(data) ? data.filter(item => typeof item === 'string') : []; }
  catch { return []; }
}
export function coordinates(bus) {
  if (bus?.lat == null || bus?.lng == null || bus.lat === '' || bus.lng === '') return null;
  const lat=Number(bus.lat),lng=Number(bus.lng);
  return Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180?[lat,lng]:null;
}
export const formatSeconds = value => Math.floor(value/60)+':'+String(value%60).padStart(2,'0');
