import { createBadge } from './Badge';
import './Badge.css';

export default {
    title: 'Atoms/Badge',
    tags: ['autodocs'],
    argTypes: {
        variant: { control: { type: 'select' }, options: ['info', 'success', 'warning', 'error'] },
    },
    render: (args) => createBadge(args),
};

export const Info = { args: { variant: 'info', label: 'Новый курс' } };
export const Success = { args: { variant: 'success', label: 'Оплачено' } };
export const Warning = { args: { variant: 'warning', label: 'Осталось 3 места' } };
export const Error = { args: { variant: 'error', label: 'Отменено' } };

export const All = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
        wrap.append(
            createBadge({ variant: 'info', label: 'info' }),
            createBadge({ variant: 'success', label: 'success' }),
            createBadge({ variant: 'warning', label: 'warning' }),
            createBadge({ variant: 'error', label: 'error' }),
        );
        return wrap;
    },
};
