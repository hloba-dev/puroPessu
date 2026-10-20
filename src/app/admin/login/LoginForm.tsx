'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createBrowserSupabase} from '@/lib/supabase/browser';
import {adminBtn, adminBtnPrimary} from '@/components/admin/ui';

const ERRORS: Record<string, string> = {
  not_admin: 'Этот пользователь не добавлен в таблицу admins.',
  link: 'Ссылка для входа недействительна или устарела.'
};

/** E-mail + password, or a magic link. Access is granted only to users listed in the `admins` table. */
export function LoginForm({initialError}: {initialError?: string}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{kind: 'error' | 'ok'; text: string} | null>(
    initialError ? {kind: 'error', text: ERRORS[initialError] ?? initialError} : null
  );
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const {error} = await createBrowserSupabase().auth.signInWithPassword({email, password});
    setBusy(false);
    if (error) return setMessage({kind: 'error', text: 'Неверный e-mail или пароль.'});
    router.replace('/admin');
    router.refresh();
  };

  const magicLink = async () => {
    if (!email) return setMessage({kind: 'error', text: 'Введите e-mail.'});
    setBusy(true);
    setMessage(null);
    const {error} = await createBrowserSupabase().auth.signInWithOtp({
      email,
      options: {shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin/auth/callback`}
    });
    setBusy(false);
    setMessage(
      error ? {kind: 'error', text: 'Не удалось отправить ссылку.'} : {kind: 'ok', text: 'Ссылка для входа отправлена на почту.'}
    );
  };

  return (
    <form onSubmit={signIn} className="mt-6 space-y-4">
      <div>
        <label htmlFor="admin-email" className="label">
          E-mail
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          required
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="label">
          Пароль
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={message.kind === 'error' ? 'text-danger' : 'text-teal-1'}>
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" className={adminBtnPrimary} disabled={busy}>
          Войти
        </button>
        <button type="button" className={adminBtn} disabled={busy} onClick={magicLink}>
          Войти по ссылке из письма
        </button>
      </div>
    </form>
  );
}
