export const createBreadcrumbs = ({
    items = [],
}) => {
    const nav = document.createElement('nav');
    nav.className = 'breadcrumbs';
    nav.setAttribute('aria-label', 'Хлебные крошки');
    const list = document.createElement('ol');
    list.className = 'breadcrumbs__list';
    items.forEach((item, i) => {
        const li = document.createElement('li');
        li.className = 'breadcrumbs__item';
        if (i === items.length - 1) {
            li.setAttribute('aria-current', 'page');
            li.textContent = item.label;
        } else {
            const a = document.createElement('a');
            a.className = 'breadcrumbs__link';
            a.href = item.href || '#';
            a.textContent = item.label;
            li.append(a);
        }
        list.append(li);
    });
    nav.append(list);
    return nav;
};
