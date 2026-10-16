# Плагин Figma: макеты лабораторных по веб-дизайну

Строит макеты из токенов и вёрстки лабораторных средствами Figma:
Local Variables, Text Styles, компоненты с Variants и свойствами, Auto Layout, Layout Grid.

## Запуск

Нужна десктопная Figma (в браузере development-плагины не импортируются).

1. Создать файл `Lab1_WebDesign_<Фамилия>` (п. 2.1 методички ЛР1).
2. Menu → Plugins → Development → **Import plugin from manifest…** → выбрать `design/figma-plugin/manifest.json`.
3. Menu → Plugins → Development → **Labs: макеты веб-дизайна** → **ЛР1 — лендинг CodeStart**.

Плагин создаёт новую страницу «ЛР1 — CodeStart». Запускать один раз на файл: повторный запуск создаст ещё одну страницу и ещё одни коллекции переменных.

## Что создаётся (ЛР1)

| Методичка | В файле |
|---|---|
| 2.1 Мудборд 1440×900 | фрейм «Мудборд» с 6 слотами — референсы вставляются вручную |
| 3.4 Local Variables | коллекции `LR1 Colors` (Light, Dark), `LR1 Spacing`, `LR1 Radius`; цвета, отступы и радиусы на макетах привязаны к переменным |
| 3.2 Типографика | текстовые стили `LR1/Heading/*`, `LR1/Body/*`, `LR1/Button/*`, шкала 12–76 на доске «Токены» |
| 4.1 Сетка | фреймы Mobile 375 (4 кол., 16/16), Tablet 768 (8 кол., 24/32), Desktop 1440 (12 кол., 24/80) с Layout Grid |
| 4.2 Auto Layout | все блоки и карточки на Auto Layout |
| 4.3 Перестройка блоков | Features 1 → 2 → 4, Testimonials 1 → 2 → 3, Hero: по центру → две колонки |
| 4.4 Компоненты | Button (Type × State × Size), Feature card (Icon через Instance Swap, Title, Text), Step, Review, Logo, Icon/* |
| Задание 1 | фрейм «Desktop 1440 — Dark»: тот же макет в режиме Dark (если план Figma позволяет второй режим) |

Фото в hero берётся с опубликованного сайта (guffy12.github.io), если сети нет — останется заполнитель.

## Скриншоты для отчёта

- мудборд (после вставки референсов);
- панель Local Variables (открыть: Local variables в правой панели при снятом выделении);
- фреймы Mobile 375, Tablet 768, Desktop 1440 (с включённой сеткой: Shift+G);
- компонент Button со всеми вариантами.

## ЛР2: UI Kit и прототип

Запускать в файле `Lab2_WebDesign_<Фамилия>`, где на странице «Макеты» уже лежат 7 страниц × 375/768/1440 и компоненты Header (Breakpoint × Page) и Footer. Порядок: сначала UI Kit, потом прототип.

1. **ЛР2 — UI Kit (страница Design System)** — строит на странице «Design System»:

   | Методичка | В файле |
   |---|---|
   | 2.1 Цветовые токены | коллекции `LR2 Primitives` (скрыты из пикеров) и `LR2 Color` (Light, Dark): семантика ссылается на примитивы; у каждой переменной CSS-имя для Dev Mode (`var(--color-primary)`) |
   | 2.2–2.3 Прочие токены | `LR2 Spacing` (--space-*), `LR2 Radius`, `LR2 Typography` (--fs-*), текстовые стили `LR2/*` с размером на переменных, тени `LR2/shadow-*` и кольца фокуса |
   | 2.4 Colors, Typography | доски со всеми токенами и подписями, размеры и начертания |
   | 2.4 Buttons | `Button`: variant (primary, secondary, ghost) × state (default, hover, focus, disabled) × size (sm, md, lg), свойство Label |
   | 2.4 Inputs | `Input` (text, textarea, select × default, focus, error, disabled), `Checkbox`, `Form field` |
   | 2.4 Cards | `Course Card` (default, hover), `Blog Post Card`, `Teacher Card`; фото берутся из макетов |
   | 2.4 Navigation | экземпляры Header и Footer со страницы «Макеты», `Breadcrumbs`, `Pagination` |
   | 4.2 Hover | Default → Hover по наведению (While hovering → Change to) у кнопок, карточки курса, пагинации |

2. **ЛР2 — прототип (страница Макеты)** — переходы шага 4:
   - пункты меню и логотип в главных компонентах Header/Footer → соответствующие страницы той же ширины (экземпляры на всех страницах получают связи автоматически);
   - кнопки «Выбрать курс», «Все курсы», «Получить консультацию», карточки курсов и статей, хлебные крошки → On Click → Navigate to, Smart Animate 250 мс;
   - фрейм «Menu Open — Mobile 375»: бургер в мобильной шапке → Open overlay, Move In справа 250 мс; крестик → Close overlay;
   - потоки Desktop, Tablet, Mobile от главной; у всех фреймов включено Clip content.

   Ссылка на прототип: Present (▶) → Share prototype → Copy link.

4.4 (On Scroll → Change to) плагином не настраивается: такого триггера в Plugin API нет.

## ЛР4: дизайн-система EduKit

Создать пустой файл `Lab4_WebDesign_<Фамилия>` и запустить **ЛР4 — дизайн-система EduKit**. Токены — из `design/lr4/design-system/tokens`, компоненты повторяют Storybook.

| Методичка | В файле |
|---|---|
| Шаг 2 Токены | коллекции `Primitives`, `Color` (Light, Dark из tokens-dark), `Spacing`, `Radius`, `Typography` (font/size, font/weight), `Motion`; CSS-имена как у Style Dictionary (`var(--color-semantic-action-primary)`); стили `EduKit/*`, `shadow/*`, `focus/*` |
| Atoms | Icon/* (12 иконок Lucide), Button (4 variant × 3 size × 4 state = 48, слот иконки через Instance Swap), Input (text, email, password × 5 состояний), Checkbox, Radio, Switch, Badge, Avatar, Spinner |
| Molecules | Form Field (default, error), Search Bar, Pagination, Breadcrumbs, Tabs, Tooltip (top, bottom) |
| Organisms | Header (guest, logged-in), Footer, Card (course, article, user × default, hover; фото — слот Media через Instance Swap), Modal (primary, danger), Table (обычная и striped), Form |

Страницы: «EduKit — Foundations» (доска токенов) и «EduKit — Components». Если файл не пустой и третью страницу создать нельзя, всё строится на одной странице. Фото для карточек и аватара берутся с опубликованных сайтов ЛР1 и ЛР3.

Режим Dark создаётся, только если план Figma разрешает второй режим у коллекции; тогда же появляется секция «Dark theme» с теми же экземплярами в тёмной теме.

Каждую команду запускать один раз на файл: повторный запуск создаст ещё одни коллекции переменных и стили.
