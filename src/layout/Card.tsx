import React from 'react';
import { v, tokens } from '../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: number;
  style?: React.CSSProperties;
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  padding = 16,
  style,
  ...props
}: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        border: `1px solid ${v(tokens.colorBorder)}`,
        borderRadius: v(tokens.radiusLg),
        padding: `${padding}px`,
        backgroundColor: v(tokens.colorBg),
        ...style,
      }}
      {...props}
    >
      {title && (
        <div style={{ marginBottom: subtitle ? '4px' : '12px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 600,
              color: v(tokens.colorText),
            }}
          >
            {title}
          </h3>
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontSize: '13px',
            color: v(tokens.colorTextMuted),
            marginBottom: '12px',
          }}
        >
          {subtitle}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `1px solid ${v(tokens.colorBorder)}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
