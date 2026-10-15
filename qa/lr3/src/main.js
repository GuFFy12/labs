// промо подставляем в заранее зарезервированный блок — страница не прыгает
setTimeout(() => {
    document.getElementById('promo').innerHTML =
        '<p class="promo">Скидка 20% на второй кофе до конца недели!</p>';
}, 1200);

document.getElementById('subscribe').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.querySelector('button').textContent = 'Готово!';
});
