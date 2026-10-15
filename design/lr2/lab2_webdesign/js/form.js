// Формы заявки: без сервера, показываем сообщение об успешной отправке
document.querySelectorAll('[data-form]').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const success = form.querySelector('.form-success');
        success.classList.add('is-shown');
        success.focus();
        form.reset();
    });
});
