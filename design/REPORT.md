Веб-дизайн, ЛР1-4

Репозиторий: https://github.com/GuFFy12/labs (папка design/), сайты: https://guffy12.github.io/labs/

Проекты: lr1/lab1_webdesign, lr2/lab2_webdesign, lr3/site + lr3/site-b, lr4/design-system
Тема везде одна: онлайн-школа IT-профессий CodeStart (ЛР1 лендинг курса, ЛР2 сайт школы, ЛР3 исследование этого сайта, ЛР4 дизайн-система EduKit для платформы)
Окружение: macOS, Node 24, Chromium (Playwright), Lighthouse 12.6, axe-core, Storybook 10.6, Style Dictionary 5.5
Код из методичек перенесен дословно (включая комментарии), все добавления подписаны комментариями "Задание N", "Дополнение", "ЛР3".
Фото: Unsplash, иконки: Lucide (ISC).


ЛР1. Лендинг на сетке и дизайн-токенах

Тема: лендинг курса "Веб-разработчик с нуля". Цель страницы: пользователь оставляет заявку на бесплатный вводный модуль (CTA "Попробовать бесплатно" / "Присоединиться").

- index.html по шагу 6 (header, hero, features x4, how x3, reviews x3, cta, footer)
- css/style.css по шагу 7: токены :root, reset, кнопки, hero, features, how, reviews, cta, footer, header
- img: logo.svg, icon-1..4.svg, hero.jpg (1920px, 2x, фон hero), hero-students.jpg (1600px, 2x) + hero-students-800.jpg (srcset) - фото в hero
- адаптив блоков по 4.3: Features 1 -> 2 -> 4, Testimonials 1 -> 2 -> 3, Hero: по центру -> на десктопе (>= 1024) две колонки (текст + фото)
- ошибка в CSS методички: .reviews__grid { repeat(3, 1fr) } из 7.5 стоит раньше базового .reviews__grid { 1fr } из 7.8 и перебивается им - отзывы были в одну колонку на всех ширинах. Медиазапросы отзывов перенесены после базового правила, на планшете третий отзыв на всю ширину
- палитра и шкала из методички: primary #2563EB, secondary #7C3AED, accent #F59E0B, текст #1F2937, фон #FFFFFF; Major Third 1.25 от 16px; отступы по 8px grid
- шрифты: Manrope (заголовки), Inter (текст)

Проверка адаптивности (screenshots/320..1920.png): на 320, 375, 768, 1024, 1440, 1920 горизонтального скролла нет, контейнер на 1920 центрирован. Колонки отзывов (getComputedStyle): 1 / 1 / 2 / 3 / 3 / 3.
Скриншоты DevTools (screenshots/devtools/devtools-320..1920.png): интерфейс Chrome DevTools, подключенный к вкладке с опубликованным сайтом; слева трансляция страницы на заданной ширине, справа Elements и Styles; подсказка DevTools "html <ширина> x <высота>" при наведении на <html> подтверждает ширину вьюпорта.
Опубликовано: https://guffy12.github.io/labs/design-lr1/
Доступность: Lighthouse (axe) accessibility 100. WAVE (wave.webaim.org по опубликованной странице, screenshots/wave/):
- до: 0 ошибок, 6 ошибок контраста. 1) номера шагов 01/02/03 - в CSS методички (7.7) primary с opacity .3, это 1.6:1; 2) заголовки секций с анимацией появления (задание 3) до прокрутки имеют opacity: 0, и WAVE считает их текстом без контраста
- исправлено: номера шагов - токен --color-primary-light #3B82F6 без opacity (3.6:1 на светлом и 3.8:1 на тёмном фоне, крупный текст, AA >= 3:1); анимация появления снята с заголовков, карточки и блоки по-прежнему появляются
- после: 0 ошибок, 0 ошибок контраста, 0 предупреждений, AIM 10/10 (wave-index-after.jpg)
Контраст в WebAIM Contrast Checker (screenshots/webaim/, 7 пар): текст 14.67:1, muted на карточке 4.62:1, кнопка accent 6.83:1, кнопка primary 5.16:1, подвал 6.98:1, тёмная тема 16.29:1 и 5.7:1 - все AA.
Lighthouse mobile (медиана из 3): perf 79, a11y 100, bp 96 (404 на favicon.ico, в методичке его нет), seo 91 (reports/lighthouse-mobile.report.html). Порога по Lighthouse в ЛР1 нет; perf тянет вниз блокирующий CSS Google Fonts из шага 6.1, в ЛР2 это исправлено.

