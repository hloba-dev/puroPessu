import {useId, type ReactElement, type ReactNode, cloneElement} from 'react';

interface Props {
  label: ReactNode;
  /** already translated message */
  error?: string;
  hint?: string;
  optional?: string;
  /** a single input / select / textarea element; id and aria attributes are injected */
  children: ReactElement<{id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string}>;
  className?: string;
}

/** Label + control + error message, wired together for screen readers. */
export function Field({label, error, hint, optional, children, className}: Props) {
  const id = useId();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">({optional})</span>}
      </label>
      {cloneElement(children, {id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy})}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
