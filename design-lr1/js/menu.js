// Задание 2. Мобильное меню-бургер
const burger = document.querySelector('.burger');
const menu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.mobile-menu__close');

function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open'); // body { overflow: hidden }
    closeBtn.focus();
}

function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    burger.focus();
}

burger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);

// Закрытие при клике на ссылку
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Закрытие по Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
});
