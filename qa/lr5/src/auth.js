import { validateEmail } from './validateEmail.js';

// демо-пользователь, бэкенда нет
const DEMO_USER = { email: 'user@example.com', password: 'password123' };

export const checkCredentials = (email, password) => {
    if (!email || !password) {
        return { ok: false, error: 'Заполните email и пароль' };
    }
    if (!validateEmail(email)) {
        return { ok: false, error: 'Некорректный email' };
    }
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
        return { ok: false, error: 'Неверный email или пароль' };
    }
    return { ok: true };
};
