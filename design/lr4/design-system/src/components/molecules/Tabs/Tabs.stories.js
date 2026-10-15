import { createTabs } from './Tabs';
import './Tabs.css';

const tabs = [
    { label: 'О курсе', content: '8 месяцев, 10 часов в неделю, наставник и 5 проектов в портфолио.' },
    { label: 'Программа', content: 'HTML и CSS, JavaScript, инструменты, React, дипломный проект.' },
    { label: 'Отзывы', content: '«Через восемь месяцев вышла джуном во фронтенд» — Анна Смирнова.' },
];

export default {
    title: 'Molecules/Tabs',
    tags: ['autodocs'],
    argTypes: {
        active: { control: { type: 'select' }, options: [0, 1, 2] },
    },
    render: (args) => createTabs(args),
};

export const Default = { args: { tabs, active: 0 } };
export const SecondActive = { args: { tabs, active: 1 } };
