// Фасад карты: сторонний iframe (~575 КБ) загружается только по клику
document.querySelectorAll('[data-map-src]').forEach(facade => {
    facade.querySelector('button').addEventListener('click', () => {
        const iframe = document.createElement('iframe');
        iframe.className = 'map';
        iframe.title = facade.dataset.mapTitle;
        iframe.src = facade.dataset.mapSrc;
        facade.replaceWith(iframe);
        iframe.focus();
    });
});