Задания:
1. Тёмная тема (js/theme.js + блок в style.css): prefers-color-scheme, кнопка в шапке, выбор в localStorage, переменные из подсказки. Добавлены --color-text-muted #94A3B8 (серый #6B7280 на #1E293B не проходит 4.5:1), шапка и hero с "жесткими" цветами переведены на переменные. theme.js в head, чтобы не было мигания.
   Скрины: task1-dark-1440.png (по кнопке), task1-dark-system-375.png (системная тема)
2. Бургер (js/menu.js): кнопка только < 768px, aria-expanded, полноэкранное меню с ✕, закрытие по ссылке/✕/Escape, body.menu-open { overflow: hidden }, transition opacity + transform. Меню вынесено из header: backdrop-filter у шапки ломает position: fixed у потомков.
   Скрин: task2-menu-open-375.png
3. Скролл (js/scroll.js): IntersectionObserver fade-in + slide-up, параллакс фона hero (translateY 0.4 от скролла), прогресс-бар сверху, prefers-reduced-motion из подсказки + отключение в JS.
   Скрин: task3-scroll-1440.png

Итог: 5 блоков, 3 задания, горизонтального скролла нет ни на одной ширине, a11y 100.


ЛР2. Многостраничный сайт на дизайн-системе

7 страниц (карта сайта из 1.2): index, courses, course, teachers, contacts, blog, post.
- css по 5.1-5.2: tokens -> base -> layout -> components -> pages
- tokens.css: 2.1, 2.2, 2.3 дословно (примитивные + семантические + тёмная тема)
- components.css: 6.1 кнопки, 6.2 карточки, 6.3 поля, 6.4 header, 7.3 переключатель - дословно; дописаны footer, хлебные крошки, пагинация, бейджи, бургер, прогресс-бар
- js/theme.js (7.1) и js/scroll.js (8.1) дословно, CSS анимаций 8.2 дословно в base.css, разметка 8.3 на главной
- js/menu.js - мобильное меню, js/form.js - формы без сервера
- картинки webp 400/800/1600 со srcset (10.1), шрифты с preconnect и display=swap (10.2)

Проверка контраста выявила 2 проблемы в тёмной теме методички, исправлены отдельным блоком в конце tokens.css:
- белый текст на --blue-500 = 3.7:1 -> для фона кнопок токен --color-action-bg (blue-700 в тёмной, 6.7:1)
- ссылка --blue-500 на карточке #1F2937 = 3.99:1 -> в тёмной теме --color-link = #60A5FA (6:1)
Контраст в WebAIM Contrast Checker (screenshots/webaim/, 8 пар): светлая тема - текст 16.97:1, muted 4.83:1, ссылка и кнопка 5.16:1; тёмная - текст 16.97:1, muted 9.96:1, кнопка 6.7:1, ссылка 5.77:1 - все AA.
Правило "компоненты только на семантических токенах" соблюдено: в components/pages нет --blue-*, --gray-*.

