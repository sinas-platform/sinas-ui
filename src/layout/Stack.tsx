import React from 'react';

export interface StackProps {
  children: React.ReactNode;
  gap?: number;
  direction?: 'column' | 'row';
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  style?: React.CSSProperties;
}

export function Stack({
  children,
  gap = 12,
  direction = 'column',
  align,
  justify,
  style,
  ...props
}: StackProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
