import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';
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

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '12px' },
  md: { padding: '8px 18px', fontSize: '13px' },
  lg: { padding: '12px 28px', fontSize: '15px' },
};

function getVariantStyles(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: v(tokens.colorPrimary),
        color: '#fff',
        border: 'none',
        fontWeight: 600,
      };
    case 'secondary':
      return {
        backgroundColor: v(tokens.colorGlass),
        color: v(tokens.colorText),
        border: `1px solid ${v(tokens.colorGlassBorder)}`,
        backdropFilter: `blur(${v(tokens.glassBlur)})`,
        WebkitBackdropFilter: `blur(${v(tokens.glassBlur)})`,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: v(tokens.colorTextMuted),
        border: '1px solid transparent',
      };
    case 'danger':
      return {
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      };
  }
}

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
  injectBaseStyles();
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{
        borderRadius: v(tokens.radiusMd),
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        fontFamily: 'inherit',
        lineHeight: 1.5,
        letterSpacing: '-0.01em',
        transition: 'all 150ms ease',
        ...getVariantStyles(variant),
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? 'Loading\u2026' : children}
    </button>
  );
}
