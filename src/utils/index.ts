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
