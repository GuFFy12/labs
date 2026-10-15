export const createCheckbox = ({
    label = 'Checkbox',
    checked = false,
    disabled = false,
    name = '',
}) => {
    const wrap = document.createElement('label');
    wrap.className = 'checkbox';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'checkbox__input';
    input.checked = checked;
    input.disabled = disabled;
    if (name) input.name = name;
    const text = document.createElement('span');
    text.textContent = label;
    wrap.append(input, text);
    return wrap;
};
