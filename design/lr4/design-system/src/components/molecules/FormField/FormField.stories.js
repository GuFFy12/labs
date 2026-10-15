import { createFormField } from './FormField';
import './FormField.css';

export default {
    title: 'Molecules/FormField',
    tags: ['autodocs'],
    argTypes: {
        type: { control: { type: 'select' }, options: ['text', 'email', 'password'] },
        required: { control: 'boolean' },
    },
    render: (args) => createFormField(args),
};

export const Default = { args: { label: 'Имя', placeholder: 'Анна' } };
export const Required = { args: { label: 'Email', type: 'email', placeholder: 'you@example.com', required: true } };
export const WithHelper = { args: { label: 'Пароль', type: 'password', helper: 'Не меньше 8 символов' } };
export const WithError = { args: { label: 'Email', type: 'email', placeholder: 'you@example.com', required: true, error: 'Введите корректный email' } };
