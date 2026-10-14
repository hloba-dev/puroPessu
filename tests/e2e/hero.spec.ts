import {expect, test, type Locator, type Page} from '@playwright/test';
import {dismissCookies} from './helpers';

// iPhone 14 in Safari: 390 CSS px wide, ~664 px of the page visible above the browser chrome
const PHONE = {width: 390, height: 664};
const STICKY_BAR = 64;
// the hero entrance animation (0.7 s + staggered delays) shifts the elements by a few px
const ENTRANCE_MS = 1400;

const hero = (page: Page) => page.locator('section[aria-labelledby="hero-title"]');

/** A real touch gesture through the DevTools protocol, so touch-action and page scrolling behave as on a phone. */
async function swipe(page: Page, from: {x: number; y: number}, to: {x: number; y: number}, steps = 8) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [from]});
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t}]
    });
  }
  await cdp.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await cdp.detach();
}

async function centerOf(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return {x: box!.x + box!.width / 2, y: box!.y + box!.height / 2, box: box!};
}

/** Scrolls the hero slider to the middle of the screen, clear of the fixed header and bottom bar. */
async function showSlider(page: Page) {
  await page.waitForTimeout(ENTRANCE_MS);
  await hero(page)
    .getByRole('img')
    .first()
    .evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}));
  await page.waitForTimeout(100);
  return page.evaluate(() => window.scrollY);
}

test.describe('home hero on a phone', () => {
  test.use({viewport: PHONE, isMobile: true, hasTouch: true});

  test.beforeEach(async ({page}) => {
    await dismissCookies(page);
  });

  for (const path of ['/', '/ru', '/en']) {
    test(`${path}: headline, before/after photo and the booking button fit above the bottom bar`, async ({page}) => {
      await page.goto(path);
      await page.waitForTimeout(ENTRANCE_MS);
      const fold = PHONE.height - STICKY_BAR;

      const h1 = hero(page).getByRole('heading', {level: 1});
      // the "before" image fills the slider frame, so its box is the frame's box
      const photo = hero(page).getByRole('img').first();
      const cta = hero(page).getByRole('link').first();

      for (const [name, el] of [
        ['h1', h1],
        ['photo', photo],
        ['cta', cta]
      ] as const) {
        const box = await el.boundingBox();
        expect(box, name).not.toBeNull();
        expect(box!.y, `${name} top`).toBeGreaterThanOrEqual(0);
        expect(box!.y + box!.height, `${name} bottom`).toBeLessThanOrEqual(fold);
      }
      // reading order on the screen: headline → photo → booking button
      const [h1Box, photoBox, ctaBox] = await Promise.all([h1.boundingBox(), photo.boundingBox(), cta.boundingBox()]);
      expect(h1Box!.y + h1Box!.height).toBeLessThanOrEqual(photoBox!.y);
      expect(photoBox!.y + photoBox!.height).toBeLessThanOrEqual(ctaBox!.y);
    });
  }

  test('a finger on the photo scrolls the page and leaves the divider alone', async ({page}) => {
    await page.goto('/');
    const scrolled = await showSlider(page);
    const handle = hero(page).getByRole('slider');
    const initial = await handle.getAttribute('aria-valuenow');
    expect(initial).toBe('50');

    const {box} = await centerOf(hero(page).getByRole('img').first());
    // a touch on the photo well away from the handle
    const start = {x: box.x + box.width * 0.15, y: box.y + box.height * 0.3};

    // a sideways swipe across the photo: not a drag of the handle
    await swipe(page, start, {x: start.x + 140, y: start.y});
    await expect(handle).toHaveAttribute('aria-valuenow', initial!);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);

    // a mostly vertical swipe, as when scrolling past the hero
    await swipe(page, {x: start.x, y: start.y + 80}, {x: start.x + 40, y: start.y - 160});
    await expect(handle).toHaveAttribute('aria-valuenow', initial!);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrolled + 40);
  });

  test('dragging the handle moves the divider', async ({page}) => {
    await page.goto('/');
    const scrolled = await showSlider(page);
    const handle = hero(page).getByRole('slider');
    const {x, y} = await centerOf(handle);

    await swipe(page, {x, y}, {x: x + 80, y});
    // aria-valuenow is the share of the "after" photo: the divider moved right, so less of it shows
    await expect.poll(async () => Number(await handle.getAttribute('aria-valuenow'))).toBeLessThan(40);
    // the handle followed the finger instead of jumping to it
    const moved = await centerOf(handle);
    expect(Math.abs(moved.x - (x + 80))).toBeLessThan(6);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
  });
});

test.describe('call button on a desktop', () => {
  test.use({viewport: {width: 1280, height: 900}});

  test('the header shows the phone number as a tel: link', async ({page}) => {
    await dismissCookies(page);
    await page.goto('/');
    const call = page.locator('header').getByRole('link', {name: /Soita/});
    await expect(call).toBeVisible();
    await expect(call).toHaveAttribute('href', /^tel:\+358/);
    await expect(call).toContainText('+358');
  });

  test('on a narrower laptop the capsule keeps the call button as an icon and does not overflow', async ({page}) => {
    await dismissCookies(page);
    await page.setViewportSize({width: 1100, height: 800});
    await page.goto('/');
    const call = page.locator('header').getByRole('link', {name: /Soita/});
    await expect(call).toBeVisible();
    await expect(call.locator('span')).toBeHidden();
    const pill = page.locator('header > div');
    expect(await pill.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(0);
  });
});
