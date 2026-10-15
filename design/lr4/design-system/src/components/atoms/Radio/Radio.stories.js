import { createRadio } from './Radio';
import './Radio.css';

export default {
    title: 'Atoms/Radio',
    tags: ['autodocs'],
    argTypes: {
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) => createRadio(args),
};

export const Default = { args: { label: 'Онлайн', name: 'format' } };
export const Checked = { args: { label: 'Онлайн', name: 'format-2', checked: true } };
export const Disabled = { args: { label: 'Офлайн', name: 'format-3', disabled: true } };

export const Group = {
    render: () => {
        const fieldset = document.createElement('fieldset');
        fieldset.style.cssText = 'border: none; padding: 0; display: flex; flex-direction: column; gap: 12px;';
        const legend = document.createElement('legend');
        legend.textContent = 'Формат обучения';
        legend.style.cssText = 'font-family: var(--font-family-body); font-weight: 600; margin-bottom: 8px; color: var(--color-semantic-text-default);';
        fieldset.append(
            legend,
            createRadio({ label: 'Онлайн', name: 'group', checked: true }),
            createRadio({ label: 'Гибрид', name: 'group' }),
            createRadio({ label: 'Офлайн', name: 'group', disabled: true }),
        );
        return fieldset;
    },
};
