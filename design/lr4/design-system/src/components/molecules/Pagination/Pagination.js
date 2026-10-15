import { createIcon } from '../../atoms/Icon/Icon';

export const createPagination = ({
    total = 5,
    current = 1,
}) => {
    const nav = document.createElement('nav');
    nav.className = 'pagination';
    nav.setAttribute('aria-label', 'Страницы');
    const list = document.createElement('ul');
    list.className = 'pagination__list';

    const item = (content, page, label, disabled = false) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'pagination__link';
        link.href = `#page-${page}`;
        if (label) link.setAttribute('aria-label', label);
        if (page === current && !label) link.setAttribute('aria-current', 'page');
        if (disabled) {
            // Без href у ссылки нет роли — возвращаем её явно
            link.setAttribute('role', 'link');
            link.setAttribute('aria-disabled', 'true');
            link.removeAttribute('href');
        }
        link.append(content);
        li.append(link);
        return li;
    };

    list.append(item(createIcon({ name: 'chevron-left', size: 20 }), current - 1, 'Предыдущая страница', current === 1));
    for (let page = 1; page <= total; page++) list.append(item(String(page), page));
    list.append(item(createIcon({ name: 'chevron-right', size: 20 }), current + 1, 'Следующая страница', current === total));
    nav.append(list);
    return nav;
};
