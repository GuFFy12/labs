import { createHeader } from './Header';
import './Header.css';

export default {
    title: 'Organisms/Header',
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
    argTypes: {
        active: { control: { type: 'select' }, options: ['Курсы', 'Преподаватели', 'Блог', 'Контакты'] },
    },
    render: (args) => createHeader(args),
};

export const Guest = { args: { active: 'Курсы' } };
export const LoggedIn = { args: { active: 'Блог', user: 'Анна Смирнова' } };
