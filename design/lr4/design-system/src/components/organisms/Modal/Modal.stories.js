import { createModal, createModalTrigger } from './Modal';
import './Modal.css';

export default {
    title: 'Organisms/Modal',
    tags: ['autodocs'],
    argTypes: {
        variant: { control: { type: 'select' }, options: ['primary', 'danger'] },
    },
    render: (args) => createModalTrigger(args),
};

const staticModal = (args) => {
    const modal = createModal(args);
    modal.classList.add('modal--static');
    modal.setAttribute('open', '');
    return modal;
};

export const Interactive = {
    args: { title: 'Записаться на курс?', text: 'Менеджер свяжется с вами в течение дня и расскажет о старте потока.', confirmLabel: 'Записаться' },
};

export const Confirm = {
    args: { title: 'Записаться на курс?', text: 'Менеджер свяжется с вами в течение дня и расскажет о старте потока.', confirmLabel: 'Записаться' },
    render: staticModal,
};

export const Danger = {
    args: { title: 'Отменить запись?', text: 'Место в потоке освободится, вернуть его можно будет только при наличии свободных мест.', confirmLabel: 'Отменить запись', cancelLabel: 'Оставить', variant: 'danger' },
    render: staticModal,
};
