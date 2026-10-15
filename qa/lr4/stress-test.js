// Задание 2: stress-test — растим нагрузку ступенями, пока стенд не начнёт отказывать
// тест сам остановится, когда ошибок станет больше 10% (abortOnFail)
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '30s', target: 100 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 300 },
        { duration: '30s', target: 400 },
        { duration: '30s', target: 600 },
        { duration: '30s', target: 800 },
        { duration: '30s', target: 1000 },
        { duration: '30s', target: 1500 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        errors: [{ threshold: 'rate<0.1', abortOnFail: true, delayAbortEval: '10s' }],
    },
};

export default function () {
    const home = http.get(`${BASE_URL}/`);
    check(home, { 'home status is 200': (r) => r.status === 200 });

    const res = http.post(
        `${BASE_URL}/api/auth`,
        JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        { headers: { 'Content-Type': 'application/json' } },
    );
    authDuration.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    check(res, { 'auth status is 200': (r) => r.status === 200 });

    sleep(0.5);
}
