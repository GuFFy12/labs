import { icons } from './icons';

export const createIcon = ({
    name = 'star',
    size = 24,
    label = '',
}) => {
    const span = document.createElement('span');
    span.className = 'icon';
    span.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${icons[name] || ''}</svg>`;
    return span;
};
