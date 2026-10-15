import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Кастомные метрики
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');

// Конфигурация нагрузки
export const options = {
    stages: [
        { duration: '30s', target: 10 },   // разогрев до 10 VU
        { duration: '1m', target: 50 },    // рост до 50 VU
        { duration: '2m', target: 50 },    // удержание
        { duration: '30s', target: 0 },    // спад
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],   // 95% запросов < 500ms
        errors: ['rate<0.01'],              // < 1% ошибок
    },
};

// то же самое, что load-test.js, только стучимся в локальный стенд (server.js)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
    // 1. Главная страница
    const homeRes = http.get(`${BASE_URL}/`);
    check(homeRes, {
        'home status is 200': (r) => r.status === 200,
        'home loads < 1s': (r) => r.timings.duration < 1000,
    });

    // 2. Страница логина
    const loginPage = http.get(`${BASE_URL}/login`);
    check(loginPage, {
        'login page status 200': (r) => r.status === 200,
    });

    // 3. API-запрос
    const start = Date.now();
    const apiRes = http.post(`${BASE_URL}/api/auth`, JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    loginDuration.add(Date.now() - start);
    errorRate.add(apiRes.status !== 200);

    sleep(1);
}
