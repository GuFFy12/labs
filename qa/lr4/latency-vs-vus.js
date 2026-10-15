// Задание 1: зависимость latency от количества VU на публичном API
// 5 ступеней подряд: 1, 5, 10, 20, 30 VU по 30 секунд, у каждой свой сценарий
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const LEVELS = [1, 5, 10, 20, 30];
const STEP = 30; // секунд на ступень
const PAUSE = 5; // пауза между ступенями

const scenarios = {};
LEVELS.forEach((vus, i) => {
    scenarios[`vus_${vus}`] = {
        executor: 'constant-vus',
        vus,
        duration: `${STEP}s`,
        startTime: `${i * (STEP + PAUSE)}s`,
        tags: { level: String(vus) },
    };
});

export const options = {
    scenarios,
    thresholds: {
        // чтобы k6 вывел p95 по каждой ступени отдельно
        ...Object.fromEntries(LEVELS.map((v) => [`http_req_duration{level:${v}}`, ['p(95)<1000']])),
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/posts/${Math.floor(Math.random() * 100) + 1}`);
    check(res, { 'status is 200': (r) => r.status === 200 });
    sleep(1);
}
