import {expect, test, type Page} from '@playwright/test';
import {dismissCookies, fillAddress, pickFreeSlot, selectSlot, showMonthOf} from './helpers';

// A phone: the sticky bar with "Varaa aika" is shown, the wizard's next button sits in the bottom bar
// and the calendar stacks above the list of free times.
test.use({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true});

const nextMobile = (page: Page) => page.getByTestId('booking-next-mobile');

/** Items → address → the "Valitse aika" step, on a phone. */
async function walkToTime(page: Page) {
  await page.goto('/varaa-aika?item=sofa-3');
  await nextMobile(page).click();
  await fillAddress(page);
  await expect(page.getByTestId('travel-result')).toContainText('Ei matkakuluja (Helsinki)');
  await nextMobile(page).click();
  await expect(page.getByRole('heading', {name: 'Valitse aika'})).toBeVisible();
}

test.beforeEach(async ({page}) => {
  await dismissCookies(page);
});

test('"Varaa aika" tapped at the bottom of the home page opens the booking page at its top, not at the FAQ', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo({top: document.body.scrollHeight, behavior: 'instant'}));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

  await page.locator('[data-sticky-bar]').getByRole('link', {name: /Varaa aika/}).click();
  await expect(page.getByRole('heading', {level: 1, name: 'Varaa aika'})).toBeAttached();
  // Next 16 keeps the smooth scrolling of globals.css during the transition unless the page opts out;
  // a smooth scroll-to-top is interrupted on phones and the page stays scrolled to its bottom (the FAQ)
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator('html')).toHaveAttribute('data-scroll-behavior', 'smooth');
});

test('tapping a day brings its free times into view', async ({page}) => {
  // not the first free day: that one is selected on load, and only a tap should scroll
  const slot = await pickFreeSlot(page, 100, 3);
  await walkToTime(page);
  await showMonthOf(page, slot.date);

  await page.locator(`[data-date="${slot.date}"]`).click();
  const heading = page.getByRole('heading', {name: /^Vapaat ajat:/});
  await expect(heading).toBeVisible();
  await expect.poll(async () => (await heading.boundingBox())?.y ?? Infinity, {timeout: 3000}).toBeLessThan(200);
});

test('choosing a time moves straight on to the contact step', async ({page}) => {
  const slot = await pickFreeSlot(page, 100, 3);
  await walkToTime(page);

  await selectSlot(page, slot);
  await expect(page.locator('[data-booking-wizard]').getByRole('heading', {level: 2, name: 'Yhteystiedot'})).toBeVisible();
  // the chosen time is kept and shown in the running summary
  await expect(page.getByTestId('booking-summary')).toContainText(slot.time.replace(':', '.'));
});
