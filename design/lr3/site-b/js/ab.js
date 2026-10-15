// ЛР3: клик по CTA отправляется в Clarity как пользовательское событие
document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
        if (window.clarity) window.clarity('event', 'cta_click');
    });
});
