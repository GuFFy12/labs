# lr5

![Quality Gate](https://github.com/GuFFy12/labs/actions/workflows/quality-gate.yml/badge.svg)
![Coverage](https://codecov.io/gh/GuFFy12/labs/branch/main/graph/badge.svg)

Учебный сайт кофейни + полный пайплайн контроля качества (лаба 5 по управлению качеством).

```bash
npm ci
npm run lint              # ESLint
npx prettier --check .    # Prettier
npm run test:coverage     # Vitest + покрытие
npx playwright test --project=chromium   # E2E
npm run test:visual:docker               # скриншот-тесты в docker (linux)
npm run build && npx serve -s dist -l 3000 & npx lhci autorun   # Lighthouse
```

Секреты репозитория: `CODECOV_TOKEN`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_TO`.
