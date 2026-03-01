import React from 'react';
import { v, tokens } from '../theme/tokens';
import type { AlertType } from '../types';

export interface AlertProps {
  children: React.ReactNode;
  type?: AlertType;
  title?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

const alertColors: Record<AlertType, { bg: string; border: string; text: string }> = {
  info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
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
        padding: '12px 16px',
        borderRadius: v(tokens.radiusMd),
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: '14px',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            color: c.text,
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '2px 6px',
          }}
        >
          {'\u00d7'}
        </button>
      )}
      {title && (
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{title}</div>
      )}
      {children}
    </div>
  );
}
