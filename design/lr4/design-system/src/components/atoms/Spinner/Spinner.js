export const createSpinner = ({
    size = 'md',
    label = 'Загрузка',
}) => {
    const spinner = document.createElement('span');
    spinner.className = `spinner spinner--${size}`;
    spinner.setAttribute('role', 'status');
    spinner.setAttribute('aria-label', label);
    return spinner;
};
