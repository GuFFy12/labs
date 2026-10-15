export const createBadge = ({
    label = 'Badge',
    variant = 'info',
}) => {
    const badge = document.createElement('span');
    badge.className = `badge badge--${variant}`;
    badge.textContent = label;
    return badge;
};
