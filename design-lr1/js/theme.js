// Задание 1. Тёмная тема на CSS-переменных
const STORAGE_KEY = 'theme';
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');

// Сохранённый выбор пользователя применяем сразу (скрипт подключён в <head>)
const saved = localStorage.getItem(STORAGE_KEY);
if (saved) root.setAttribute('data-theme', saved);

// Текущая тема: выбор пользователя или системная
function currentTheme() {
    return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
}

function updateToggle() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        btn.setAttribute('aria-pressed', currentTheme() === 'dark');
    });
}

// Переключение без перезагрузки страницы
document.addEventListener('click', e => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    updateToggle();
});

document.addEventListener('DOMContentLoaded', updateToggle);
media.addEventListener('change', updateToggle);
