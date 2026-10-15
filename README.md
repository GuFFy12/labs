# Лабораторные работы

[![Quality Gate](https://github.com/GuFFy12/labs/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/GuFFy12/labs/actions/workflows/quality-gate.yml)
[![Tests](https://github.com/GuFFy12/labs/actions/workflows/qa-lr1-tests.yml/badge.svg)](https://github.com/GuFFy12/labs/actions/workflows/qa-lr1-tests.yml)
[![Lighthouse CI](https://github.com/GuFFy12/labs/actions/workflows/qa-lr3-lighthouse.yml/badge.svg)](https://github.com/GuFFy12/labs/actions/workflows/qa-lr3-lighthouse.yml)

Опубликованные сайты: **https://guffy12.github.io/labs/**

## Управление качеством — [qa/](qa/)

| ЛР | Тема | Папка | CI |
|---|---|---|---|
| 1 | ESLint, Prettier, Vitest, TDD | [qa/lr1](qa/lr1) | [qa-lr1-tests.yml](.github/workflows/qa-lr1-tests.yml) |
| 2 | E2E на Playwright, Page Object | [qa/lr2](qa/lr2) | — (workflow в папке лабы, не запускается) |
| 3 | Lighthouse CI, Core Web Vitals | [qa/lr3](qa/lr3) | [qa-lr3-lighthouse.yml](.github/workflows/qa-lr3-lighthouse.yml) |
| 4 | Нагрузочное тестирование k6 | [qa/lr4](qa/lr4) | — |
| 5 | Quality Gate в GitHub Actions | [qa/lr5](qa/lr5) | [quality-gate.yml](.github/workflows/quality-gate.yml) |

Отчёт: [qa/REPORT.md](qa/REPORT.md)

## Веб-дизайн — [design/](design/)

| ЛР | Тема | Папка | Сайт |
|---|---|---|---|
| 1 | Лендинг на сетке и дизайн-токенах | [design/lr1](design/lr1) | [design-lr1](https://guffy12.github.io/labs/design-lr1/) |
| 2 | Многостраничный сайт на дизайн-системе | [design/lr2](design/lr2) | [design-lr2](https://guffy12.github.io/labs/design-lr2/) |
| 3 | Core Web Vitals, юзабилити, A/B | [design/lr3](design/lr3) | [A](https://guffy12.github.io/labs/design-lr3/a/), [B](https://guffy12.github.io/labs/design-lr3/b/) |
| 4 | Дизайн-система EduKit и Storybook | [design/lr4/design-system](design/lr4/design-system) | [Storybook](https://guffy12.github.io/labs/storybook/) |

Отчёт: [design/REPORT.md](design/REPORT.md). Версии дизайн-системы — git-теги `edukit-v1.0.0`, `edukit-v1.1.0`.

## Монорепо

Workflow из методичек перенесены в корень [.github/workflows](.github/workflows): GitHub запускает только их.
Отличия от текста методичек — `working-directory` с папкой лабы и пути артефактов от корня репозитория.
[pages.yml](.github/workflows/pages.yml) собирает сайты веб-дизайна и Storybook в ветку `gh-pages`.

Секреты репозитория: `CODECOV_TOKEN`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_TO`, `CHROMATIC_TOKEN`.
