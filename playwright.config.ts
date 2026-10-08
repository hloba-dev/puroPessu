import {defineConfig, devices} from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3210);

/**
 * End-to-end tests run against a production build.
 * Without Supabase env they use the in-memory demo store; with Supabase env (a test project!)
 * the very same tests exercise book_slot() and the exclusion constraint in the database.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'fi-FI',
    timezoneId: 'Europe/Helsinki',
    trace: 'retain-on-failure'
  },
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome'], viewport: {width: 1280, height: 900}}}],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI
  }
});
