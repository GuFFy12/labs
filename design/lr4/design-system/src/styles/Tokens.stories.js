import './tokens.css';

export default {
    title: 'Foundations/Tokens',
};

const Swatch = (name, varName) => {
    const el = document.createElement('div');
    el.style.cssText = `
        display: flex; flex-direction: column;
        align-items: center; gap: 8px;
        font-family: monospace; font-size: 12px;
    `;
    el.innerHTML = `
        <div style="
            width: 80px; height: 80px;
            background: var(${varName});
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        "></div>
        <div>${name}</div>
    `;
    return el;
};

export const Colors = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 16px; flex-wrap: wrap;';
        wrap.append(
            Swatch('primary', '--color-semantic-action-primary'),
            Swatch('text', '--color-semantic-text-default'),
            Swatch('bg', '--color-semantic-background-default'),
            Swatch('surface', '--color-semantic-background-surface'),
        );
        return wrap;
    },
};

export const Spacing = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
        [1, 2, 3, 4, 6, 8, 12, 16].forEach(n => {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center; gap: 16px;';
            row.innerHTML = `
                <code>space-${n}</code>
                <div style="
                    height: 16px;
                    width: var(--space-${n});
                    background: var(--color-semantic-action-primary);
                "></div>
                <small>var(--space-${n})</small>
            `;
            wrap.append(row);
        });
        return wrap;
    },
};

// Дополнение: все семантические цвета, типографика, радиусы, тени

export const SemanticColors = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 16px; flex-wrap: wrap;';
        [
            'background-default', 'background-surface', 'background-muted',
            'text-default', 'text-muted', 'border-default',
            'action-primary', 'action-primary-hover', 'action-on-primary', 'action-danger', 'action-danger-hover',
            'feedback-info-bg', 'feedback-info-text', 'feedback-success-bg', 'feedback-success-text',
            'feedback-warning-bg', 'feedback-warning-text', 'feedback-error-bg', 'feedback-error-text',
        ].forEach(name => wrap.append(Swatch(name, `--color-semantic-${name}`)));
        return wrap;
    },
};

export const Typography = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
        ['3xl', '2xl', 'xl', 'lg', 'base', 'sm', 'xs'].forEach(size => {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: baseline; gap: 24px;';
            row.innerHTML = `
                <code style="width: 140px; flex-shrink: 0;">font-size-${size}</code>
                <span style="
                    font-family: var(--font-family-${['3xl', '2xl', 'xl'].includes(size) ? 'display' : 'body'});
                    font-size: var(--font-size-${size});
                    font-weight: var(--font-weight-${['3xl', '2xl', 'xl'].includes(size) ? 'bold' : 'regular'});
                ">Дизайн-система EduKit</span>
            `;
            wrap.append(row);
        });
        return wrap;
    },
};

export const Radii = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 24px; font-family: monospace; font-size: 12px;';
        ['sm', 'md', 'lg', 'pill'].forEach(r => {
            const el = document.createElement('div');
            el.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px;';
            el.innerHTML = `
                <div style="width: 96px; height: 64px; border-radius: var(--radius-${r});
                    background: var(--color-semantic-feedback-info-bg);
                    border: 2px solid var(--color-semantic-action-primary);"></div>
                <div>radius-${r}</div>
            `;
            wrap.append(el);
        });
        return wrap;
    },
};

export const Shadows = {
    render: () => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display: flex; gap: 32px; padding: 16px; font-family: monospace; font-size: 12px;';
        ['sm', 'md', 'lg'].forEach(s => {
            const el = document.createElement('div');
            el.style.cssText = `width: 120px; height: 80px; display: grid; place-items: center;
                border-radius: 12px; background: var(--color-semantic-background-surface);
                color: var(--color-semantic-text-default); box-shadow: var(--shadow-${s});`;
            el.textContent = `shadow-${s}`;
            wrap.append(el);
        });
        return wrap;
    },
};
