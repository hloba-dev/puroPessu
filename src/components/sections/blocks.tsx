import type {TitleText} from '@/content/types';
import {IconCheck} from '@/components/ui/icons';

/** Grid of small titled cards. */
export function CardGrid({items, columns = 3, numbered = false}: {items: TitleText[]; columns?: 2 | 3 | 4; numbered?: boolean}) {
  const cols = columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';
  const Tag = numbered ? 'ol' : 'ul';
  return (
    <Tag className={`grid gap-5 ${cols}`}>
      {items.map((item, index) => (
        <li key={item.title} className="glass p-6">
          {numbered && (
            <span className="font-serif text-4xl font-semibold text-cyan-2" aria-hidden="true">
              {index + 1}
            </span>
          )}
          <h3 className={`text-lg font-semibold ${numbered ? 'mt-3' : ''}`}>{item.title}</h3>
          <p className="mt-2 text-[15px] text-muted">{item.text}</p>
        </li>
      ))}
    </Tag>
  );
}

export function CheckList({items, className = ''}: {items: string[]; className?: string}) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <IconCheck className="mt-1 shrink-0 text-cyan-2" width={18} height={18} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Paragraphs({items, className = ''}: {items: string[]; className?: string}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );
}

interface CompareProps {
  headers: {aspect: string; rental: string; pro: string};
  rows: {aspect: string; rental: string; pro: string}[];
  caption: string;
}

/** Three-column comparison; scrolls horizontally inside its own box on narrow screens. */
export function CompareTable({headers, rows, caption}: CompareProps) {
  return (
    <div className="overflow-x-auto rounded-[20px] border border-hairline" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-surface text-sm">
            <th scope="col" className="p-4 font-semibold text-muted">
              {headers.aspect}
            </th>
            <th scope="col" className="p-4 font-semibold">
              {headers.rental}
            </th>
            <th scope="col" className="p-4 font-semibold text-cyan-1">
              {headers.pro}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.aspect} className="border-t border-hairline align-top">
              <th scope="row" className="p-4 font-medium">
                {row.aspect}
              </th>
              <td className="p-4 text-muted">{row.rental}</td>
              <td className="p-4">{row.pro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
