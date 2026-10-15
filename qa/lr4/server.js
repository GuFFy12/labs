// Локальный стенд для нагрузочных тестов (чтобы не грузить чужие сайты)
// GET /, GET /login, POST /api/auth, GET /health
// LEAK=1 — сессии копятся в памяти и никогда не удаляются (утечка для soak-теста)
import http from 'node:http';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT) || 3000;
const LEAK = process.env.LEAK === '1';
const MAX_PENDING = Number(process.env.MAX_PENDING) || 100; // очередь на "проверку пароля"
const SESSION_TTL_MS = 60_000;

const sessions = new Map();
let pending = 0;

const page = (title) =>
    `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title></head>` +
    `<body><h1>${title}</h1><form><label>Email <input name="email"></label>` +
    `<label>Password <input name="password" type="password"></label><button>Войти</button></form></body></html>`;

const hashPassword = (password) =>
    new Promise((resolve, reject) => {
        // "дорогая" операция, выполняется в пуле потоков libuv (4 потока)
        crypto.pbkdf2(password, 'salt', 20000, 32, 'sha256', (err, key) =>
            err ? reject(err) : resolve(key),
        );
    });

const readBody = (req) =>
    new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => resolve(data));
    });

const send = (res, status, body, type = 'application/json') => {
    res.writeHead(status, { 'Content-Type': type });
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
};

// без утечки: протухшие сессии чистим раз в 5 секунд
if (!LEAK) {
    setInterval(() => {
        const now = Date.now();
        for (const [token, s] of sessions) {
            if (now - s.createdAt > SESSION_TTL_MS) sessions.delete(token);
        }
    }, 5000).unref();
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') return send(res, 200, page('Главная'), 'text/html');
    if (req.method === 'GET' && req.url === '/login') return send(res, 200, page('Вход'), 'text/html');

    if (req.method === 'GET' && req.url === '/health') {
        const mem = process.memoryUsage();
        return send(res, 200, {
            heapUsedMb: +(mem.heapUsed / 1024 / 1024).toFixed(1),
            rssMb: +(mem.rss / 1024 / 1024).toFixed(1),
            sessions: sessions.size,
            pending,
        });
    }

    if (req.method === 'POST' && req.url === '/api/auth') {
        if (pending >= MAX_PENDING) {
            return send(res, 503, { error: 'Server is overloaded' });
        }
        pending++;
        try {
            const body = JSON.parse((await readBody(req)) || '{}');
            await hashPassword(body.password || '');
            const token = crypto.randomUUID();
            // в сессии лежит "профиль" ~10 КБ
            sessions.set(token, {
                email: body.email,
                createdAt: Date.now(),
                profile: crypto.randomBytes(5000).toString('hex'),
            });
            return send(res, 200, { token });
        } catch {
            return send(res, 400, { error: 'Bad request' });
        } finally {
            pending--;
        }
    }

    send(res, 404, { error: 'Not found' });
});

server.keepAliveTimeout = 65_000;
server.listen(PORT, () => {
    console.log(`server on http://localhost:${PORT} (leak: ${LEAK}, max pending: ${MAX_PENDING})`);
});
