import { createSwitch } from './Switch';
import './Switch.css';

export default {
    title: 'Atoms/Switch',
    tags: ['autodocs'],
    argTypes: {
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    render: (args) => createSwitch(args),
};

export const Off = { args: { label: 'Уведомления' } };
export const On = { args: { label: 'Уведомления', checked: true } };
export const Disabled = { args: { label: 'Недоступно', disabled: true } };
