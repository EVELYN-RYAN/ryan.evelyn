'use client'

import React from 'react'
import { cx } from '../utils/cx'
import styles from './Button.module.css'

export type ButtonStatus = 'ready' | 'loading' | 'error' | 'done'
/** Statuses available once `onCancel` is provided */
export type CancelableButtonStatus = ButtonStatus | 'canceled'
// export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger' | 'success' | 'info' | 'link' | 'ghost'
// export type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = Omit<React.ComponentPropsWithRef<'button'>, 'children'> & {
  /** Ready text; also shown for any status without its own label */
  label: React.ReactNode;
  /** ms after done/error/canceled before returning to ready; false disables */
  resetAfter?: number | false;
  /** Called when the button resets itself to ready */
  onReset?: () => void;
  // variant?: ButtonVariant;
  // size?: ButtonSize;
}

type CancelableProps = {
  /** Opts in to cancel: clicking while loading calls this, and enables the 'canceled' status */
  onCancel: () => void;
  status?: CancelableButtonStatus;
  labels?: Partial<Record<Exclude<CancelableButtonStatus, 'ready'> | 'cancel', React.ReactNode>>;
}

type StandardProps = {
  onCancel?: never;
  status?: ButtonStatus;
  labels?: Partial<Record<Exclude<ButtonStatus, 'ready'>, React.ReactNode>>;
}

export type ButtonProps = BaseProps & (CancelableProps | StandardProps)

const RESETS = new Set<CancelableButtonStatus>(['done', 'error', 'canceled'])

const STATE_CLASS: Partial<Record<CancelableButtonStatus, string>> = {
  loading: 'loading',
  error: 'error',
  done: 'pulse',
  canceled: 'canceled',
}

const StopIcon = () => (
  <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
)

const Button = ({
  label,
  labels,
  status = 'ready',
  resetAfter = 2000,
  onReset,
  onCancel,
  onClick,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const [resetFrom, setResetFrom] = React.useState<CancelableButtonStatus | null>(null)
  const [prevStatus, setPrevStatus] = React.useState(status)
  if (status !== prevStatus) {
    setPrevStatus(status)
    setResetFrom(null)
  }
  const shown: CancelableButtonStatus = resetFrom === status ? 'ready' : status

  const fireReset = React.useEffectEvent(() => onReset?.())
  React.useEffect(() => {
    if (resetAfter === false || !RESETS.has(status)) return
    const timer = setTimeout(() => {
      setResetFrom(status)
      fireReset()
    }, resetAfter)
    return () => clearTimeout(timer)
  }, [status, resetAfter])

  const loading = shown === 'loading'
  const cancelable = Boolean(onCancel)
  const labelMap = labels as Partial<Record<string, React.ReactNode>> | undefined
  const labelFor = (s: CancelableButtonStatus) => (s === 'ready' ? label : labelMap?.[s] ?? label)
  const stack: CancelableButtonStatus[] = cancelable
    ? ['ready', 'loading', 'error', 'done', 'canceled']
    : ['ready', 'loading', 'error', 'done']

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault()
      onCancel?.()
      return
    }
    onClick?.(e)
  }

  return (
    <>
      <button
        {...rest}
        type={type}
        className={cx('glass', STATE_CLASS[shown], styles.content, disabled && styles.disabled, className)}
        data-status={shown}
        data-cancelable={cancelable || undefined}
        aria-busy={loading}
        aria-disabled={(loading && !cancelable) || undefined}
        disabled={disabled}
        onClick={handleClick}
      >
        <span className={styles.labels}>
          {stack.map((s) => (
            <span key={s} className={styles.label} data-active={s === shown} aria-hidden={s !== shown}>
              {labelFor(s)}
            </span>
          ))}
        </span>
        {cancelable && loading && (
          <span className={styles.cancel}>
            <StopIcon />
            {labelMap?.cancel ?? 'Cancel'}
          </span>
        )}
      </button>
      <span className="visuallyHidden" aria-live="polite">
        {shown !== 'ready' && labelFor(shown)}
      </span>
    </>
  )
}
export default Button
