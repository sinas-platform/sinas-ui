import type React from 'react';

export interface BaseProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type SkeletonVariant = 'line' | 'circle';
