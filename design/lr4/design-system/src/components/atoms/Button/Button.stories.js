import { createButton } from './Button';
import './Button.css';

export default {
    title: 'Atoms/Button',
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'ghost', 'danger'],
        },
        size: {
            control: { type: 'select' },
            options: ['sm', 'md', 'lg'],
        },
        disabled: { control: 'boolean' },
    },
};

export const Primary = {
    args: { variant: 'primary', size: 'md', label: 'Записаться' },
    render: (args) => createButton(args),
};

export const Secondary = {
    args: { variant: 'secondary', size: 'md', label: 'Подробнее' },
    render: (args) => createButton(args),
};

export const Ghost = {
    args: { variant: 'ghost', size: 'md', label: 'Отмена' },
    render: (args) => createButton(args),
};

export const Danger = {
    args: { variant: 'danger', size: 'md', label: 'Удалить' },
    render: (args) => createButton(args),
};

export const Sizes = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.display = 'flex';
        wrap.style.gap = '16px';
        wrap.style.alignItems = 'center';
        wrap.append(
            createButton({ label: 'Small',  size: 'sm' }),
            createButton({ label: 'Medium', size: 'md' }),
            createButton({ label: 'Large',  size: 'lg' }),
        );
        return wrap;
    },
};

export const Disabled = {
    args: { variant: 'primary', size: 'md', label: 'Недоступно', disabled: true },
    render: (args) => createButton(args),
};

export const AllVariants = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: grid; grid-template-columns: repeat(4, max-content); gap: 16px; align-items: center;';
        ['primary', 'secondary', 'ghost', 'danger'].forEach(variant => {
            ['sm', 'md', 'lg'].forEach(size => wrap.append(createButton({ variant, size, label: `${variant} ${size}` })));
            wrap.append(createButton({ variant, size: 'md', label: 'disabled', disabled: true }));
        });
        return wrap;
    },
};
