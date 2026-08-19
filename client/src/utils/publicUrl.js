export function publicUrl(path) {
  if (!path) return '';
  if (/^(data:|blob:|https?:|mailto:|tel:)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(path).replace(/^\/+/, '');
  return `${base}${clean}`;
}
