import { createButton } from '../../atoms/Button/Button';

let uid = 0;

export const createModal = ({
    title = 'Заголовок',
    text = '',
    confirmLabel = 'Подтвердить',
    cancelLabel = 'Отмена',
    variant = 'primary',
}) => {
    const id = `modal-${++uid}`;
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.innerHTML = `
        <h2 class="modal__title" id="${id}-title">${title}</h2>
        <p class="modal__text">${text}</p>
        <div class="modal__actions"></div>
    `;
    const cancel = createButton({ variant: 'ghost', label: cancelLabel });
    const confirm = createButton({ variant, label: confirmLabel });
    cancel.addEventListener('click', () => dialog.close('cancel'));
    confirm.addEventListener('click', () => dialog.close('confirm'));
    dialog.querySelector('.modal__actions').append(cancel, confirm);
    // Клик по подложке закрывает окно
    dialog.addEventListener('click', e => {
        if (e.target === dialog) dialog.close('cancel');
    });
    return dialog;
};

// Кнопка, открывающая модальное окно (для story)
export const createModalTrigger = (args) => {
    const wrap = document.createElement('div');
    const modal = createModal(args);
    const open = createButton({ variant: 'secondary', label: 'Открыть окно' });
    open.addEventListener('click', () => modal.showModal());
    wrap.append(open, modal);
    return wrap;
};
