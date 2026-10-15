Управление качеством, ЛР1-5

Репозиторий: https://github.com/GuFFy12/labs (папка qa/), Actions: https://github.com/GuFFy12/labs/actions
Монорепо: GitHub запускает только workflow из корня, поэтому workflow лаб лежат в .github/workflows с working-directory папки лабы:
qa-lr1-tests.yml (ЛР1), qa-lr3-lighthouse.yml (ЛР3), quality-gate.yml (ЛР5). Первый прогон 15.10.2026 - все зеленые.

Проекты: lr1 ... lr5
Окружение: macOS, Node 24, k6 2.3, Docker


ЛР1. ESLint, Prettier, Vitest

- eslint.config.js, src/cart.js, src/cart.test.js, скрипты в package.json
- доустановлен @eslint/js, в package.json "type": "module"
- базовые тесты: 6/6, cart.js 100% строк, 91.66% веток (не покрыт случай без quantity)

Задания:
1. formatCurrency - src/format.js, 8 тестов
2. .github/workflows/test.yml - lint и тесты на push. Node 22 вместо 20 из методички: vitest 5 требует Node ^22.12
3. validateEmail через TDD: сначала тесты (упали, модуля нет), потом реализация
   Красный и зеленый прогон: docs/tdd-1-red.png (Cannot find module './validateEmail.js'), docs/tdd-2-green.png (8 passed)

Итог: 22 теста passed, покрытие 100% строк, 95.23% веток, lint без ошибок. В GitHub Actions (workflow Tests, job lr1-tests) - success.


ЛР2. Playwright

- pages/LoginPage.ts, tests/login.spec.ts
- проекты chromium, firefox, webkit, mobile (Pixel 7)
- login.spec.ts падает: на example.com/login нет формы (404, страница Example Domain), getByLabel('Email') ждет до таймаута 30с

Задания (automationexercise.com):
1. tests/shop.spec.ts: регистрация, поиск, корзина, оформление заказа, выход
2. pages/ProductsPage.ts, pages/CartPage.ts, еще AccountPage.ts и CheckoutPage.ts
3. trace, video, screenshot - retain-on-failure

Реклама на сайте перекрывает кнопки, режется через page.route (utils/blockAds.ts).
В firefox был флак на Proceed To Checkout (клик до загрузки jquery), добавлено ожидание load.

Итог: shop.spec.ts 20/20 passed, login.spec.ts 12 failed.
Разбор падения (screenshots/login-fail-*): goto проходит, fill висит на поиске поля Email, в снапшоте страницы только заголовок и текст, инпутов нет.


ЛР3. Lighthouse CI

Аудит сайта кофейни (vite, npm run build -> dist, serve на 3000).
lighthouserc.json и lighthouse.yml по методичке, в workflow добавлен шаг запуска serve.
GitHub Actions (Lighthouse CI, job lr3-lighthouse): success, ассерты пройдены. Публичный отчет (temporary-public-storage, хранится несколько дней):
https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1792058805924-41757.report.html
копия: reports/ci/lhci-public-report.html

Задание 2, до и после (before/ и корень проекта):
- до: perf 0.65, a11y 0.51, bp 0.96, seo 0.67, LCP 4766 мс, CLS 0.106, вес 5594 КБ
- после: perf 1, a11y 1, bp 1, seo 1, LCP 290 мс, CLS 0, вес 28 КБ
- что сделано: png 5.5 МБ -> webp 23 КБ, srcset, preload, размеры у img, тяжелый скрипт убран из head, контраст, семантика, lang/description/viewport, место под промо-баннер, robots.txt
Отчеты: reports/before, reports/after

