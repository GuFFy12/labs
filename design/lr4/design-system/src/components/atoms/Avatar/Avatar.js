export const createAvatar = ({
    src = '',
    name = 'Имя Фамилия',
    size = 'md',
}) => {
    const avatar = document.createElement('span');
    avatar.className = `avatar avatar--${size}`;
    if (src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = name;
        avatar.append(img);
    } else {
        // Инициалы, если нет фото
        avatar.setAttribute('role', 'img');
        avatar.setAttribute('aria-label', name);
        avatar.textContent = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }
    return avatar;
};
