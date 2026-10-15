import { createFormField } from '../../molecules/FormField/FormField';
import { createCheckbox } from '../../atoms/Checkbox/Checkbox';
import { createButton } from '../../atoms/Button/Button';

export const createForm = ({
    title = 'Заявка на курс',
    fields = [],
    consent = 'Согласен на обработку персональных данных',
    submitLabel = 'Отправить',
}) => {
    const form = document.createElement('form');
    form.className = 'form';
    form.noValidate = true;
    form.innerHTML = `<h2 class="form__title">${title}</h2>`;
    fields.forEach(field => form.append(createFormField(field)));
    if (consent) form.append(createCheckbox({ label: consent, name: 'consent' }));
    const submit = createButton({ label: submitLabel, size: 'lg' });
    submit.type = 'submit';
    form.append(submit);
    const status = document.createElement('p');
    status.className = 'form__status';
    status.setAttribute('role', 'status');
    form.append(status);
    form.addEventListener('submit', e => {
        e.preventDefault();
        status.textContent = form.checkValidity() ? 'Заявка отправлена!' : 'Заполните обязательные поля';
    });
    return form;
};
