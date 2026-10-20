'use client';

import {useState, useTransition} from 'react';
import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {cancelBookingAction, rescheduleBookingAction} from '@/app/actions/booking';
import {GlowButton} from '@/components/ui/GlowButton';
import {TimePicker, type SlotValue} from './TimePicker';

type Mode = 'idle' | 'reschedule' | 'cancel';

/** Reschedule / cancel controls behind the private link from the confirmation e-mail. */
export function ManageBooking({token, durationMin, timezone}: {token: string; durationMin: number; timezone: string}) {
  const t = useTranslations('booking.manage');
  const te = useTranslations('booking.errors');
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('idle');
  const [slot, setSlot] = useState<SlotValue | null>(null);
  const [notice, setNotice] = useState<{kind: 'ok' | 'error'; text: string} | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pending, startTransition] = useTransition();

  const reschedule = () => {
    if (!slot) return;
    startTransition(async () => {
      const result = await rescheduleBookingAction(token, slot.iso);
      if (result.ok) {
        setNotice({kind: 'ok', text: t('rescheduled')});
        setMode('idle');
        setSlot(null);
        router.refresh();
      } else {
        setNotice({kind: 'error', text: te(result.error)});
        setSlot(null);
        setReloadKey((n) => n + 1);
      }
    });
  };

  const cancel = () => {
    startTransition(async () => {
      const result = await cancelBookingAction(token);
      setNotice(result.ok ? {kind: 'ok', text: t('cancelled')} : {kind: 'error', text: te('failed')});
      setMode('idle');
      router.refresh();
    });
  };

  return (
    <div className="mt-6">
      {notice && (
        <p
          role={notice.kind === 'error' ? 'alert' : 'status'}
          className={`mb-5 rounded-xl border px-4 py-3 ${
            notice.kind === 'ok' ? 'border-teal-3 bg-teal-soft text-teal-1' : 'border-danger-border bg-danger-soft text-danger'
          }`}
        >
          {notice.text}
        </p>
      )}

      {mode === 'idle' && (
        <div className="flex flex-wrap gap-3">
          <GlowButton onClick={() => setMode('reschedule')}>{t('reschedule')}</GlowButton>
          <GlowButton variant="ghost" onClick={() => setMode('cancel')}>
            {t('cancel')}
          </GlowButton>
        </div>
      )}

      {mode === 'reschedule' && (
        <div>
          <h2 className="h3 mb-5">{t('newTime')}</h2>
          <TimePicker
            durationMin={durationMin}
            timezone={timezone}
            value={slot}
            onChange={setSlot}
            excludeToken={token}
            reloadKey={reloadKey}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton onClick={reschedule} disabled={!slot || pending}>
              {pending ? t('saving') : t('saveTime')}
            </GlowButton>
            <GlowButton variant="ghost" onClick={() => setMode('idle')} disabled={pending}>
              {t('cancelNo')}
            </GlowButton>
          </div>
        </div>
      )}

      {mode === 'cancel' && (
        <div className="glass p-6" role="group" aria-labelledby="cancel-question">
          <p id="cancel-question" className="font-semibold">
            {t('cancelConfirm')}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className="min-h-12 rounded-xl bg-danger px-5 font-semibold text-white hover:bg-danger-hover disabled:opacity-50"
            >
              {t('cancelYes')}
            </button>
            <GlowButton variant="ghost" onClick={() => setMode('idle')} disabled={pending}>
              {t('cancelNo')}
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
