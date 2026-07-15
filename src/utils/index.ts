export function createPageUrl(pageName: string) {
    const route = pageName.toLowerCase().replace(/ /g, '-');
    return route === 'home' ? '/' : '/' + route;
}

export function formatCurrency(value: any) {
    if (value === undefined || value === null || value === '') return '0';
    // Remove tudo que não for dígito
    const cleanValue = String(value).replace(/\D/g, '');
    const numberValue = Number(cleanValue);
    return isNaN(numberValue) ? '0' : numberValue.toLocaleString('en-US');
}

const SPOTS_PER_LOT = 6;

export function getSpotsAvailable(pricing_lots: any[]): number | null {
  if (!pricing_lots || !Array.isArray(pricing_lots) || pricing_lots.length === 0) return null;
  const active = pricing_lots.filter((l: any) => l.active !== false && l.price);
  if (active.length === 0) return null;
  return active.reduce((total: number, lot: any) => {
    return total + Math.max(0, SPOTS_PER_LOT - (lot.spots_filled || 0));
  }, 0);
}

export function generateSlug(text: string) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/[àáãâä]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóõôö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
