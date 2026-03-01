import React from 'react';
import { v, tokens } from '../theme/tokens';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  style?: React.CSSProperties;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  style,
  ...props
}: SelectProps & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'style'>) {
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
      <select
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
          appearance: 'auto',
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
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
