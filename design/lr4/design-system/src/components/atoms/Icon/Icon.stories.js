import { createIcon } from './Icon';
import { icons } from './icons';
import './Icon.css';

export default {
    title: 'Atoms/Icon',
    tags: ['autodocs'],
    argTypes: {
        name: { control: { type: 'select' }, options: Object.keys(icons) },
        size: { control: { type: 'select' }, options: [16, 20, 24, 32, 48] },
    },
    render: (args) => createIcon(args),
};

export const Default = { args: { name: 'star', size: 24 } };

export const Set = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: grid; grid-template-columns: repeat(6, 96px); gap: 16px; color: var(--color-semantic-text-default); font-family: monospace; font-size: 12px;';
        Object.keys(icons).forEach(name => {
            const cell = document.createElement('div');
            cell.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px;';
            const caption = document.createElement('span');
            caption.textContent = name;
            cell.append(createIcon({ name, size: 32 }), caption);
            wrap.append(cell);
        });
        return wrap;
    },
};
