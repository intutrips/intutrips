export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

export function formatCurrency(value: any) {
    if (value === undefined || value === null || value === '') return '0';
    // Remove tudo que não for dígito
    const cleanValue = String(value).replace(/\D/g, '');
    const numberValue = Number(cleanValue);
    return isNaN(numberValue) ? '0' : numberValue.toLocaleString('en-US');
}
