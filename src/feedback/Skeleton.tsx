import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';
import type { SkeletonVariant } from '../types';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  style?: React.CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  variant = 'line',
  style,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  injectBaseStyles(); // keyframes are injected in base styles now

  const w = typeof width === 'number' ? `${width}px` : width;
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: v(tokens.colorGlassHover),
        borderRadius: variant === 'circle' ? '50%' : v(tokens.radiusSm),
        animation: 'sinas-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style,
      }}
      {...props}
    />
  );
}
