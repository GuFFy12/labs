let uid = 0;

export const createTooltip = ({
    trigger = 'Наведите',
    text = 'Подсказка',
    placement = 'top',
}) => {
    const id = `tooltip-${++uid}`;
    const wrap = document.createElement('span');
    wrap.className = `tooltip tooltip--${placement}`;
    wrap.innerHTML = `
        <button type="button" class="tooltip__trigger" aria-describedby="${id}">${trigger}</button>
        <span class="tooltip__bubble" role="tooltip" id="${id}">${text}</span>
    `;
    // Escape скрывает подсказку (WCAG 1.4.13)
    wrap.addEventListener('keydown', e => {
        if (e.key === 'Escape') wrap.classList.add('tooltip--dismissed');
    });
    wrap.addEventListener('mouseleave', () => wrap.classList.remove('tooltip--dismissed'));
    wrap.addEventListener('focusout', () => wrap.classList.remove('tooltip--dismissed'));
    return wrap;
};
