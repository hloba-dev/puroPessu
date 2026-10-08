import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/admin/auth';
import {isSupabaseConfigured} from '@/lib/supabase/env';
import {LoginForm} from './LoginForm';

export const metadata = {title: 'Вход'};

export default async function AdminLoginPage({searchParams}: PageProps<'/admin/login'>) {
  if (await getAdmin()) redirect('/admin');
  const {error} = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">Puro — вход в админку</h1>
        {isSupabaseConfigured ? (
          <LoginForm initialError={typeof error === 'string' ? error : undefined} />
        ) : (
          <p className="mt-4 text-muted">
            Supabase не настроен: добавьте NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY и SUPABASE_SECRET_KEY в
            переменные окружения (см. README).
          </p>
        )}
      </div>
    </main>
  );
}
