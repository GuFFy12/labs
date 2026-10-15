import { createFooter } from './Footer';
import './Footer.css';

export default {
    title: 'Organisms/Footer',
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
    render: (args) => createFooter(args),
};

export const Default = {
    args: {
        columns: [
            { title: 'Обучение', links: ['Все курсы', 'Преподаватели', 'Корпоративным клиентам'] },
            { title: 'Школа', links: ['Блог', 'Контакты', 'Вакансии'] },
            { title: 'Соцсети', links: ['Telegram', 'ВКонтакте', 'YouTube'] },
        ],
    },
};

export const Minimal = { args: { columns: [], copyright: '© 2026 EduKit. Все права защищены.' } };
