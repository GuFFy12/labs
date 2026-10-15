import { createCheckbox } from './Checkbox';
import './Checkbox.css';

export default {
    title: 'Atoms/Checkbox',
    tags: ['autodocs'],
    argTypes: {
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) => createCheckbox(args),
};

export const Default = { args: { label: 'Получать новости курса' } };
export const Checked = { args: { label: 'Согласен с условиями', checked: true } };
export const Disabled = { args: { label: 'Недоступно', disabled: true } };
