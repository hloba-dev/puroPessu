import type {ReactNode} from 'react';
import {Breadcrumbs, type Crumb} from './Breadcrumbs';

interface Props {
  crumbs: Crumb[];
  badge?: string;
  title: string;
  intro?: string;
  /** call-to-action buttons */
  children?: ReactNode;
  /** right column on wide screens (e.g. a before/after slider) */
  aside?: ReactNode;
}

/** Top block of every inner page: breadcrumbs, optional badge, the page's only H1, intro and CTAs. */
export function PageHero({crumbs, badge, title, intro, children, aside}: Props) {
  return (
    <section className="page-top pb-14">
      <div className="container-x">
        <Breadcrumbs items={crumbs} />
        <div className={`mt-7 grid gap-10 ${aside ? 'lg:grid-cols-[1.15fr_0.85fr] lg:items-center' : ''}`}>
          <div className="min-w-0">
            {badge && (
              <p className="inline-flex min-h-9 items-center rounded-xl border border-hairline bg-surface px-4 text-sm font-medium text-teal-1">
                {badge}
              </p>
            )}
            <h1 className={`text-[clamp(28px,4.6vw,56px)] leading-[1.06] font-black tracking-tight text-balance ${badge ? 'mt-5' : ''}`}>
              {title}
            </h1>
            {intro && <p className="lead mt-5">{intro}</p>}
            {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
