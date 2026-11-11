import {expect, test, type Page} from '@playwright/test';
import {dismissCookies, fillAddress, pickFreeSlot, selectSlot} from './helpers';

/**
 * What the site hands to Google's tags (Consent Mode v2). Google Ads measures correctly only when
 * these signals are right, so they are pinned down here. Every request to Google is blocked: the tests
 * look at the dataLayer the site fills itself, not at what a third party does with it.
 */

const GOOGLE = /googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices\.com|googlesyndication\.com|google\.[a-z.]+\/(pagead|ccm|rmkt)/;
const DENIED = {ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied'};
const GRANTED = {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'};

type Entry = {gtag: unknown[]} | Record<string, unknown>;

/** The dataLayer in a comparable form: gtag() calls as {gtag: [...args]}, plain pushes as they are. */
const dataLayer = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as {dataLayer?: unknown[]}).dataLayer ?? []).map((entry) =>
      Object.prototype.toString.call(entry) === '[object Arguments]' ? {gtag: Array.from(entry as ArrayLike<unknown>)} : entry
    )
  ) as Promise<Entry[]>;

const consentCalls = (entries: Entry[]) =>
  entries.flatMap((entry) => ('gtag' in entry && Array.isArray(entry.gtag) && entry.gtag[0] === 'consent' ? [entry.gtag.slice(1)] : []));
const events = (entries: Entry[]) => entries.flatMap((entry) => (!('gtag' in entry) && typeof entry.event === 'string' ? [entry.event] : []));

const banner = (page: Page) => page.getByRole('dialog', {name: 'Evästeet'});

test.beforeEach(async ({page}) => {
  await page.route(GOOGLE, (route) => route.abort());
});

test('first visit: everything is denied by default, before the Tag Manager loader, and the banner is shown', async ({page}) => {
  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  const entries = await dataLayer(page);
  expect(consentCalls(entries)).toEqual([['default', {...DENIED, wait_for_update: 500}]]);
  // the defaults are the first thing in the dataLayer: the container start event comes after them
  expect(entries[0]).toEqual({gtag: ['consent', 'default', {...DENIED, wait_for_update: 500}]});
  expect(await page.evaluate(() => document.cookie)).toBe('');
});

test('"accept all" grants the four Consent Mode v2 signals, tells Tag Manager and is remembered', async ({page}) => {
  await page.goto('/');
  await banner(page).getByRole('button', {name: 'Hyväksy kaikki'}).click();
  await expect(banner(page)).toBeHidden();

  const entries = await dataLayer(page);
  expect(consentCalls(entries)).toEqual([
    ['default', {...DENIED, wait_for_update: 500}],
    ['update', GRANTED]
  ]);
  const event = entries.find((entry) => !('gtag' in entry) && entry.event === 'cookie_consent_update');
  expect(event).toMatchObject({consent_analytics: true, consent_marketing: true});
  // the event comes after the update, so a tag triggered by it already runs with consent
  const position = (match: (entry: Entry) => boolean) => entries.findIndex(match);
  expect(position((entry) => 'gtag' in entry && Array.isArray(entry.gtag) && entry.gtag[1] === 'update')).toBeLessThan(
    position((entry) => !('gtag' in entry) && entry.event === 'cookie_consent_update')
  );

  // the next page starts with the stored choice: it is applied before anything else, so before the container loads
  await page.goto('/hinnasto');
  await expect(banner(page)).toBeHidden();
  const next = await dataLayer(page);
  expect(next.slice(0, 2)).toEqual([{gtag: ['consent', 'default', {...DENIED, wait_for_update: 500}]}, {gtag: ['consent', 'update', GRANTED]}]);
  expect(consentCalls(next)).toHaveLength(2);
  // a returning visitor is not asked again, so there is no "consent chosen" event on this page
  expect(events(next)).not.toContain('cookie_consent_update');
});

test('"only necessary" keeps everything denied and removes advertising cookies left from an earlier consent', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => {
    document.cookie = '_gcl_au=1.1.123; path=/';
    document.cookie = '_gcl_aw=GCL.1.abc; path=/';
    document.cookie = '_ga=GA1.1.1.1; path=/';
    document.cookie = 'keep-me=1; path=/';
  });
  await banner(page).getByRole('button', {name: 'Vain välttämättömät'}).click();
  await expect(banner(page)).toBeHidden();

  const entries = await dataLayer(page);
  expect(consentCalls(entries).at(-1)).toEqual(['update', DENIED]);
  expect(entries.find((entry) => !('gtag' in entry) && entry.event === 'cookie_consent_update')).toMatchObject({
    consent_analytics: false,
    consent_marketing: false
  });
  expect(await page.evaluate(() => document.cookie)).toBe('keep-me=1');
});

