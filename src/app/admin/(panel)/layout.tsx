import type {ReactNode} from 'react';
import Link from 'next/link';
import {signOut} from '@/app/admin/actions';
import {requireAdmin} from '@/lib/admin/auth';
import {adminBtn} from '@/components/admin/ui';

// every admin page depends on the session cookie
export const dynamic = 'force-dynamic';

const NAV = [
  {href: '/admin', label: 'Обзор'},
  {href: '/admin/bookings', label: 'Брони'},
  {href: '/admin/blocked', label: 'Занятые дни'},
  {href: '/admin/services', label: 'Услуги и цены'},
  {href: '/admin/gallery', label: 'Галерея'},
  {href: '/admin/quotes', label: 'B2B-запросы'},
  {href: '/admin/messages', label: 'Сообщения'},
  {href: '/admin/gift-cards', label: 'Сертификаты'},
  {href: '/admin/reviews', label: 'Отзывы'},
  {href: '/admin/deletion', label: 'Удаление данных'},
  {href: '/admin/settings', label: 'Настройки'}
];

export default async function AdminPanelLayout({children}: {children: ReactNode}) {
  const {user} = await requireAdmin();

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[230px_1fr]">
      <aside className="border-b border-hairline bg-surface-2 p-4 lg:border-r lg:border-b-0">
        <p className="px-2 text-lg font-bold">Puro · админка</p>
        <nav aria-label="Разделы админки" className="mt-4">
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-3 py-2 text-[15px] text-[#d3d7dd] hover:bg-white/10 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 border-t border-hairline px-2 pt-4 text-sm text-muted">
          <p className="truncate">{user.email}</p>
          <form action={signOut} className="mt-2">
            <button type="submit" className={adminBtn}>
              Выйти
            </button>
          </form>
          <p className="mt-3">
            <a href="/" className="link" target="_blank" rel="noopener">
              Открыть сайт
            </a>
          </p>
        </div>
      </aside>
      <main id="content" className="min-w-0 p-5 lg:p-8">
        {children}
      </main>
    </div>
  );
}
