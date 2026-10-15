export const createButton = ({
    variant = 'primary',
    size = 'md',
    label = 'Button',
    disabled = false,
}) => {
    const btn = document.createElement('button');
    btn.className = `btn btn--${variant} btn--${size}`;
    btn.textContent = label;
    btn.disabled = disabled;
    return btn;
};
