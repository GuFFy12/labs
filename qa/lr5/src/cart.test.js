import { describe, it, expect } from 'vitest';
import { calculateTotal, applyDiscount } from './cart.js';

describe('calculateTotal', () => {
    it('should return 0 for empty array', () => {
        expect(calculateTotal([])).toBe(0);
    });

    it('should sum prices correctly', () => {
        const items = [
            { price: 100, quantity: 2 },
            { price: 50, quantity: 1 },
        ];
        expect(calculateTotal(items)).toBe(250);
    });

    it('should throw error for non-array', () => {
        expect(() => calculateTotal('invalid')).toThrow('Items must be an array');
    });

    it('should throw error for negative price', () => {
        const items = [{ price: -10 }];
        expect(() => calculateTotal(items)).toThrow('Invalid price');
    });
});

describe('applyDiscount', () => {
    it('should apply 10% discount', () => {
        expect(applyDiscount(100, 10)).toBe(90);
    });

    it('should throw error for discount > 100', () => {
        expect(() => applyDiscount(100, 150)).toThrow('Discount must be between 0 and 100');
    });
});
