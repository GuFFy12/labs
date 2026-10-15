export const createRadio = ({
    label = 'Radio',
    name = 'radio',
    value = '',
    checked = false,
    disabled = false,
}) => {
    const wrap = document.createElement('label');
    wrap.className = 'radio';
    const input = document.createElement('input');
    input.type = 'radio';
    input.className = 'radio__input';
    input.name = name;
    input.value = value || label;
    input.checked = checked;
    input.disabled = disabled;
    const text = document.createElement('span');
    text.textContent = label;
    wrap.append(input, text);
    return wrap;
};
