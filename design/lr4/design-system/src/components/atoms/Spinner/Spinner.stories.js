import { createSpinner } from './Spinner';
import './Spinner.css';

export default {
    title: 'Atoms/Spinner',
    tags: ['autodocs'],
    argTypes: {
        size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    },
    render: (args) => createSpinner(args),
};

export const Default = { args: { size: 'md' } };

export const Sizes = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 24px; align-items: center;';
        ['sm', 'md', 'lg'].forEach(size => wrap.append(createSpinner({ size })));
        return wrap;
    },
};
