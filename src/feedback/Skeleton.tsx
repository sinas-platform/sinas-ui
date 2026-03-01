import React from 'react';
import { v, tokens } from '../theme/tokens';
import type { SkeletonVariant } from '../types';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  style?: React.CSSProperties;
}

// Inject keyframes once
let stylesInjected = false;
function injectKeyframes() {
  if (stylesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = `@keyframes sinas-pulse{0%,100%{opacity:1}50%{opacity:.4}}`;
  document.head.appendChild(style);
  stylesInjected = true;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  variant = 'line',
  style,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  injectKeyframes();

  const w = typeof width === 'number' ? `${width}px` : width;
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      style={{
        width: w,
        height: h,
        backgroundColor: v(tokens.colorBorder),
        borderRadius: variant === 'circle' ? '50%' : v(tokens.radiusSm),
        animation: 'sinas-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style,
      }}
      {...props}
    />
  );
}
