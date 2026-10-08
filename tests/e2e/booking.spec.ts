import {expect, test, type Page} from '@playwright/test';

const next = (page: Page) => page.getByTestId('booking-next');
const sum = (page: Page, id: string) => page.getByTestId(`sum-${id}`);

/** A free slot a few days ahead, straight from the availability API (same source the calendar uses). */
async function pickFreeSlot(page: Page, durationMin: number, dayOffset: number) {
  const res = await page.request.get(`/api/availability?duration=${durationMin}`);
  expect(res.ok()).toBeTruthy();
  const {days} = (await res.json()) as {days: Record<string, string[]>};
  const free = Object.entries(days).filter(([, slots]) => slots.length > 0);
  const [date, slots] = free[Math.min(dayOffset, free.length - 1)];
  return {date, time: slots[Math.floor(slots.length / 2)]};
}

async function dismissCookies(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem('puro-consent', JSON.stringify({analytics: false, marketing: false, ts: 1}))
  );
}

async function fillAddress(page: Page, postalCode = '00100') {
  await page.getByLabel('Katuosoite').fill('Testikatu 1 A 2');
  await page.getByLabel('Postinumero').fill(postalCode);
}

async function selectSlot(page: Page, slot: {date: string; time: string}) {
  const month = page.locator('[data-month]');
  await month.waitFor();
  // the day may be in a later month of the calendar
  for (let i = 0; i < 3 && (await month.getAttribute('data-month')) !== slot.date.slice(0, 7); i++) {
    await page.getByRole('button', {name: 'Seuraava kuukausi'}).click();
  }
  await page.locator(`[data-date="${slot.date}"]`).click();
  await page.locator(`[data-time="${slot.time}"]`).click();
}

// every test customer has an own phone number, so each one is a "first order" unless a test says otherwise
let phoneCounter = 0;
const nextPhone = () => `040 55${String(Date.now() % 100000).padStart(5, '0')}${phoneCounter++}`.slice(0, 14);

async function fillContact(page: Page, email: string, phone = nextPhone()) {
  await page.getByLabel('Nimi', {exact: true}).fill('Testi Asiakas');
  await page.getByLabel('Puhelin').fill(phone);
  await page.getByRole('textbox', {name: 'Sähköposti'}).fill(email);
  await page.getByRole('checkbox', {name: /tietosuojaselosteen/}).check();
}

/** Walks the wizard up to the confirmation step with a 3-seater + armchair (199 € before discounts, 100 min). */
async function walkToConfirm(page: Page, slot: {date: string; time: string}, email: string, phone?: string) {
  await page.goto('/varaa-aika?item=sofa-3');
  await expect(sum(page, 'subtotal')).toHaveText('149 €');
  await page.getByRole('button', {name: 'Lisää: Nojatuoli', exact: true}).click();
  await expect(sum(page, 'total')).toHaveText('199 €');
  await next(page).click();

  await fillAddress(page);
  await expect(page.getByTestId('travel-result')).toContainText('Ei matkakuluja (Helsinki)');
  await expect(page.getByLabel('Postitoimipaikka')).toHaveValue('Helsinki');
  await next(page).click();

  await selectSlot(page, slot);
  await next(page).click();

  await fillContact(page, email, phone);
  await next(page).click();
  await expect(page.getByRole('heading', {name: 'Tarkista ja vahvista'})).toBeVisible();
}

test.beforeEach(async ({page}) => {
  await dismissCookies(page);
});

