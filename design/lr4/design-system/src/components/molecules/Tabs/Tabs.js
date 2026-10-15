let uid = 0;

export const createTabs = ({
    tabs = [],
    active = 0,
}) => {
    const id = `tabs-${++uid}`;
    const wrap = document.createElement('div');
    wrap.className = 'tabs';
    const list = document.createElement('div');
    list.className = 'tabs__list';
    list.setAttribute('role', 'tablist');
    wrap.append(list);

    const buttons = tabs.map((tab, i) => {
        const btn = document.createElement('button');
        btn.className = 'tabs__tab';
        btn.id = `${id}-tab-${i}`;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', `${id}-panel-${i}`);
        btn.textContent = tab.label;

        const panel = document.createElement('div');
        panel.className = 'tabs__panel';
        panel.id = `${id}-panel-${i}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', btn.id);
        panel.tabIndex = 0;
        panel.textContent = tab.content;

        list.append(btn);
        wrap.append(panel);
        return { btn, panel };
    });

    const select = (index) => {
        buttons.forEach(({ btn, panel }, i) => {
            const selected = i === index;
            btn.setAttribute('aria-selected', selected);
            btn.tabIndex = selected ? 0 : -1;
            panel.hidden = !selected;
        });
    };

    buttons.forEach(({ btn }, i) => {
        btn.addEventListener('click', () => select(i));
        // Стрелки влево/вправо — переход между вкладками (WAI-ARIA)
        btn.addEventListener('keydown', e => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
            select(next);
            buttons[next].btn.focus();
        });
    });

    select(active);
    return wrap;
};