Проверки:
- адаптивность 320/375/768/1024/1280/1920 - без горизонтального скролла (screenshots/index-*.png, все страницы *-375 и *-1440)
- Скриншоты DevTools (screenshots/devtools/devtools-<ширина>.png): интерфейс Chrome DevTools, подключенный к вкладке с опубликованным сайтом; слева трансляция страницы на заданной ширине, справа Elements и Styles; подсказка DevTools "html <ширина> x <высота>" при наведении на <html> подтверждает ширину вьюпорта.
- axe (WCAG 2.1 AA) в светлой и тёмной теме, 375 и 1440, все 7 страниц: 0 нарушений
- найдено и исправлено: на courses.html после h1 сразу шли h3 карточек (heading-order) -> скрытый h2 "Каталог курсов"
- клавиатура: видимый фокус (:focus-visible), skip-link, переключатель темы - button (Enter/Space), меню закрывается по Escape, фокус возвращается на бургер
- Lighthouse (10.3), медиана из 3, все 7 страниц: desktop perf 100, mobile perf 99-100; a11y, bp, seo 100 везде (reports/*-mobile|desktop.report.html, скрины 4 категорий: reports/png/)
- первый замер mobile был perf 73-90 (FCP до 4.3 с). Причины и правки, без отступления от 5.2 (5 CSS-файлов) и 10.2 (Google Fonts с preconnect и display=swap):
  1. CSS Google Fonts блокировал отрисовку -> подключен через rel="preload" as="style" + onload, с <noscript>-запасным вариантом; текст сразу рисуется системным шрифтом (display=swap)
  2. LCP-картинка hero была с loading="lazy" (как в примере 10.1) -> fetchpriority="high", sizes исправлен на (min-width: 1024px) 50vw, 100vw (hero в одну колонку до 1024)
  3. первая карточка на courses/teachers/blog (LCP) появлялась анимацией с opacity: 0 и lazy -> без data-animate и lazy, с fetchpriority="high"
  итог mobile: contacts 73 -> 100 (FCP 4.3 -> 0.9 с), index 85 -> 100, courses 85 -> 99, course 88 -> 100, teachers 89 -> 100, post 87 -> 100, blog 90 -> 100
  цена: подмена шрифта после загрузки дает CLS 0.02-0.04 (норма < 0.1)

Задания:
1. 7 страниц, header/footer одинаковые (копированием), активный пункт nav__link--active + aria-current, хлебные крошки на внутренних
2. Тёмная тема: все цвета через переменные, переключатель на каждой странице, localStorage, prefers-color-scheme, transition на body. Скрины: dark-index-1440.png, dark-course-1440.png, dark-contacts-375.png
3. Hover на кнопках/карточках/ссылках, появление при скролле с задержками, прогресс-бар, scroll-behavior: smooth, мобильное меню translateX с transition, prefers-reduced-motion. Скрины: hover-card-1440.png, animate-scroll-1440.png, menu-open-375.png

WAVE (https://guffy12.github.io/labs/design-lr2/, screenshots/wave/):
- до: 0 ошибок, 2 ошибки контраста - заголовки "Наши преимущества" и "Отзывы выпускников" с data-animate="fade" (как в примере 8.3) до появления имеют opacity: 0
- исправлено: анимация снята с этих h2, карточки секций анимируются как раньше
- после: 0 ошибок, 0 ошибок контраста, AIM 9.9/10. 4 предупреждения (не ошибки): 3 "Redundant link" - картинка и заголовок карточки ведут на одну страницу; 1 "Noscript element" - запасное подключение Google Fonts без JS

Итог: 7 страниц, 0 нарушений axe в обеих темах, 0 ошибок WAVE, Lighthouse >= 99 по всем 4 категориям на mobile и desktop.


ЛР3. Core Web Vitals, юзабилити, A/B

Гипотезы (research/README.md):
1. кнопку "Выбрать курс" замечают не сразу - рядом "Как мы учим" того же размера и крупное фото
2. на мобильном не находят форму обратной связи - "Контакты" в бургере, "Войти" ведет туда же и путает
3. форма записи на странице курса на мобильном ниже программы, до "Записаться" приходится листать всю страницу

Замер "до" = сайт из ЛР2 в исходном виде (до правки производительности в самой ЛР2), "после" = lr3/site. Lighthouse локально (serve), mobile и desktop, медиана из 3. Сначала 4 страницы из сценариев, потом добавлены остальные 3 (blog, post, teachers), всего 7.
Публикация: вместо Netlify - GitHub Pages (допускается в 2.1): вариант A https://guffy12.github.io/labs/design-lr3/a/, вариант B https://guffy12.github.io/labs/design-lr3/b/
PageSpeed Insights, вариант A, 15.10.2026 (screenshots/psi/):
- mobile: performance 99, accessibility 100, best practices 96, SEO 100; FCP 1.2 с, LCP 2.1 с, TBT 0 мс, CLS 0, Speed Index 2.4 с
- desktop: 100 / 100 / 96 / 100; FCP 0.2 с, LCP 0.3 с, TBT 0 мс, CLS 0, Speed Index 0.4 с
- полевых данных (INP) нет: у нового сайта нет трафика в CrUX
- best practices 96: ошибка в консоли - тег Clarity с заглушкой ВАШ_ID, уйдет после подстановки ID
- рекомендации Google: срок кеширования (GitHub Pages отдает max-age=600, экономия 169 КиБ при повторном визите), дерево зависимостей в сети; заголовки безопасности (CSP, HSTS, COOP, XFO, Trusted Types) на хостинге GitHub Pages не настраиваются и на оценку не влияют
WebPageTest (Catchpoint), вариант A, 16.10.2026, iPhone 15, Chrome, 4G (9 Мбит/с, RTT 170 мс), Council Bluffs (screenshots/wpt/: summary, filmstrip, waterfall):
- FCP 1.57 с, LCP 1.95 с, CLS 0, TBT 0 мс, TTFB 0.84 с, Start Render 1.6 с, Speed Index 1.69 с
- Document Complete 2.06 с, 176 КБ, 19 запросов
- оценки: Is It Quick - Not Bad (1 блокирующий отрисовку запрос - css/bundle.css), Is It Usable - Looks Great, Is It Resilient - Looks Great (нет блокирующих сторонних запросов)
- waterfall: большая часть TTFB - DNS + TCP + TLS на 4G с RTT 170 мс; шрифты (preload) и hero-картинка (fetchpriority="high") грузятся параллельно сразу после HTML, скрипты с defer не блокируют отрисовку; 19-й запрос - тег Clarity с заглушкой ВАШ_ID отвечает 400
- результат: https://www.catchpoint.com/webpagetest/results?publicurl=https%3A%2F%2Fpublic.catchpoint.com%2FUI%2FEntry%2FWPTITP%2FARFP-D-E-B2AD5HIjfKxhr8AAA-N

Топ проблем "до" (Lighthouse mobile):
- CSS fonts.googleapis.com блокирует отрисовку ~835 мс
- 5 CSS-файлов + theme.js в head блокируют по ~300 мс
- LCP-картинка hero с loading="lazy", 83% LCP - задержка загрузки
- карта: сторонний iframe OpenStreetMap ~575 КБ

Что исправлено (7 проблем):
1. шрифты со своего сервера (woff2, unicode-range, preload кириллицы) вместо Google Fonts
2. знак ₽ тянул latin-ext Inter на 85 КБ -> подмножество только с ₽ через fonttools: 1.2 КБ (на courses LCP 2.93 -> 2.26 с)
3. один css/bundle.css вместо 5 файлов (build-css.sh), исходники остались модульными
4. скрипты с defer (3.4), тема ставится инлайн-сниппетом до отрисовки
5. hero: <picture> avif/webp/jpg, loading="eager", fetchpriority="high", decoding="async" (3.2), исправлен sizes (было 50vw при одной колонке до 1024)
6. первая карточка на courses/teachers/blog без lazy и без data-animate: анимация появления (opacity: 0) давала 2.3 с задержки отрисовки LCP
7. карта - фасад: статичная картинка + кнопка "Открыть интерактивную карту", iframe грузится по клику

До / после, mobile (медиана из 3):
- index:    perf 85 -> 98, LCP 3.37 -> 2.14 с, FCP 3.29 -> 1.51 с, SI 3.29 -> 1.51 с, 318 -> 227 КБ, 26 -> 21 запрос
- courses:  perf 84 -> 98, LCP 3.44 -> 2.26 с, FCP 3.29 -> 1.51 с, 352 -> 267 КБ, 24 -> 19
- course:   perf 88 -> 99, LCP 2.94 -> 1.89 с, FCP 2.94 -> 1.51 с, SI 4.33 -> 1.51 с, 157 -> 140 КБ, 19 -> 14
- contacts: perf 84 -> 99, LCP 3.02 -> 1.97 с, FCP 3.02 -> 1.36 с, SI 5.30 -> 1.36 с, 687 -> 220 КБ, 32 -> 17
- blog:     perf 89 -> 99, LCP 3.00 -> 2.11 с
- post:     perf 87 -> 99, LCP 2.98 -> 1.96 с
- teachers: perf 89 -> 98, LCP 2.99 -> 2.34 с
- TBT 0 мс и CLS 0 до и после; a11y, bp, seo 100 до и после
Desktop: perf 100 до и после на всех 7, CLS на contacts 0.016 -> 0, на blog 0.053 -> 0.
Замеры "после" для blog/post/teachers сняты с копии site/ без сниппета Clarity: с заглушкой ВАШ_ID тег грузится с ошибкой и портит Best Practices.
INP в лабораторном прогоне не измеряется, вместо него TBT (0 мс). INP будет в PageSpeed Insights после публикации (полевые данные).
Цель задания 1 выполнена: LCP < 2.5 с, CLS < 0.1, Lighthouse >= 90 по Performance и Accessibility на всех страницах.
Отчеты: reports/before/*.report.html, reports/after/*.report.html

Clarity (шаг 4): проект WebDesign-Lab3 (ID yyhqe5k1uv, https://clarity.microsoft.com/projects/view/yyhqe5k1uv/dashboard), код из 4.2 вставлен перед </head> во все страницы site/ и site-b/ (16.10.2026 заглушка ВАШ_ID заменена на ID проекта; замеры PSI и WebPageTest выше сняты еще с заглушкой). Добавлено: метка варианта clarity("set", "variant", "A"/"B") и событие cta_click по клику на CTA (js/ab.js).
Замеры "после" сделаны до вставки Clarity.

Юзабилити (шаг 5): research/README.md - портрет участника, 3 сценария из методички, порядок сессии. Шаблоны: protocol.csv (5 участников x 3 сценария), sus-form.md (10 вопросов SUS для Google Forms), sus.csv. sus.py считает SUS по формуле методички (нечетные -1, четные 5-, x2.5) и средний с интерпретацией.

A/B (шаг 6): site/ - вариант A (синяя "Выбрать курс"), site-b/ - вариант B (зеленая #047857 "Начать бесплатно", контраст 5.5:1). Меняется только кнопка, место то же. axe на B - 0 нарушений. Скрины: screenshots/variant-a-*.png, variant-b-*.png.
ab_test.py: среднее, стандартное отклонение и t-тест Уэлча с p-value (проверен на известном примере: t = 1.90, p = 0.108), формулы для Google Sheets в шапке файла (=T.TEST(...; 2; 3)).

Сводная таблица рекомендаций (то, что уже видно по данным Lighthouse):
- LCP > 2.5 с на mobile | Lighthouse | шрифты self-host, preload, bundle.css, fetchpriority | высокий | сделано
- анимация появления на первом экране задерживает LCP | Lighthouse (render delay) | не анимировать first screen | высокий | сделано
- 85 КБ шрифта ради ₽ | Lighthouse (network) | subset шрифта | средний | сделано
- тяжелый iframe карты | Lighthouse (third-party) | фасад | средний | сделано
- гипотезы 1-3 | юзабилити-тест, Clarity | по итогам тестов | - | ждет данных
Матрица Impact/Effort: все 4 сделанных - высокий эффект / низкие усилия ("делать сейчас").


ЛР4. Дизайн-система EduKit и Storybook

EduKit - дизайн-система образовательной платформы (сайт школы, личный кабинет студента, админка расписания).
Принципы: ясность, консистентность, доступность (WCAG 2.1 AA), только токены, расширяемость (README.md).

Токены (tokens/*.json, W3C): colors, typography, spacing, radii, shadows, motion - код 2.2-2.5 дословно, 2.5 разбит на 3 файла по дереву 2.1.
Добавлены семантические токены, без которых не обойтись: background.muted, border.default, action.on-primary, action.danger, feedback.{info,success,warning,error}-{bg,text}.
Style Dictionary 5.5: style-dictionary.config.json из 4.3 дословно. Нюанс: в 5.x CLI по умолчанию ищет config.json, поэтому запуск `style-dictionary build --config style-dictionary.config.json` (npm run tokens). Результат src/styles/tokens.css совпадает с примером 4.3 (ссылки var(--color-primitive-...)).

Storybook: `npx storybook@latest init --type html --builder vite` (10.6, html-vite, addon-docs, addon-a11y). Демо-истории init удалены.
- init не поставил нативный бинарник rolldown (баг npm с optional deps) -> переустановка node_modules
- `serve` для storybook-static не подходит: редиректит iframe.html и теряет ?id= истории; для проверки использован python -m http.server

Компоненты: 21 (все из обязательного минимума 3.1), 70 историй, у каждого папка .js/.css/.stories.js
- Atoms (9): Button (primary/secondary/ghost/danger x sm/md/lg x default/hover/focus/disabled), Input (text/email/password), Checkbox, Radio, Switch, Badge (info/success/warning/error), Icon (12 SVG), Avatar, Spinner
- Molecules (6): FormField, SearchBar, Pagination, Breadcrumbs, Tabs (стрелки по WAI-ARIA), Tooltip (Escape скрывает)
- Organisms (6): Header, Footer, Card (product/article/user), Modal (<dialog>), Table, Form
Button.js, Button.css, Button.stories.js, FormField.js, Card.js, Tokens.stories.js - код методички; отличия подписаны:
- Button.css: #fff заменен на токен action.on-primary (правило 3.2 "только токены", иначе в темной теме нет контраста), добавлен danger
- FormField.js: у label не было for, у input - id, подпись не связана с полем -> добавлены id/for и aria-describedby
- Tokens.stories.js: Colors и Spacing дословно + SemanticColors, Typography, Radii, Shadows

Проверка: все 70 историй прогнаны Playwright + axe (WCAG 2.1 AA) в светлой и темной теме - 0 ошибок консоли, 0 нарушений.
Найдено и исправлено по ходу: у отключенной ссылки пагинации без href запрещен aria-label (добавлен role="link"), заголовки таблицы серым по серому 4.39:1 (сделаны основным цветом).
Скрины: screenshots/stories-light/*.png, stories-dark/*.png (все истории), button-states.png (default/hover/focus/disabled в двух темах), storybook-*.png (интерфейс).

Версионирование: CHANGELOG.md, git (локальный репозиторий в design-system/):
- 201042a Design system - тег v1.0.0 "Initial release" (21 компонент, светлая тема)
- 94e44f8 Dark theme on token level - тег v1.1.0 "Dark theme"

Задания:
1. 21 компонент (надо 5+3+2), истории с вариантами, npm run build-storybook -> storybook-static/. Для GitHub Pages добавлены gh-pages и скрипт deploy-storybook из 8.3.
2. Темная тема: tokens-dark/colors.json, style-dictionary.dark.config.js (include базовых токенов, в файл только переопределения через фильтр is-source, selector :root[data-theme="dark"] - сильнее :root, который импортирует каждый компонент). preview.js - globalTypes и decorators из подсказки. В темной теме primary = blue-400 с темным текстом (6.8:1). Скрин: storybook-dark-buttons.png, storybook-tokens-dark.png
Публичная ссылка на Storybook: https://guffy12.github.io/labs/storybook/ (GitHub Pages, собирается pages.yml при каждом push; аналог npm run deploy-storybook из 8.3)
Монорепо: история перенесена в https://github.com/GuFFy12/labs, теги edukit-v1.0.0 и edukit-v1.1.0 (в общем репо - с префиксом).
3. chromatic.yml из методички, в монорепо перенесен в корень .github/workflows с working-directory design/lr4/design-system (+ workflow_dispatch для ручного запуска). Проект GuFFy12/labs в Chromatic, токен - секрет CHROMATIC_TOKEN. CLI chromatic добавлен в devDependencies: npx без пакета в CI падал с ошибкой npm.
   Проверка регрессии (screenshots/chromatic/), 16.10.2026:
   - Build 4: 22 компонента, 70 историй, все 70 снимков приняты как эталон (build4-baseline-accepted.jpg)
   - Build 5: цвет primary-кнопки заменен на #7c3aed; Chromatic нашел 12 изменений - только истории с primary-кнопкой (Button: Primary, Sizes, Disabled, All Variants и составные компоненты с ней), остальные 58 без изменений (build5-12-changes.jpg); сравнение эталон / новый снимок с подсветкой diff (build5-button-diff.jpg). Workflow Chromatic упал с exit code 1 - регрессия не прошла незамеченной
   - изменения отклонены (Deny all, build5-denied.jpg), цвет возвращен
   - Build 6: 70 снимков совпали с эталоном, Build passed (build6-passed.jpg)
   Storybook в Chromatic: https://www.chromatic.com/builds?appId=6ad1bec1f3aca12257669fe2
   Как автотесты не пускают регрессии: Chromatic снимает каждую историю на каждый push и сравнивает с принятым эталоном; любое изменение пикселей (цвет кнопки, отступ) помечается как change и требует явного Accept, иначе проверка в PR красная.
