import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: number;
  glass?: boolean;
  style?: React.CSSProperties;
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  padding = 20,
  glass = true,
  style,
  ...props
}: CardProps & React.HTMLAttributes<HTMLDivElement>) {
  injectBaseStyles();

  const baseStyle: React.CSSProperties = glass
    ? {
        background: v(tokens.colorGlass),
        backdropFilter: `blur(${v(tokens.glassBlur)})`,
        WebkitBackdropFilter: `blur(${v(tokens.glassBlur)})`,
        border: `1px solid ${v(tokens.colorGlassBorder)}`,
      }
    : {
        background: v(tokens.colorBgElevated),
        border: `1px solid ${v(tokens.colorBorder)}`,
      };

  return (
    <div
      style={{
        borderRadius: v(tokens.radiusLg),
        padding: `${padding}px`,
        ...baseStyle,
        ...style,
      }}
      {...props}
    >
      {title && (
        <div style={{ marginBottom: subtitle ? '4px' : '16px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 600,
              color: v(tokens.colorText),
              letterSpacing: '-0.01em',
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
            marginBottom: '16px',
          }}
        >
          {subtitle}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: `1px solid ${v(tokens.colorGlassBorder)}`,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
