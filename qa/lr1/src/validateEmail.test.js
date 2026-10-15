import { describe, it, expect } from 'vitest';
import { validateEmail } from './validateEmail.js';

describe('validateEmail', () => {
    it('should return true for valid email', () => {
        expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should return true for email with dots and plus', () => {
        expect(validateEmail('first.last+tag@mail.co.uk')).toBe(true);
    });

    it('should return false for email without @', () => {
        expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should return false for email without domain', () => {
        expect(validateEmail('user@')).toBe(false);
    });

    it('should return false for email without zone', () => {
        expect(validateEmail('user@example')).toBe(false);
    });

    it('should return false for email with spaces', () => {
        expect(validateEmail('us er@example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(validateEmail('')).toBe(false);
    });

    it('should return false for non-string', () => {
        expect(validateEmail(null)).toBe(false);
        expect(validateEmail(123)).toBe(false);
    });
});
