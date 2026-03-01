import React from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';

export interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export function Input({
  label,
  placeholder,
  error,
  type = 'text',
  value,
  onChange,
  style,
  ...props
}: InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style' | 'type'>) {
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
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error
            ? (v(tokens.colorDanger))
            : (v(tokens.colorBorderFocus));
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
