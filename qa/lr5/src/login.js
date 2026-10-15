import { checkCredentials } from './auth.js';

const form = document.getElementById('login-form');
const error = document.getElementById('login-error');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const result = checkCredentials(data.get('email'), data.get('password'));

    if (!result.ok) {
        error.textContent = result.error;
        error.hidden = false;
        return;
    }

    sessionStorage.setItem('user', data.get('email'));
    window.location.href = '/dashboard';
});
