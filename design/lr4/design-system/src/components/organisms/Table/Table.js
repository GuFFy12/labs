import { createBadge } from '../../atoms/Badge/Badge';

export const createTable = ({
    caption = '',
    columns = [],
    rows = [],
    striped = false,
}) => {
    const wrap = document.createElement('div');
    wrap.className = 'table-wrap';
    const table = document.createElement('table');
    table.className = `table${striped ? ' table--striped' : ''}`;
    table.innerHTML = `
        ${caption ? `<caption class="table__caption">${caption}</caption>` : ''}
        <thead><tr>${columns.map(c => `<th scope="col">${c.label}</th>`).join('')}</tr></thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');
    rows.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(c => {
            const td = document.createElement('td');
            const value = row[c.key];
            // Колонка со статусом выводится бейджем
            if (c.badge) td.append(createBadge({ label: value.label, variant: value.variant }));
            else td.textContent = value;
            tr.append(td);
        });
        tbody.append(tr);
    });
    wrap.append(table);
    return wrap;
};
