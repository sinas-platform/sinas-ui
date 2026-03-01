import React from 'react';
import { v, tokens } from '../theme/tokens';
import type { ButtonVariant, ButtonSize } from '../types';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: { color: '#fff', border: 'none' },
  secondary: { border: '1px solid' },
  danger: { color: '#fff', border: 'none' },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '4px 10px', fontSize: '12px' },
  md: { padding: '8px 16px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '16px' },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  style,
  ...props
}: ButtonProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'>) {
  const isDisabled = disabled || loading;

  const bgMap: Record<ButtonVariant, string> = {
    primary: v(tokens.colorPrimary),
    secondary: v(tokens.colorBgSubtle),
    danger: v(tokens.colorDanger),
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        borderRadius: v(tokens.radiusMd),
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        backgroundColor: bgMap[variant],
        borderColor: variant === 'secondary' ? v(tokens.colorBorder) : undefined,
        color: variant === 'secondary' ? v(tokens.colorText) : '#fff',
        fontFamily: 'inherit',
        lineHeight: 1.5,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? 'Loading\u2026' : children}
    </button>
  );
}
