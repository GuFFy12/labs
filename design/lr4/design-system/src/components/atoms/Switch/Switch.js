export const createSwitch = ({
    label = 'Switch',
    checked = false,
    disabled = false,
}) => {
    const wrap = document.createElement('label');
    wrap.className = 'switch';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'switch__input';
    input.setAttribute('role', 'switch');
    input.checked = checked;
    input.disabled = disabled;
    const track = document.createElement('span');
    track.className = 'switch__track';
    track.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = label;
    wrap.append(input, track, text);
    return wrap;
};
