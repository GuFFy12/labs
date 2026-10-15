# CodeStart — сайт онлайн-школы

Лабораторная работа 2 по веб-дизайну: многостраничный адаптивный сайт на дизайн-системе.

Запуск: открыть `index.html` или `npx serve .` в этой папке.

## Карта сайта

```
Главная (index.html)
├── Курсы (courses.html)
│   └── Карточка курса (course.html)
├── Преподаватели (teachers.html)
├── Блог (blog.html)
│   └── Статья (post.html)
└── Контакты (contacts.html)
```

## Структура

```
lab2_webdesign/
├── *.html
├── css/
│   ├── tokens.css       # примитивные и семантические токены, тёмная тема
│   ├── base.css         # reset, типографика, анимации появления
│   ├── layout.css       # контейнер, секции, сетки
│   ├── components.css   # кнопки, карточки, поля, header/footer, меню
│   └── pages.css        # стили конкретных страниц
├── js/
│   ├── theme.js         # тёмная тема (localStorage + prefers-color-scheme)
│   ├── menu.js          # мобильное меню
│   ├── scroll.js        # IntersectionObserver + прогресс-бар
│   └── form.js          # отправка форм без сервера
└── img/
    ├── logo.svg
    ├── icons/
    └── photos/          # webp 400/800/1600
```

Порядок CSS: tokens → base → layout → components → pages.

Фото: Unsplash. Иконки: Lucide (ISC).
