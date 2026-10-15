import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['html', { open: 'never' }], ['list']],
    // эталонные скриншоты без суффикса платформы — снимаются только в linux (docker / CI)
    snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        {
            name: 'visual',
            testDir: './e2e/visual',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    // без -s: иначе serve отдаёт index.html на /login и /dashboard
    webServer: {
        command: 'npm run build && npx serve dist -l 4173',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
    },
});
