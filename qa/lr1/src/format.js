const SUPPORTED_CURRENCIES = ['RUB', 'USD', 'EUR'];

export const formatCurrency = (amount, currency = 'RUB') => {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        throw new Error('Amount must be a number');
    }
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
        throw new Error('Unsupported currency');
    }

    // заменяем неразрывные пробелы на обычные, чтобы проще сравнивать
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    })
        .format(amount)
        .replace(/\s/g, ' ');
};
