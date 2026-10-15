import { createTable } from './Table';
import './Table.css';

const columns = [
    { key: 'course', label: 'Курс' },
    { key: 'start', label: 'Старт' },
    { key: 'price', label: 'Стоимость' },
    { key: 'status', label: 'Статус', badge: true },
];

const rows = [
    { course: 'Frontend-разработчик', start: '14 октября', price: '6 900 ₽/мес', status: { label: 'Набор открыт', variant: 'success' } },
    { course: 'Python-разработчик', start: '21 октября', price: '7 400 ₽/мес', status: { label: 'Осталось 3 места', variant: 'warning' } },
    { course: 'Веб-дизайнер', start: '4 ноября', price: '5 900 ₽/мес', status: { label: 'Скоро', variant: 'info' } },
    { course: 'UX-исследователь', start: '—', price: '5 400 ₽/мес', status: { label: 'Набор закрыт', variant: 'error' } },
];

export default {
    title: 'Organisms/Table',
    tags: ['autodocs'],
    argTypes: { striped: { control: 'boolean' } },
    render: (args) => createTable(args),
};

export const Default = { args: { caption: 'Ближайшие потоки', columns, rows } };
export const Striped = { args: { caption: 'Ближайшие потоки', columns, rows, striped: true } };
