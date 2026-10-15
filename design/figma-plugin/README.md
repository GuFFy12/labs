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
