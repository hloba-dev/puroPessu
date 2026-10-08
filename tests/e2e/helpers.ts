import {expect, type Page} from '@playwright/test';

/** A free slot a few days ahead, straight from the availability API (same source the calendar uses). */
export async function pickFreeSlot(page: Page, durationMin: number, dayOffset: number) {
  const res = await page.request.get(`/api/availability?duration=${durationMin}`);
  expect(res.ok()).toBeTruthy();
  const {days} = (await res.json()) as {days: Record<string, string[]>};
  const free = Object.entries(days).filter(([, slots]) => slots.length > 0);
  const [date, slots] = free[Math.min(dayOffset, free.length - 1)];
  return {date, time: slots[Math.floor(slots.length / 2)]};
}

export async function dismissCookies(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem('puro-consent', JSON.stringify({analytics: false, marketing: false, ts: 1}))
  );
}

export async function fillAddress(page: Page, postalCode = '00100') {
  await page.getByLabel('Katuosoite').fill('Testikatu 1 A 2');
  await page.getByLabel('Postinumero').fill(postalCode);
}

/** Pages the calendar forward until the month of `date` is shown. */
export async function showMonthOf(page: Page, date: string) {
  const month = page.locator('[data-month]');
  await month.waitFor();
  // the day may be in a later month of the calendar
  for (let i = 0; i < 3 && (await month.getAttribute('data-month')) !== date.slice(0, 7); i++) {
    await page.getByRole('button', {name: 'Seuraava kuukausi'}).click();
  }
}

export async function selectSlot(page: Page, slot: {date: string; time: string}) {
  await showMonthOf(page, slot.date);
  await page.locator(`[data-date="${slot.date}"]`).click();
  await page.locator(`[data-time="${slot.time}"]`).click();
}
