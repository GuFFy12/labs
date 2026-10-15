import { createAvatar } from './Avatar';
import './Avatar.css';

const PHOTO = 'avatar.webp'; // из public/ (staticDirs)

export default {
    title: 'Atoms/Avatar',
    tags: ['autodocs'],
    argTypes: {
        size: { control: { type: 'select' }, options: ['sm', 'md', 'lg'] },
    },
    render: (args) => createAvatar(args),
};

export const Photo = { args: { src: PHOTO, name: 'Елена Иванова', size: 'md' } };
export const Initials = { args: { name: 'Павел Орлов', size: 'md' } };

export const Sizes = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 16px; align-items: center;';
        ['sm', 'md', 'lg'].forEach(size => wrap.append(
            createAvatar({ src: PHOTO, name: 'Елена Иванова', size }),
            createAvatar({ name: 'Павел Орлов', size }),
        ));
        return wrap;
    },
};
