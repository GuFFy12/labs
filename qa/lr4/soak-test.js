// Задание 3: soak-test — 30 минут постоянной нагрузки
// параллельно раз в 10 секунд снимаем память сервера с /health
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');
const heapUsed = new Trend('server_heap_mb');
const rss = new Trend('server_rss_mb');
const sessions = new Trend('server_sessions');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
    scenarios: {
        soak: {
            executor: 'ramping-vus',
            exec: 'users',
            stages: [
                { duration: '1m', target: 30 },   // разгон
                { duration: '28m', target: 30 },  // постоянная нагрузка
                { duration: '1m', target: 0 },    // спад
            ],
        },
        monitor: {
            executor: 'constant-arrival-rate',
            exec: 'monitor',
            rate: 1,
            timeUnit: '10s',
            duration: '30m',
            preAllocatedVUs: 1,
        },
    },
    thresholds: {
        'http_req_duration{scenario:soak}': ['p(95)<500'],
        errors: ['rate<0.01'],
    },
};

export function users() {
    http.get(`${BASE_URL}/`);

    const res = http.post(
        `${BASE_URL}/api/auth`,
        JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        { headers: { 'Content-Type': 'application/json' } },
    );
    authDuration.add(res.timings.duration);
    errorRate.add(res.status !== 200);
    check(res, { 'auth status is 200': (r) => r.status === 200 });

    sleep(1);
}

export function monitor() {
    const res = http.get(`${BASE_URL}/health`);
    if (res.status === 200) {
        const h = res.json();
        heapUsed.add(h.heapUsedMb);
        rss.add(h.rssMb);
        sessions.add(h.sessions);
    }
}
