// local@domain.zone, без пробелов, зона минимум 2 символа
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validateEmail = (email) => {
    if (typeof email !== 'string') {
        return false;
    }
    return EMAIL_REGEX.test(email);
};
