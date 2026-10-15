export const createFooter = ({
    brand = 'EduKit',
    columns = [],
    copyright = '© 2026 EduKit',
}) => {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="footer__grid">
            <p class="footer__brand">${brand}</p>
            ${columns.map(col => `
                <div>
                    <h2 class="footer__title">${col.title}</h2>
                    <ul class="footer__list">
                        ${col.links.map(link => `<li><a class="footer__link" href="#">${link}</a></li>`).join('')}
                    </ul>
                </div>`).join('')}
        </div>
        <p class="footer__copy">${copyright}</p>
    `;
    return footer;
};
