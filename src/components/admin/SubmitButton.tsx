'use client';

import type {ReactNode} from 'react';
import {useFormStatus} from 'react-dom';

/**
 * Submit button of a Server Action form: shows that the action is running and cannot be pressed twice
 * (a second press would, for example, e-mail the customer twice).
 */
export function SubmitButton({
  children,
  className,
  title,
  pendingLabel = 'Сохраняю…'
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  pendingLabel?: string;
}) {
  const {pending} = useFormStatus();
  return (
    <button type="submit" className={className} title={title} disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
