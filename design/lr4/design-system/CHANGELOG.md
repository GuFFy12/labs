# Changelog

## [1.1.0] - 2026-09-26
### Added
- Тёмная тема на уровне токенов: `tokens-dark/colors.json` → `src/styles/tokens-dark.css`
- Глобальный переключатель темы в панели Storybook (`.storybook/preview.js`)
- `npm run tokens` собирает обе темы: `tokens.css` и `tokens-dark.css`

## [1.0.0] - 2026-09-26
### Added
- Первая версия: 21 компонент
  - Atoms: `Button` (primary/secondary/ghost/danger), `Input`, `Checkbox`, `Radio`, `Switch`,
    `Badge` (info/success/warning/error), `Icon`, `Avatar`, `Spinner`
  - Molecules: `FormField`, `SearchBar`, `Pagination`, `Breadcrumbs`, `Tabs`, `Tooltip`
  - Organisms: `Header`, `Footer`, `Card` (product/article/user), `Modal`, `Table`, `Form`
- Дизайн-токены в формате W3C, генерация CSS через Style Dictionary
- Семантический токен `action.on-primary` для текста на кнопках вместо «жёсткого» `#fff`
- Документация токенов: `Foundations/Tokens`
