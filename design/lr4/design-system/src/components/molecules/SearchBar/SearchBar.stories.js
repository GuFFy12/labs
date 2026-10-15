import { createSearchBar } from './SearchBar';
import './SearchBar.css';

export default {
    title: 'Molecules/SearchBar',
    tags: ['autodocs'],
    render: (args) => createSearchBar(args),
};

export const Default = { args: { placeholder: 'Поиск курсов', buttonLabel: 'Найти' } };
export const Catalog = { args: { placeholder: 'Python, дизайн, аналитика…', buttonLabel: 'Искать' } };
