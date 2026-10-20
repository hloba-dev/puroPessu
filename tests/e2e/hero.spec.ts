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

  test('the promises sit under the buttons, the fake booking widget is gone and the header hides while reading', async ({page}) => {
    await page.goto('/');
    await page.waitForTimeout(ENTRANCE_MS);
    const trust = hero(page).getByRole('list', {name: 'Lupauksemme'});
    await expect(trust).toBeVisible();
    await expect(trust.getByRole('listitem')).toHaveCount(3);
    const cta = hero(page).getByRole('link', {name: 'Varaa aika'}).first();
    const [ctaBox, trustBox] = await Promise.all([cta.boundingBox(), trust.boundingBox()]);
    expect(trustBox!.y).toBeGreaterThan(ctaBox!.y + ctaBox!.height - 1);
    await expect(page.getByRole('link', {name: 'Avaa varaus: valitse pestävät kalusteet ja vapaa aika'})).toBeHidden();

    // the header capsule slides away on the way down and returns on the first scroll up
    const header = page.locator('header');
    await expect(header).toHaveAttribute('data-hidden', 'false');
    // separate frames, as with a real thumb: scrolls inside one frame coalesce into a single event
    await page.evaluate(() => window.scrollTo({top: 600, behavior: 'instant'}));
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo({top: 900, behavior: 'instant'}));
    await expect(header).toHaveAttribute('data-hidden', 'true');
    await page.waitForTimeout(100);
    await page.evaluate(() => window.scrollTo({top: 850, behavior: 'instant'}));
    await expect(header).toHaveAttribute('data-hidden', 'false');
  });

  test('"back to top" appears after two screens and scrolls to the top', async ({page}) => {
    await page.goto('/');
    const top = page.locator('[data-back-to-top]');
    await expect(top).toHaveAttribute('data-shown', 'false');
    await page.evaluate(() => window.scrollTo({top: 3000, behavior: 'instant'}));
    await expect(top).toHaveAttribute('data-shown', 'true');
    await expect(top).toHaveAccessibleName('Takaisin ylös');
    await top.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
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

test.describe('carousels on a phone', () => {
  test.use({viewport: PHONE, isMobile: true, hasTouch: true});

  test.beforeEach(async ({page}) => {
    await dismissCookies(page);
  });

  test('the hero strip swipes sideways, snaps to a card and never blocks vertical scrolling', async ({page}) => {
    await page.goto('/');
    await page.waitForTimeout(ENTRANCE_MS);
    const strip = page.locator('[data-carousel="hero"]');
    await expect(strip).toBeVisible();
    // the 3D ring is for wide screens only: on a phone the strip replaces it
    await expect(page.locator('[data-paused]')).toBeHidden();

    const track = strip.locator('ul');
    await track.evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}));
    await page.waitForTimeout(100);
    const scrolled = await page.evaluate(() => window.scrollY);
    const box = (await track.boundingBox())!;

    // the third card peeks in from the right edge: an obvious hint that the strip scrolls
    const third = (await track.locator('li').nth(2).boundingBox())!;
    expect(third.x).toBeLessThan(PHONE.width);
    expect(third.x + third.width).toBeGreaterThan(PHONE.width);
    const dots = strip.getByRole('button', {name: /^Kuva \d+\/\d+$/});
    await expect(dots.first()).toHaveAttribute('aria-current', 'true');

    const start = {x: box.x + box.width * 0.7, y: box.y + box.height / 2};
    await swipe(page, start, {x: start.x - 220, y: start.y});
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
    await expect(dots.first()).not.toHaveAttribute('aria-current', 'true');
    // once the fling has settled, some card's left edge sits exactly on the padding (snapped)
    await expect
      .poll(() =>
        track.evaluate((el) => {
          const pad = parseFloat(getComputedStyle(el).paddingLeft);
          return Math.min(...[...el.children].map((card) => Math.abs((card as HTMLElement).offsetLeft - pad - el.scrollLeft)));
        })
      )
      .toBeLessThan(2);

    // a mostly vertical swipe over the cards scrolls the page as usual
    await swipe(page, {x: start.x, y: start.y + 60}, {x: start.x + 30, y: start.y - 160});
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrolled + 40);
  });

  test('the "how it works" steps swipe one by one on a phone', async ({page}) => {
    await page.goto('/');
    const steps = page.locator('[data-carousel="steps"]');
    const track = steps.locator('ol');
    await track.evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}));
    await page.waitForTimeout(ENTRANCE_MS);
    const firstTitle = (await track.locator('li h3').first().textContent())!;
    await expect(steps.locator('button[aria-current="true"]')).toHaveAttribute('aria-label', firstTitle);
    const first = (await track.locator('li').first().boundingBox())!;
    const start = {x: first.x + first.width * 0.5, y: first.y + first.height * 0.5};
    await swipe(page, start, {x: start.x - 200, y: start.y});
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(150);
    await expect(steps.locator('button[aria-current="true"]')).not.toHaveAttribute('aria-label', firstTitle);
  });

  test('the before/after gallery swipes to the next slide and the dots show the position', async ({page}) => {
    await page.goto('/');
    const gallery = page.locator('[data-carousel="gallery"]');
    const track = gallery.locator('ul');
    await track.evaluate((el) => el.scrollIntoView({block: 'center', behavior: 'instant'}));
    await page.waitForTimeout(ENTRANCE_MS);
    const scrolled = await page.evaluate(() => window.scrollY);
    const first = (await track.locator('li').first().boundingBox())!;
    const dots = gallery.getByRole('button', {name: /^Kuva \d+\/\d+$/});
    await expect(dots.first()).toHaveAttribute('aria-current', 'true');

    // a swipe across the photo, away from the slider handle in the middle
    const start = {x: first.x + first.width * 0.25, y: first.y + first.height * 0.3};
    await swipe(page, start, {x: start.x - 200, y: start.y});
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(150);
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
    expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
    // the divider of the slider stayed put
    await expect(track.getByRole('slider').first()).toHaveAttribute('aria-valuenow', '50');

    // a dot jumps straight to its slide
    await dots.nth(3).click();
    await expect(dots.nth(3)).toHaveAttribute('aria-current', 'true');
  });
});

test.describe('hero ring on a desktop', () => {
  test.use({viewport: {width: 1280, height: 900}});

  test('the arrows and ← → turn the ring by one card, hovering pauses the spin', async ({page}) => {
    await dismissCookies(page);
    await page.goto('/');
    await page.waitForTimeout(ENTRANCE_MS);
    const ring = page.locator('[data-paused]');
    await expect(ring).toBeVisible();
    await expect(page.locator('[data-carousel="hero"]')).toBeHidden();
    await expect(ring).toHaveAttribute('data-turn', '0');

    await ring.getByRole('button', {name: 'Seuraava'}).click();
    await expect(ring).toHaveAttribute('data-turn', '1');
    await page.keyboard.press('ArrowRight');
    await expect(ring).toHaveAttribute('data-turn', '2');
    await page.keyboard.press('ArrowLeft');
    await expect(ring).toHaveAttribute('data-turn', '1');
    await ring.getByRole('button', {name: 'Edellinen'}).click();
    await expect(ring).toHaveAttribute('data-turn', '0');
    // the mouse is over the ring after the click: the endless spin is paused meanwhile
    expect(await ring.locator('[data-ring]').evaluate((el) => getComputedStyle(el).animationPlayState)).toBe('paused');
  });
});
