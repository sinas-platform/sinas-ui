import React from 'react';
import { injectBaseStyles } from '../theme/tokens';

export interface GridProps {
  children: React.ReactNode;
  columns?: number | string;
  gap?: number;
  style?: React.CSSProperties;
}

export function Grid({
  children,
  columns = 2,
  gap = 16,
  style,
  ...props
}: GridProps & React.HTMLAttributes<HTMLDivElement>) {
  injectBaseStyles();

  const gridCols = typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gap: `${gap}px`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
