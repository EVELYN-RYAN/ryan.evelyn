import React from 'react'
import { cx } from '../utils/cx'
import '../styles/glass.css'
import styles from './Button.module.css'

export type ButtonStatus = 'ready' | 'loading' | 'error' | 'done'
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger' | 'success' | 'info' | 'link' | 'ghost'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  label: React.ReactNode;
  status?: ButtonStatus;
  variant?: ButtonVariant;
}

const Button = ({
  label,
  status = 'ready',
  variant,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => {

  return (
    <button
      {...rest}
      type={type}
      className={cx('glass', styles.content, variant && styles[variant], disabled && styles.disabled, className)}
      data-status={status}
      aria-busy={status === 'loading'}
      disabled={disabled || status === 'loading'}
    >
      <span aria-live="polite">{label}</span>
    </button>
  )
}
export default Button
