export const createInput = ({
    type = 'text',
    placeholder = '',
    value = '',
    disabled = false,
    invalid = false,
    id = '',
    label = '',
}) => {
    const input = document.createElement('input');
    input.className = 'input';
    input.type = type;
    input.placeholder = placeholder;
    input.value = value;
    input.disabled = disabled;
    if (id) input.id = id;
    if (label) input.setAttribute('aria-label', label);
    if (invalid) input.setAttribute('aria-invalid', 'true');
    return input;
};
