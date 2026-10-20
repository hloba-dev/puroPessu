import AxeBuilder from '@axe-core/playwright';
import {expect, test} from '@playwright/test';

const PAGES = [
  '/',
  '/sohvan-pesu',
  '/sohvan-pesu/espoo',
  '/patjan-pesu',
  '/auton-verhoilupesu',
  '/hinnasto',
  '/varaa-aika',
  '/yrityksille',
  '/lahjakortti',
  '/yhteystiedot',
  '/vinkit',
  '/vinkit/punaviinitahra-sohvassa',
  '/tietosuoja',
  '/ru',
  '/ru/chistka-divana',
  '/en/prices'
];
const WIDTHS = [320, 375, 768, 1280, 2560];

test.beforeEach(async ({page}) => {
  await page.addInitScript(() =>
    localStorage.setItem('puro-consent', JSON.stringify({analytics: false, marketing: false, ts: 1}))
  );
});

test.describe('accessibility (axe, WCAG 2.1 A/AA)', () => {
  for (const path of PAGES) {
    test(`no violations on ${path}`, async ({page}) => {
      await page.goto(path);
      // let the hero entrance animation finish so contrast is measured on the final state
      await page.waitForTimeout(1200);
      const results = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(' ')}`);
      expect(summary).toEqual([]);
    });
  }

  test('cookie banner is accessible too', async ({browser}) => {
    // a fresh context without the stored consent, so the banner is shown
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.getByRole('dialog', {name: 'Evästeet'})).toBeVisible();
    const results = await new AxeBuilder({page}).include('[role="dialog"]').analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    await context.close();
  });
});

test.describe('layout', () => {
  test('no horizontal scroll and no console errors from 320 to 2560 px', async ({page}) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`${page.url()} — ${message.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`${page.url()} — ${error.message}`));

    const overflowing: string[] = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({width, height: 900});
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 0) overflowing.push(`${path} @${width}px (+${overflow}px)`);
      }
    }
    expect(overflowing).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('translated pages load without failed requests, and the language switch leads to the same page', async ({page}) => {
    const failed: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
    });
    for (const path of ['/ru/ceny', '/en/business', '/ru/chistka-divana']) {
      await page.goto(path, {waitUntil: 'networkidle'});
    }
    expect(failed).toEqual([]);

    await page.goto('/ru/ceny');
    await page.getByRole('link', {name: 'Suomeksi'}).first().click();
    await expect(page).toHaveURL(/\/hinnasto$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fi');
  });

  test('the hero booking mock sits below the ring at every width', async ({page}) => {
    const overlapping: string[] = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({width, height: 900});
      await page.goto('/');
      // measure the final state, after the entrance animation has moved the mock into place
      await page.waitForTimeout(1200);
      // the 3D ring on wide screens, the native swipe strip on phones
      const ring = await page.locator('[data-paused], [data-carousel="hero"]').filter({visible: true}).first().boundingBox();
      const mock = await page.getByRole('link', {name: 'Avaa varaus: valitse pestävät kalusteet ja vapaa aika'}).boundingBox();
      expect(ring).not.toBeNull();
      expect(mock).not.toBeNull();
      const gap = mock!.y - (ring!.y + ring!.height);
      if (gap < 0) overlapping.push(`@${width}px (${Math.round(-gap)}px over the ring)`);
    }
    expect(overlapping).toEqual([]);
  });

  test('every page has exactly one h1 and a skip link', async ({page}) => {
    for (const path of PAGES) {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#content');
    }
  });
});

test.describe('before/after slider', () => {
  test('works with keyboard, mouse and touch', async ({page}) => {
    await page.goto('/');
    const slider = page.getByRole('slider').first();
    await expect(slider).toHaveAttribute('aria-valuenow', '50');

    // keyboard: arrows move by 5 %, Home / End jump to the ends
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveAttribute('aria-valuenow', '45');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(slider).toHaveAttribute('aria-valuenow', '55');
    await page.keyboard.press('Home');
    await expect(slider).toHaveAttribute('aria-valuenow', '100');
    await page.keyboard.press('End');
    await expect(slider).toHaveAttribute('aria-valuenow', '0');

    // mouse: click anywhere, then drag
    const frame = slider.locator('xpath=ancestor::figure/div[1]');
    const box = (await frame.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
    await expect(slider).toHaveAttribute('aria-valuenow', '75');
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, {steps: 5});
    await page.mouse.up();
    await expect(slider).toHaveAttribute('aria-valuenow', '20');

    // touch: a finger drag is a pointer sequence with pointerType "touch"
    await frame.evaluate((el, rect) => {
      const fire = (type: string, x: number) =>
        el.dispatchEvent(
          new PointerEvent(type, {
            pointerId: 7,
            pointerType: 'touch',
            isPrimary: true,
            bubbles: true,
            button: 0,
            clientX: rect.x + rect.width * x,
            clientY: rect.y + rect.height / 2
          })
        );
      fire('pointerdown', 0.8);
      fire('pointermove', 0.5);
      fire('pointermove', 0.4);
      fire('pointerup', 0.4);
    }, box);
    await expect(slider).toHaveAttribute('aria-valuenow', '60');
  });

  test('the hero ring is frozen under prefers-reduced-motion', async ({browser}) => {
    const context = await browser.newContext({reducedMotion: 'reduce'});
    const page = await context.newPage();
    await page.goto('/');
    const animation = await page.locator('[data-ring]').evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe('none');
    await context.close();
  });
});
