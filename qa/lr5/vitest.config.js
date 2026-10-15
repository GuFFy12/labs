import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['src/**/*.test.js'],
        coverage: {
            include: ['src/**/*.js'],
            // DOM-обвязка страниц проверяется e2e-тестами, в юнит-покрытие не считаем
            exclude: ['src/main.js', 'src/login.js', 'src/dashboard.js', 'src/**/*.test.js'],
            reporter: ['text', 'html', 'lcov'],
            thresholds: {
                lines: 80,
                branches: 80,
            },
        },
    },
});
