import { createBreadcrumbs } from './Breadcrumbs';
import './Breadcrumbs.css';

export default {
    title: 'Molecules/Breadcrumbs',
    tags: ['autodocs'],
    render: (args) => createBreadcrumbs(args),
};

export const TwoLevels = {
    args: { items: [{ label: 'Главная', href: '#' }, { label: 'Курсы' }] },
};

export const ThreeLevels = {
    args: { items: [{ label: 'Главная', href: '#' }, { label: 'Курсы', href: '#' }, { label: 'Frontend-разработчик' }] },
};
