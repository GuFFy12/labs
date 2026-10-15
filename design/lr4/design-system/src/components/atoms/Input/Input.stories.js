import { createInput } from './Input';
import './Input.css';

export default {
    title: 'Atoms/Input',
    tags: ['autodocs'],
    argTypes: {
        type: { control: { type: 'select' }, options: ['text', 'email', 'password'] },
        disabled: { control: 'boolean' },
        invalid: { control: 'boolean' },
    },
    render: (args) => createInput(args),
};

export const Text = { args: { type: 'text', placeholder: 'Ваше имя', label: 'Имя' } };
export const Email = { args: { type: 'email', placeholder: 'you@example.com', label: 'Email' } };
export const Password = { args: { type: 'password', value: 'secret123', label: 'Пароль' } };
export const Invalid = { args: { type: 'email', value: 'not-an-email', invalid: true, label: 'Email' } };
export const Disabled = { args: { placeholder: 'Недоступно', disabled: true, label: 'Поле' } };