Задание 1 (mobile, медиана из 3):
- wikipedia.org: perf 0.91, LCP 1.6 с, TBT 353 мс, CLS 0
- github.com: perf 0.47, LCP 10.7 с, TBT 389 мс, CLS 0.047
- habr.com: perf 0.56, LCP 4.4 с, TBT 571 мс, CLS 0.029
INP в лабораторном прогоне нет, вместо него TBT. Полевые Core Web Vitals (CrUX, 28 дней, mobile) из PageSpeed Insights 14.10.2026 (reports/psi/*.jpg):
- wikipedia.org: LCP 1.3 с, INP 98 мс, CLS 0 - проверка пройдена
- github.com: LCP 3.8 с, INP 301 мс, CLS 0.29 - не пройдена (CLS в красной зоне)
- habr.com (PSI редиректит на /ru/feed/): LCP 3.0 с, INP 268 мс, CLS 0.05 - не пройдена
У реальных пользователей лучший - wikipedia, худший по INP и CLS - github; лабораторный TBT это подтверждает (у github и хабра 380-570 мс). Хуже всех по LCP github, по TBT и весу (21 МБ) хабр.

Задание 3, budget в lighthouserc.json:
- FCP <= 1000 мс
- TBT <= 150 мс
- Speed Index <= 1500 мс
- весь вес <= 300 КБ, картинки <= 150 КБ, JS <= 50 КБ, CSS <= 20 КБ
- запросов <= 15, сторонних 0
Почему: заходят в основном с телефона, JS почти нет, основной вес это hero картинка, в версии до ее и сторонний скрипт и было видно в провале.


ЛР4. K6

load-test.js по методичке. На example.com: errors 100%, /login и /api/auth 404, главная 403 от Cloudflare.
Для остальных тестов локальный стенд server.js (/, /login, POST /api/auth, /health).
load-test.js на example.com запущен коротким профилем (до 5 VU, 40 с): чужой сайт под Cloudflare, полный профиль 50 VU x 4 мин был бы нагрузкой на чужой сервер, а ответы все равно 403/404.
Полный профиль из методички (10 -> 50 VU, 4 мин) - на локальном стенде.
load-test.local.js (тот же скрипт, другой BASE_URL): 25878 запросов, 0% ошибок, p95 8.7 мс.
Шаг 4, веб-дашборд: K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=results/dashboard-report.html k6 run load-test.local.js
- 25902 запроса, 0% ошибок, p95 8.37 мс; скрин http://localhost:5665 во время прогона: results/k6-web-dashboard.png, выгрузка: results/dashboard-report.html

Задание 1, jsonplaceholder, latency-vs-vus.js, по 30с на ступень:
- 1 VU: avg 340, p95 529 мс
- 5 VU: avg 227, p95 464 мс
- 10 VU: avg 136, p95 349 мс
- 20 VU: avg 149, p95 266 мс
- 30 VU: avg 127, p95 204 мс
Ошибок 0. Latency падает с ростом VU: CDN Cloudflare, кэш прогревается. График results/latency-vs-vus.png

Задание 2, stress-test.js, 50 -> 1500 VU:
- до 300 VU (1200 RPS): p95 auth 8-20 мс, ошибок 0
- 400 VU (1500 RPS): точка деградации, p95 44-55 мс, первые 503
- 690 VU: 10% ошибок
- 959 VU: тест остановлен abortOnFail
Узкое место pbkdf2 в пуле потоков libuv (4 потока). График results/stress.png

Задание 3, soak-test.js, 30 мин, 30 VU:
Два стенда: LEAK=1 (сессии не удаляются) и обычный (TTL 60с). Память снималась с /health каждые 10с.
- с утечкой: heap 10 -> 93 -> 179 -> 268 -> 354 -> 444 -> 510 МБ (каждые 5 мин), 51704 сессии
- без утечки: heap держится около 28 МБ, около 1800 сессий
- latency у обоих одинаковая, p95 около 13.5 мс, ошибок 0
Утечка видна только по памяти, рост около 17 МБ/мин.
RSS в прогоне с утечкой меньше heap (510 МБ heap при RSS 17-101 МБ): macOS сжимает и выгружает в swap страницы, к которым процесс не обращается, а утекшие сессии никто не читает. RSS - только резидентная память, heapUsed - реальный объем живых объектов V8. Проверка: на 15000 сессий vmmap показывает 69 МБ уже в swap/compressed, swap системы занят на 1.4 ГБ. Поэтому утечку оцениваем по heapUsed, RSS для этого на macOS не годится. Графики results/soak-leak.png, results/soak-fixed.png


ЛР5. GitHub Actions

Проект: сайт из ЛР3 + страницы login и dashboard, юнит-тесты из ЛР1, LoginPage и login.spec.ts из ЛР2 (goto на /login), lighthouserc.json из ЛР3.
quality-gate.yml по методичке. Изменения:
- node-version 22 вместо 20: vitest 5 требует Node ^22.12
- peaceiris/actions-gh-pages v3 -> v4 (v3 на node16), permissions: contents: write
- coverage выгружается в артефакты
- в playwright webServer serve без -s, иначе /login отдает index.html

Локальный прогон: lint ok, prettier ok, 27 юнит-тестов, e2e 18/18, visual 3/3, lhci ok, actionlint ok.

Задание 1: jobs связаны через needs, summary падает если lint/unit/e2e/visual не success.
Защита ветки main (шаг 2): Require status checks - lint, unit-tests, e2e-tests (chromium), e2e-tests (firefox), e2e-tests (webkit), lighthouse; Require branches to be up to date - включено.
Первый прогон на main: lint, unit-tests, e2e x3, visual-tests, lighthouse, summary, deploy-reports - success.
Проверка блокировки: PR #1 https://github.com/GuFFy12/labs/pull/1 - в cart.test.js намеренно 300 вместо 250. unit-tests: failure, e2e/visual/lighthouse: skipped, summary: failure, merge в main заблокирован (docs/pr-merge-blocked.jpg - блок merge в PR: required unit-tests упал, e2e ждут, кнопка Merge неактивна; docs/pr-merge-blocked-tooltip.png - "Merging is blocked due to failing merge requirements"; docs/pr-blocked-checks.jpg; docs/pr-blocked.png - вывод gh: mergeStateStatus BLOCKED).
Отчеты на GitHub Pages (шаг 3): https://guffy12.github.io/labs/qa-reports/coverage-report/ - deploy-reports пишет в папку qa-reports ветки gh-pages (keep_files), на PR не запускается: отчеты невлитой ветки не публикуем, и peaceiris на событии pull_request падает.
Бейджи (шаг 4): README.md в корне и в qa/lr5 - GuFFy12/labs.

Задание 2: Playwright screenshot-тесты (e2e/visual/visual.spec.ts): главная, логин, форма с ошибкой. Эталоны снимаются в docker образе playwright, в CI тот же образ.
Проверка: изменен цвет и padding кнопки - 2 из 3 упали (17025 pixels different). Diff: docs/visual-login-diff.png

Задание 3: schedule cron '0 6 * * *' + workflow_dispatch, job nightly-report отправляет письмо через dawidd6/action-send-mail со статусами этапов.
Проверка 15.10.2026: секреты MAIL_USERNAME, MAIL_PASSWORD (пароль приложения Gmail), MAIL_TO заданы; nightly-report срабатывает по расписанию и при ручном запуске.
Ручной запуск Quality Gate #12: все этапы success, письмо "Nightly Quality Gate: success (GuFFy12/labs)" отправлено (docs/nightly-run.jpg, docs/nightly-send-report.jpg - логин, пароль и адресат в логе скрыты ***; docs/nightly-email.png - полученное письмо, адрес отправителя закрыт).
