import { createInput } from '../../atoms/Input/Input';
import { createButton } from '../../atoms/Button/Button';
import { createIcon } from '../../atoms/Icon/Icon';

export const createSearchBar = ({
    placeholder = 'Поиск курсов',
    buttonLabel = 'Найти',
    onSearch = () => {},
}) => {
    const form = document.createElement('form');
    form.className = 'search-bar';
    form.setAttribute('role', 'search');

    const field = document.createElement('div');
    field.className = 'search-bar__field';
    const input = createInput({ type: 'search', placeholder, label: placeholder });
    input.classList.add('search-bar__input');
    field.append(createIcon({ name: 'search', size: 20 }), input);

    form.append(field, createButton({ label: buttonLabel }));
    form.addEventListener('submit', e => {
        e.preventDefault();
        onSearch(input.value);
    });
    return form;
};
