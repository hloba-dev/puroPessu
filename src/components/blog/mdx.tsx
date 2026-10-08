import type {ComponentProps, ReactNode} from 'react';
import NextLink from 'next/link';
import type {MDXRemoteProps} from 'next-mdx-remote/rsc';
import type {Locale} from '@/i18n/routing';
import {headingId} from '@/lib/blog';
import {formatEur} from '@/lib/format';
import type {Catalog} from '@/lib/types';

function plainText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return plainText((node as {props: {children?: ReactNode}}).props.children);
  }
  return '';
}

interface Labels {
  tip: string;
  warning: string;
}

/** Components available inside article MDX. `Price` prints the current catalog price, so articles never go stale. */
export function mdxComponents(locale: Locale, catalog: Catalog, labels: Labels): MDXRemoteProps['components'] {
  return {
    h2: ({children}: {children?: ReactNode}) => (
      <h2 id={headingId(plainText(children))} className="scroll-mt-28">
        {children}
      </h2>
    ),
    a: ({href = '', children, ...rest}: ComponentProps<'a'>) =>
      href.startsWith('/') ? (
        // internal links in articles are already written with their localized path
        <NextLink href={href}>{children}</NextLink>
      ) : (
        <a href={href} rel="noopener" target="_blank" {...rest}>
          {children}
        </a>
      ),
    table: ({children}: {children?: ReactNode}) => (
      <div className="overflow-x-auto" tabIndex={0}>
        <table>{children}</table>
      </div>
    ),
    Callout: ({type = 'tip', title, children}: {type?: 'tip' | 'warning'; title?: string; children?: ReactNode}) => (
      <aside
        className={`rounded-2xl border p-5 ${
          type === 'warning' ? 'border-[#ffb86b]/40 bg-[#ffb86b]/[0.07]' : 'border-cyan-4 bg-cyan-4/20'
        }`}
      >
        <p className={`text-sm font-semibold tracking-wide uppercase ${type === 'warning' ? 'text-[#ffd9ad]' : 'text-cyan-1'}`}>
          {title ?? labels[type]}
        </p>
        <div className="mt-2 text-[16px] [&>*+*]:mt-3">{children}</div>
      </aside>
    ),
    Price: ({slug}: {slug: string}) => {
      const service = catalog.services.find((s) => s.slug === slug);
      return service ? <strong className="whitespace-nowrap">{formatEur(service.priceCents, locale)}</strong> : null;
    }
  };
}
