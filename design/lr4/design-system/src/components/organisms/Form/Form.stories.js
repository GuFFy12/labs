import { createForm } from './Form';
import './Form.css';

export default {
    title: 'Organisms/Form',
    tags: ['autodocs'],
    render: (args) => createForm(args),
};

export const Enrollment = {
    args: {
        title: 'Заявка на курс',
        fields: [
            { label: 'Имя', placeholder: 'Анна', required: true },
            { label: 'Email', type: 'email', placeholder: 'you@example.com', required: true },
            { label: 'Телефон', type: 'tel', placeholder: '+7 900 000-00-00', helper: 'Позвоним, чтобы подобрать поток' },
        ],
        submitLabel: 'Записаться',
    },
};

export const WithErrors = {
    args: {
        title: 'Вход',
        fields: [
            { label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, error: 'Введите корректный email' },
            { label: 'Пароль', type: 'password', required: true, error: 'Неверный пароль' },
        ],
        consent: '',
        submitLabel: 'Войти',
    },
};
