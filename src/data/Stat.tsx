import React from 'react';
import { v, tokens } from '../theme/tokens';

export interface StatProps {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  style?: React.CSSProperties;
}

const trendColors: Record<string, string> = {
  up: '#22c55e',
  down: '#ef4444',
  neutral: '#64748b',
};

export function Stat({
  label,
  value,
  description,
  trend,
  style,
  ...props
}: StatProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={style} {...props}>
      <div
        style={{
          fontSize: '12px',
          color: v(tokens.colorTextMuted),
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
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
