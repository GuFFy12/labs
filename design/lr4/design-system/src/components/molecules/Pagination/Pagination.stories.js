import { createPagination } from './Pagination';
import './Pagination.css';

export default {
    title: 'Molecules/Pagination',
    tags: ['autodocs'],
    argTypes: {
        total: { control: { type: 'number', min: 1, max: 10 } },
        current: { control: { type: 'number', min: 1, max: 10 } },
    },
    render: (args) => createPagination(args),
};

export const FirstPage = { args: { total: 5, current: 1 } };
export const Middle = { args: { total: 5, current: 3 } };
export const LastPage = { args: { total: 5, current: 5 } };
