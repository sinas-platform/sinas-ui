import React from 'react';
import { v, tokens } from '../theme/tokens';

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
  return (
    <div style={style}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: v(tokens.colorText),
            marginBottom: '4px',
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
          padding: '8px 12px',
          fontSize: '14px',
          border: `1px solid ${error ? v(tokens.colorDanger) : v(tokens.colorBorder)}`,
          borderRadius: v(tokens.radiusMd),
          backgroundColor: v(tokens.colorBg),
          color: v(tokens.colorText),
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
        }}
        {...props}
      />
      {error && (
        <div
          style={{
            fontSize: '12px',
            color: v(tokens.colorDanger),
            marginTop: '4px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
