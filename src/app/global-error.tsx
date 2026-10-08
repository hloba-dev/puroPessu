'use client';

import {useEffect} from 'react';

// Last-resort boundary for errors in a root layout: no providers, no global CSS, three languages.
export default function GlobalError({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fi">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#020204',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: 24
        }}
      >
        <main>
          <h1 style={{fontSize: 28}}>Jokin meni vikaan</h1>
          <p lang="ru">Что-то пошло не так</p>
          <p lang="en">Something went wrong</p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              minHeight: 48,
              padding: '0 24px',
              borderRadius: 12,
              border: '1px solid #3ec8e4',
              background: 'transparent',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Yritä uudelleen · Повторить · Try again
          </button>
        </main>
      </body>
    </html>
  );
}