test('the choice can be split and changed later from the footer', async ({page}) => {
  await page.goto('/');
  await banner(page).getByRole('button', {name: 'Muokkaa valintoja'}).click();
  await banner(page).getByRole('checkbox', {name: /Markkinointi/}).check();
  await banner(page).getByRole('button', {name: 'Tallenna valinnat'}).click();
  await expect(banner(page)).toBeHidden();
  expect(consentCalls(await dataLayer(page)).at(-1)).toEqual([
    'update',
    {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'denied'}
  ]);

  // withdraw: the settings open with the stored choice
  await page.getByRole('button', {name: 'Evästeasetukset'}).click();
  await expect(banner(page).getByRole('checkbox', {name: /Markkinointi/})).toBeChecked();
  await expect(banner(page).getByRole('checkbox', {name: /Analytiikka/})).not.toBeChecked();
  await banner(page).getByRole('checkbox', {name: /Markkinointi/}).uncheck();
  await banner(page).getByRole('button', {name: 'Tallenna valinnat'}).click();
  expect(consentCalls(await dataLayer(page)).at(-1)).toEqual(['update', DENIED]);
});

test('a choice older than a year is asked again', async ({page}) => {
  await page.addInitScript(() =>
    localStorage.setItem('puro-consent', JSON.stringify({analytics: true, marketing: true, ts: Date.now() - 400 * 24 * 60 * 60 * 1000}))
  );
  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  expect(consentCalls(await dataLayer(page))).toEqual([['default', {...DENIED, wait_for_update: 500}]]);
});

/** Books a three-seater in the demo store and lands on the thank-you page. */
async function bookVisit(page: Page) {
  const slot = await pickFreeSlot(page, 60, 9);
  await page.goto('/varaa-aika?item=sofa-3');
  await page.getByTestId('booking-next').click();
  await fillAddress(page);
  await expect(page.getByTestId('travel-result')).toContainText('Helsinki');
  await page.getByTestId('booking-next').click();
  await selectSlot(page, slot);
  await page.getByLabel('Nimi', {exact: true}).fill('Testi Asiakas');
  await page.getByLabel('Puhelin').fill(`040 77${String(Date.now() % 10_000_000).padStart(7, '0')}`);
  await page.getByRole('textbox', {name: 'Sähköposti'}).fill(`e2e-consent-${Date.now()}@example.com`);
  await page.getByRole('checkbox', {name: /tietosuojaselosteen/}).check();
  await page.getByTestId('booking-next').click();
  await expect(page.getByRole('heading', {name: 'Tarkista ja vahvista'})).toBeVisible();
  await page.getByTestId('booking-next').click();
  await expect(page).toHaveURL(/\/varaa-aika\/kiitos\/[0-9a-f]{64}$/);
}

test('thank-you page: the booking is reported once with its value, and the private token never reaches the tags', async ({browser}) => {
  // own address for the rate limiter: booking.spec already uses up the attempts of the default one
  const context = await browser.newContext({extraHTTPHeaders: {'x-forwarded-for': '203.0.113.60'}});
  await context.route(GOOGLE, (route) => route.abort());
  const page = await context.newPage();
  await dismissCookies(page);
  await bookVisit(page);
  const token = page.url().split('/').pop()!;
  const origin = new URL(page.url()).origin;

  // Tag Manager (Page URL variable, URL triggers) and the Google tag get the address without the token
  const entries = await dataLayer(page);
  expect(entries[0]).toMatchObject({'gtm.url': `${origin}/varaa-aika/kiitos`});
  expect(entries[1]).toMatchObject({gtag: ['set', {page_location: `${origin}/varaa-aika/kiitos`}]});
  expect(JSON.stringify(entries)).not.toContain(token);

  // the conversion event for Tag Manager: the amount the customer saw and the booking reference
  const shown = Number((await page.getByTestId('booking-total').innerText()).replace(/[^\d,]/g, '').replace(',', '.'));
  const reference = await page.getByTestId('booking-ref').innerText();
  const complete = entries.filter((entry) => !('gtag' in entry) && entry.event === 'booking_complete');
  expect(complete).toHaveLength(1);
  expect(complete[0]).toMatchObject({value: shown, currency: 'EUR', transaction_id: reference});

  // a reload does not report the same booking again
  await page.reload();
  await expect(page.getByTestId('booking-ref')).toHaveText(reference);
  expect(events(await dataLayer(page))).not.toContain('booking_complete');

  // the manage page is opened from here by a full page load: its address and its referrer both carry the token
  await page.locator(`a[href$="/varaa-aika/hallinnoi/${token}"]`).click();
  await expect(page).toHaveURL(new RegExp(`/varaa-aika/hallinnoi/${token}$`));
  const manage = await dataLayer(page);
  expect(manage[0]).toEqual({'gtm.url': `${origin}/varaa-aika/hallinnoi`, 'gtm.referrer': `${origin}/varaa-aika/kiitos`});
  expect(JSON.stringify(manage)).not.toContain(token);

  // an ordinary page is left alone
  await page.goto('/hinnasto');
  expect((await dataLayer(page)).some((entry) => !('gtag' in entry) && 'gtm.url' in entry)).toBe(false);
  await context.close();
});
