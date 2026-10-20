import {JsonLd} from '@/components/seo/JsonLd';
import {IconChevron} from '@/components/ui/icons';
import {faqLd} from '@/lib/jsonld';

export interface FaqItem {
  q: string;
  a: string;
}

/** Native <details> accordion (works without JS, keyboard accessible) + FAQPage structured data. */
export function Faq({items, jsonLd = true}: {items: FaqItem[]; jsonLd?: boolean}) {
  return (
    <>
      <div className="divide-y divide-hairline rounded-[20px] border border-hairline bg-surface/60">
        {items.map((item) => (
          <details key={item.q} className="group px-5 sm:px-7">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <IconChevron className="shrink-0 text-teal-2 transition-transform group-open:rotate-180" />
            </summary>
            <p className="max-w-[70ch] pb-6 text-text">{item.a}</p>
          </details>
        ))}
      </div>
      {jsonLd && <JsonLd data={faqLd(items)} />}
    </>
  );
}
