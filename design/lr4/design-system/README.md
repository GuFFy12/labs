# EduKit — дизайн-система образовательной платформы

Лабораторная работа 4 по веб-дизайну. Компоненты на чистом HTML/CSS/JS,
токены в формате W3C, документация в Storybook.

## Принципы

- **Ясность** — каждый компонент понятен без документации
- **Консистентность** — одинаковые элементы выглядят одинаково во всех сценариях
- **Доступность** — контраст ≥ 4.5:1, видимый фокус, ARIA-роли, управление с клавиатуры
- **Только токены** — компоненты не используют «жёсткие» цвета, поэтому тема меняется автоматически
- **Расширяемость** — новый компонент собирается из существующих атомов

## Команды

```bash
npm install
npm run tokens            # tokens/*.json → src/styles/tokens.css (+ тёмная тема)
npm run storybook         # http://localhost:6006
npm run build-storybook   # статический сайт в storybook-static/
npm run deploy-storybook  # публикация storybook-static/ на GitHub Pages (ветка gh-pages)
```

## Структура

```
design-system/
├── tokens/               # W3C-токены: colors, typography, spacing, radii, shadows, motion
├── tokens-dark/          # переопределения семантических цветов для тёмной темы
├── src/
│   ├── styles/           # tokens.css, tokens-dark.css (генерируются), global.css, Tokens.stories.js
│   ├── components/
│   │   ├── atoms/        # Button, Input, Checkbox, Radio, Switch, Badge, Icon, Avatar, Spinner
│   │   ├── molecules/    # FormField, SearchBar, Pagination, Breadcrumbs, Tabs, Tooltip
│   │   └── organisms/    # Header, Footer, Card, Modal, Table, Form
│   └── index.js
├── .storybook/           # main.js, preview.js (переключатель темы)
└── .github/workflows/chromatic.yml
```

Каждый компонент — отдельная папка с `.js`, `.css` и `.stories.js`.

## Версионирование

SemVer, история в [CHANGELOG.md](CHANGELOG.md), релизы отмечены git-тегами `v1.0.0`, `v1.1.0`.
