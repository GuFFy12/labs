import { createCard, createProductCard, createArticleCard, createUserCard } from './Card';
import './Card.css';

const COURSE = 'card-course.webp';
const POST = 'card-post.webp';
const TEACHER = 'avatar.webp';

export default {
    title: 'Organisms/Card',
    tags: ['autodocs'],
    render: (args) => createCard(args),
};

export const Default = {
    args: {
        image: COURSE,
        title: 'Frontend-разработчик',
        text: 'Вёрстка, JavaScript и React: от первой страницы до SPA',
        actionLabel: 'Подробнее',
    },
};

export const Product = {
    args: {
        image: COURSE,
        title: 'Frontend-разработчик',
        text: '8 месяцев, наставник и 5 проектов в портфолио',
        price: '6 900 ₽/мес',
        badge: 'С нуля',
    },
    render: (args) => createProductCard(args),
};

export const Article = {
    args: {
        image: POST,
        title: 'Как найти первую работу в IT без опыта',
        text: 'Что смотрит работодатель в резюме джуна',
        date: '12 сентября 2026',
        readTime: '7 мин',
    },
    render: (args) => createArticleCard(args),
};

export const User = {
    args: {
        image: TEACHER,
        title: 'Елена Иванова',
        role: 'Frontend-разработчик',
        text: '10 лет в разработке, тимлид фронтенда в финтехе',
    },
    render: (args) => createUserCard(args),
};
