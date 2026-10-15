import { describe, it, expect } from 'vitest';
import { checkCredentials } from './auth.js';

describe('checkCredentials', () => {
    it('should accept demo user', () => {
        expect(checkCredentials('user@example.com', 'password123')).toEqual({ ok: true });
    });

    it('should reject empty fields', () => {
        expect(checkCredentials('', '')).toEqual({ ok: false, error: 'Заполните email и пароль' });
    });

    it('should reject invalid email', () => {
        expect(checkCredentials('user', '123').error).toBe('Некорректный email');
    });

    it('should reject wrong password', () => {
        expect(checkCredentials('user@example.com', 'wrong').error).toBe(
            'Неверный email или пароль',
        );
    });

    it('should reject unknown user', () => {
        expect(checkCredentials('wrong@example.com', 'wrongpass').error).toBe(
            'Неверный email или пароль',
        );
    });
});
