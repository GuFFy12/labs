let uid = 0;

// FormField.js
export const createFormField = ({
    label,
    type = 'text',
    placeholder = '',
    error = '',
    required = false,
    helper = '',
}) => {
    // Дополнение: id связывает label и input, иначе подпись не читается скринридером
    const id = `field-${++uid}`;
    const wrap = document.createElement('div');
    wrap.className = 'form-field';
    wrap.innerHTML = `
        <label class="form-field__label" for="${id}">
            ${label}${required ? ' *' : ''}
        </label>
        <input type="${type}" class="form-field__input" id="${id}"
               placeholder="${placeholder}" ${required ? 'required' : ''}
               ${error ? `aria-invalid="true" aria-describedby="${id}-msg"` : helper ? `aria-describedby="${id}-msg"` : ''} />
        ${error ? `<span class="form-field__error" id="${id}-msg">${error}</span>` : ''}
        ${!error && helper ? `<span class="form-field__helper" id="${id}-msg">${helper}</span>` : ''}
    `;
    return wrap;
};
