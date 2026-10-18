/** The native file input captions ("Choose file / No file chosen") follow the browser language, not the site's — so the picker renders its own translated button. */
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';
import en from '../../messages/en.json';
import fi from '../../messages/fi.json';
import ru from '../../messages/ru.json';
import {PhotoPicker} from '@/components/forms/PhotoPicker';

const locales = {en, fi, ru};

describe('photo picker captions are translated', () => {
  it('every locale has its own button and empty-state texts for both forms', () => {
    for (const messages of Object.values(locales)) {
      expect(messages.forms.quote.choosePhotos).toMatch(/\S/);
      expect(messages.forms.quote.noPhotos).toMatch(/\S/);
      expect(messages.booking.photos.choose).toMatch(/\S/);
      expect(messages.booking.photos.none).toMatch(/\S/);
    }
    expect(en.forms.quote.choosePhotos).not.toBe(ru.forms.quote.choosePhotos);
    expect(fi.forms.quote.choosePhotos).not.toBe(ru.forms.quote.choosePhotos);
    expect(en.booking.photos.choose).not.toBe(ru.booking.photos.choose);
    expect(fi.booking.photos.choose).not.toBe(ru.booking.photos.choose);
  });
});

describe('PhotoPicker', () => {
  const render = (count: number) =>
    renderToStaticMarkup(
      createElement(PhotoPicker, {
        id: 'photos',
        accept: 'image/jpeg',
        label: 'Choose photos',
        empty: 'No photos selected',
        count,
        onPick: () => undefined,
        'aria-describedby': 'photos-hint'
      })
    );

  it('shows the translated button instead of the native caption and keeps the input for the file dialog', () => {
    const html = render(0);
    expect(html).toContain('<button id="photos" type="button" aria-describedby="photos-hint"');
    expect(html).toContain('>Choose photos</button>');
    expect(html).toMatch(/<input[^>]*type="file"[^>]*class="sr-only"/);
    expect(html).toMatch(/<input[^>]*tabindex="-1"/);
    expect(html).toContain('No photos selected');
  });

  it('drops the empty-state text once photos are picked', () => {
    expect(render(2)).not.toContain('No photos selected');
  });
});
