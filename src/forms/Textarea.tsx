import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';

export interface TextareaProps {
  label?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  style?: React.CSSProperties;
}

export function Textarea({
  label,
  placeholder,
  error,
  value,
  onChange,
  rows = 4,
  style,
  ...props
}: TextareaProps & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'>) {
  injectBaseStyles();

  return (
    <div style={style}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 500,
            color: v(tokens.colorTextMuted),
            marginBottom: '6px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase' as const,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        style={{
          width: '100%',
          padding: '10px 14px',
          fontSize: '14px',
          border: `1px solid ${error ? v(tokens.colorDanger) : v(tokens.colorBorder)}`,
          borderRadius: v(tokens.radiusMd),
          backgroundColor: v(tokens.colorBgSubtle),
          color: v(tokens.colorText),
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
          resize: 'vertical' as const,
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? v(tokens.colorDanger)
            : v(tokens.colorBorderFocus);
          e.currentTarget.style.boxShadow = error
            ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
            : v(tokens.shadowGlow);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? v(tokens.colorDanger)
            : v(tokens.colorBorder);
          e.currentTarget.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <div
          style={{
            fontSize: '12px',
            color: v(tokens.colorDanger),
            marginTop: '6px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
