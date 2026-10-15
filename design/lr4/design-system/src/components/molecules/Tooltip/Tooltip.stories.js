import { createTooltip } from './Tooltip';
import './Tooltip.css';

export default {
    title: 'Molecules/Tooltip',
    tags: ['autodocs'],
    argTypes: {
        placement: { control: { type: 'select' }, options: ['top', 'bottom'] },
    },
    decorators: [(story) => {
        const wrap = document.createElement('div');
        wrap.style.padding = '64px 32px';
        wrap.append(story());
        return wrap;
    }],
    render: (args) => createTooltip(args),
};

export const Top = { args: { trigger: 'Что такое наставник?', text: 'Разработчик, который проверяет задания и отвечает в чате', placement: 'top' } };
export const Bottom = { args: { trigger: 'Рассрочка', text: 'Оплата частями без переплаты на 12 месяцев', placement: 'bottom' } };
