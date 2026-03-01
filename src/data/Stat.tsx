import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';

export interface StatProps {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  style?: React.CSSProperties;
}

const trendColors: Record<string, string> = {
  up: '#4ade80',
  down: '#f87171',
  neutral: '#888888',
};

export function Stat({
  label,
  value,
  description,
  trend,
  style,
  ...props
}: StatProps & React.HTMLAttributes<HTMLDivElement>) {
  injectBaseStyles();

  return (
    <div style={style} {...props}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: v(tokens.colorTextMuted),
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: v(tokens.colorText),
          margin: '4px 0',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
      {description && (
        <div
          style={{
            fontSize: '13px',
            color: trend ? trendColors[trend] : v(tokens.colorTextMuted),
          }}
        >
          {trend === 'up' && '\u2191 '}
          {trend === 'down' && '\u2193 '}
          {description}
        </div>
      )}
    </div>
  );
}