test('books a visit: items → postal code → slot → contact → confirmation, and the booking is stored', async ({page}) => {
  const slot = await pickFreeSlot(page, 100, 3);
  await walkToConfirm(page, slot, `e2e-one-${Date.now()}@example.com`);
  // a new customer: −10 % on the first order (199 € → 179.10 €)
  await expect(sum(page, 'promo')).toHaveText('−19,90 €');
  await expect(sum(page, 'total')).toHaveText('179,10 €');
  await next(page).click();

  await expect(page).toHaveURL(/\/varaa-aika\/kiitos\/[0-9a-f]{64}$/);
  await expect(page.getByRole('heading', {level: 1})).toContainText('varauksesi on vastaanotettu');
  await expect(page.getByTestId('booking-ref')).toHaveText(/^PU-[0-9A-F]{6}$/);
  // the server priced it the same way
  await expect(page.getByTestId('booking-promo')).toHaveText('−19,90 €');
  await expect(page.getByTestId('booking-total')).toHaveText('179,10 €');
  await expect(page.getByTestId('booking-when')).toContainText(slot.time.replace(':', '.'));

  // stored: the calendar file is served for the booking and the slot is no longer offered
  const token = page.url().split('/').pop()!;
  const ics = await page.request.get(`/api/booking/${token}/ics`);
  expect(ics.ok()).toBeTruthy();
  expect(await ics.text()).toContain('BEGIN:VEVENT');

  const after = await page.request.get('/api/availability?duration=100');
  const {days} = (await after.json()) as {days: Record<string, string[]>};
  expect(days[slot.date]).not.toContain(slot.time);
});

