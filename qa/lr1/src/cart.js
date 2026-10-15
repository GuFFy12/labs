export const calculateTotal = (items) => {
    if (!Array.isArray(items)) {
        throw new Error('Items must be an array');
    }

    return items.reduce((total, item) => {
        if (typeof item.price !== 'number' || item.price < 0) {
            throw new Error('Invalid price');
        }
        return total + item.price * (item.quantity || 1);
    }, 0);
};

export const applyDiscount = (total, discountPercent) => {
    if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount must be between 0 and 100');
    }
    return total * (1 - discountPercent / 100);
};
