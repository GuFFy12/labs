// Card.js
export const createCard = ({ image, title, text, actionLabel = 'Подробнее' }) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
        <img class="card__image" src="${image}" alt="">
        <div class="card__body">
            <h3 class="card__title">${title}</h3>
            <p class="card__text">${text}</p>
            <button class="btn btn--primary btn--md">${actionLabel}</button>
        </div>
    `;
    return card;
};

// Дополнение: варианты карточки из списка 3.1 — product, article, user
export const createProductCard = ({ image, title, text, price, badge = '' }) => {
    const card = createCard({ image, title, text, actionLabel: 'Записаться' });
    card.classList.add('card--product');
    const body = card.querySelector('.card__body');
    if (badge) body.insertAdjacentHTML('afterbegin', `<span class="badge badge--info">${badge}</span>`);
    card.querySelector('.card__text').insertAdjacentHTML('afterend', `<p class="card__price">${price}</p>`);
    return card;
};

export const createArticleCard = ({ image, title, text, date, readTime }) => {
    const card = createCard({ image, title, text, actionLabel: 'Читать' });
    card.classList.add('card--article');
    card.querySelector('.btn').className = 'btn btn--ghost btn--sm';
    card.querySelector('.card__body').insertAdjacentHTML('afterbegin', `<p class="card__meta">${date} · ${readTime}</p>`);
    return card;
};

export const createUserCard = ({ image, title, text, role }) => {
    const card = createCard({ image, title, text, actionLabel: 'Профиль' });
    card.classList.add('card--user');
    const img = card.querySelector('.card__image');
    img.alt = title;
    card.querySelector('.btn').className = 'btn btn--secondary btn--sm';
    card.querySelector('.card__title').insertAdjacentHTML('afterend', `<p class="card__role">${role}</p>`);
    return card;
};
