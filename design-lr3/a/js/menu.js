// Мобильное меню: открытие/закрытие с плавным переходом (Задание 3)
const burger = document.querySelector('.burger');
const menu = document.getElementById('mobile-menu');
const closeBtn = menu.querySelector('.mobile-menu__close');

function openMenu() {
    menu.classList.add('is-open');
    menu.removeAttribute('inert');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeBtn.focus();
}

function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
}

burger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', () => {
    closeMenu();
    burger.focus();
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
    }
});
