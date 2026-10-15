import { createButton } from '../../atoms/Button/Button';
import { createAvatar } from '../../atoms/Avatar/Avatar';

export const createHeader = ({
    brand = 'EduKit',
    links = ['Курсы', 'Преподаватели', 'Блог', 'Контакты'],
    active = 'Курсы',
    user = null,
}) => {
    const header = document.createElement('header');
    header.className = 'header';
    header.innerHTML = `
        <a class="header__brand" href="#">${brand}</a>
        <nav class="header__nav" aria-label="Основная навигация">
            ${links.map(link => `<a class="header__link" href="#"${link === active ? ' aria-current="page"' : ''}>${link}</a>`).join('')}
        </nav>
        <div class="header__actions"></div>
    `;
    const actions = header.querySelector('.header__actions');
    if (user) {
        actions.append(createAvatar({ name: user, size: 'sm' }));
    } else {
        actions.append(createButton({ variant: 'ghost', size: 'sm', label: 'Войти' }), createButton({ size: 'sm', label: 'Регистрация' }));
    }
    return header;
};
