'use client';

import {useId, useRef} from 'react';

interface Props {
  /** injected by <Field>, or set explicitly when the label lives outside it */
  id?: string;
  accept: string;
  /** translated caption of the button that opens the file dialog */
  label: string;
  /** translated text shown while nothing is picked */
  empty: string;
  count: number;
  onPick: (files: FileList | null) => void;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

/**
 * Multi-photo picker with its own button: the captions of a native file input
 * ("Choose file / No file chosen") follow the browser language, not the site locale.
 * The native input stays in the DOM, visually hidden, so the file dialog and tests still work.
 */
export function PhotoPicker({id, accept, label, empty, count, onPick, className, ...aria}: Props) {
  const generated = useId();
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className={['flex flex-wrap items-center gap-3', className].filter(Boolean).join(' ')}>
      <input
        ref={input}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          onPick(e.target.files);
          e.target.value = '';
        }}
      />
      <button
        id={id ?? generated}
        type="button"
        {...aria}
        onClick={() => input.current?.click()}
        className="inline-flex min-h-11 items-center rounded-xl border border-white/20 bg-white/10 px-4 text-[15px] font-medium text-white hover:bg-white/15 aria-invalid:border-[#ff8a8a]"
      >
        {label}
      </button>
      {count === 0 && <span className="text-sm text-muted">{empty}</span>}
    </div>
  );
}