test('two customers racing for the same slot: only one booking goes through', async ({browser}) => {
  const first = await browser.newPage();
  const second = await browser.newPage();
  await dismissCookies(first);
  await dismissCookies(second);

  const slot = await pickFreeSlot(first, 100, 5);
  // both reach the confirmation step holding the same, still free slot
  await walkToConfirm(first, slot, `e2e-race-1-${Date.now()}@example.com`);
  await walkToConfirm(second, slot, `e2e-race-2-${Date.now()}@example.com`);

  await next(first).click();
  await expect(first).toHaveURL(/\/varaa-aika\/kiitos\//);

  await next(second).click();
  await expect(second.getByRole('alert').filter({hasText: 'ehti varata'})).toBeVisible();
  // sent back to the calendar, where the slot is gone
  await expect(second.getByRole('heading', {name: 'Valitse aika'})).toBeVisible();
  await second.locator(`[data-date="${slot.date}"]`).click();
  await expect(second.locator(`[data-time="${slot.time}"]`)).toHaveCount(0);

  await first.close();
  await second.close();
});

test('minimum order of 100 € is shown as a separate top-up row', async ({page}) => {
  await page.goto('/varaa-aika?item=armchair');
  await expect(sum(page, 'subtotal')).toHaveText('50 €');
  await expect(sum(page, 'minfill')).toHaveText('50 €');
  await expect(sum(page, 'total')).toHaveText('100 €');

  // no top-up once the order passes the minimum
  await page.getByRole('button', {name: 'Lisää: 2-istuttava sohva', exact: true}).click();
  await expect(sum(page, 'minfill')).toHaveCount(0);
  await expect(sum(page, 'total')).toHaveText('159 €');
});

test('bundle offer: sofa + 4 dining chairs costs the sofa price + 30 €', async ({page}) => {
  // the deep link used by the offer cards on the home page
  await page.goto('/varaa-aika?items=sofa-3:1,chair-full:4');
  await expect(sum(page, 'subtotal')).toHaveText('229 €');
  await expect(sum(page, 'promo')).toHaveText('−50 €');
  await expect(sum(page, 'total')).toHaveText('179 €');
  await expect(page.getByTestId('booking-summary')).toContainText('Pakettitarjous');

  // without the fourth chair the bundle is gone and the 3-item discount applies instead: 5 % of 209 €
  await page.getByRole('button', {name: 'Vähennä: Ruokapöydän tuoli, selkänoja ja istuin', exact: true}).click();
  await expect(sum(page, 'promo')).toHaveText('−10,45 €');
});

test('a returning customer gets 5 % instead of the first-order 10 %', async ({page}) => {
  const phone = nextPhone();
  const email = `e2e-repeat-${Date.now()}@example.com`;
  await walkToConfirm(page, await pickFreeSlot(page, 100, 11), email, phone);
  await expect(sum(page, 'promo')).toHaveText('−19,90 €');
  await next(page).click();
  await expect(page).toHaveURL(/\/varaa-aika\/kiitos\//);

  // the same person books again
  await walkToConfirm(page, await pickFreeSlot(page, 100, 13), email, phone);
  await expect(sum(page, 'promo')).toHaveText('−9,95 €');
  await expect(sum(page, 'total')).toHaveText('189,05 €');
  await expect(page.getByTestId('booking-summary')).toContainText('kanta-asiakas');
});

test('the total is re-checked on confirmation: nothing is booked at a price the customer has not seen', async ({browser}) => {
  // own address for the rate limiter, so this test does not eat the attempts of the others
  const context = () => browser.newContext({extraHTTPHeaders: {'x-forwarded-for': '203.0.113.50'}});
  const first = await (await context()).newPage();
  const second = await (await context()).newPage();
  await dismissCookies(first);
  await dismissCookies(second);
  const phone = nextPhone();
  const email = `e2e-changed-${Date.now()}@example.com`;

  // tab one reaches the confirmation step as a new customer: −10 %
  await walkToConfirm(first, await pickFreeSlot(first, 100, 15), email, phone);
  await expect(sum(first, 'total')).toHaveText('179,10 €');

  // meanwhile the same person completes another booking
  await walkToConfirm(second, await pickFreeSlot(second, 100, 17), email, phone);
  await next(second).click();
  await expect(second).toHaveURL(/\/varaa-aika\/kiitos\//);

  // tab one confirms the stale total: the server now sees a returning customer (−5 %) and asks again
  await next(first).click();
  await expect(first.getByRole('alert').filter({hasText: '189,05 €'})).toBeVisible();
  await expect(first).not.toHaveURL(/kiitos/);
  await expect(sum(first, 'total')).toHaveText('189,05 €');

  await next(first).click();
  await expect(first).toHaveURL(/\/varaa-aika\/kiitos\//);
  await expect(first.getByTestId('booking-total')).toHaveText('189,05 €');

  await first.close();
  await second.close();
});

test('travel fee follows the postal code; outside the service area the booking cannot continue', async ({page}) => {
  await page.goto('/varaa-aika?item=sofa-3');
  await next(page).click();

  await fillAddress(page, '04200');
  await expect(page.getByTestId('travel-result')).toContainText('Matkakulu 25 €');
  await expect(sum(page, 'travel')).toHaveText('25 €');
  await expect(sum(page, 'total')).toHaveText('174 €');
  await expect(next(page)).toBeEnabled();

  await page.getByLabel('Postinumero').fill('33100');
  await expect(page.getByTestId('travel-result')).toContainText('toimialueemme ulkopuolella');
  await expect(next(page)).toBeDisabled();
});

test('a booking can be rescheduled and cancelled from the private manage link', async ({page}) => {
  const slot = await pickFreeSlot(page, 100, 7);
  await walkToConfirm(page, slot, `e2e-manage-${Date.now()}@example.com`);
  await next(page).click();
  await expect(page).toHaveURL(/\/varaa-aika\/kiitos\//);

  await page.getByRole('link', {name: 'Siirrä tai peru varaus'}).click();
  await expect(page).toHaveURL(/\/varaa-aika\/hallinnoi\//);

  await page.getByRole('button', {name: 'Siirrä varaus'}).click();
  const target = await pickFreeSlot(page, 100, 9);
  await selectSlot(page, target);
  await page.getByRole('button', {name: 'Vahvista uusi aika'}).click();
  await expect(page.getByRole('status').filter({hasText: 'Varaus on siirretty'})).toBeVisible();
  await expect(page.getByTestId('booking-when')).toContainText(target.time.replace(':', '.'));

  await page.getByRole('button', {name: 'Peru varaus'}).click();
  await page.getByRole('button', {name: 'Kyllä, peru varaus'}).click();
  await expect(page.getByTestId('booking-status')).toHaveText('Peruttu');
});
