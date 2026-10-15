import { describe, it, expect } from 'vitest';
import { formatCurrency } from './format.js';

describe('formatCurrency', () => {
    it('should format RUB by default', () => {
        expect(formatCurrency(1500)).toBe('1 500,00 ₽');
    });

    it('should format USD', () => {
        expect(formatCurrency(99.9, 'USD')).toBe('99,90 $');
    });

    it('should format EUR', () => {
        expect(formatCurrency(1234567.891, 'EUR')).toBe('1 234 567,89 €');
    });

    it('should format zero', () => {
        expect(formatCurrency(0, 'RUB')).toBe('0,00 ₽');
    });

    it('should format negative amount', () => {
        expect(formatCurrency(-250, 'RUB')).toBe('-250,00 ₽');
    });

    it('should throw error for non-number amount', () => {
        expect(() => formatCurrency('100', 'RUB')).toThrow('Amount must be a number');
    });

    it('should throw error for NaN', () => {
        expect(() => formatCurrency(NaN)).toThrow('Amount must be a number');
    });

    it('should throw error for unsupported currency', () => {
        expect(() => formatCurrency(100, 'BTC')).toThrow('Unsupported currency');
    });
});
