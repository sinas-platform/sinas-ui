import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';
import type { AlertType } from '../types';

export interface AlertProps {
  children: React.ReactNode;
  type?: AlertType;
  title?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

// Dark-mode glass alerts — colored tint on dark background
const alertColors: Record<AlertType, { bg: string; border: string; text: string; accent: string }> = {
  info: {
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.2)',
    text: '#93c5fd',
    accent: '#3b82f6',
  },
  success: {
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.2)',
    text: '#86efac',
    accent: '#22c55e',
  },
  warning: {
    bg: 'rgba(234, 179, 8, 0.08)',
    border: 'rgba(234, 179, 8, 0.2)',
    text: '#fde047',
    accent: '#eab308',
  },
  error: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.2)',
    text: '#fca5a5',
    accent: '#ef4444',
  },
};

export function Alert({
  children,
  type = 'info',
  title,
  dismissible = false,
  onDismiss,
  style,
  ...props
}: AlertProps & React.HTMLAttributes<HTMLDivElement>) {
  injectBaseStyles();
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  const c = alertColors[type];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      style={{
        padding: '14px 18px',
        borderRadius: v(tokens.radiusMd),
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: '13px',
        position: 'relative',
        backdropFilter: `blur(${v(tokens.glassBlur)})`,
        WebkitBackdropFilter: `blur(${v(tokens.glassBlur)})`,
        ...style,
      }}
      {...props}
    >
      {/* Accent bar on the left */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '8px',
          bottom: '8px',
          width: '3px',
          borderRadius: '2px',
          backgroundColor: c.accent,
        }}
      />
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: c.text,
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '2px 6px',
            opacity: 0.6,
          }}
        >
          {'\u00d7'}
        </button>
      )}
      {title && (
        <div style={{ fontWeight: 600, marginBottom: '4px', color: c.text }}>{title}</div>
      )}
      <div style={{ paddingLeft: '10px' }}>{children}</div>
    </div>
  );
}
