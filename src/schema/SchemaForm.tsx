import React, { useState } from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';
import { Input } from '../forms/Input';
import { Select } from '../forms/Select';
import { Textarea } from '../forms/Textarea';

export interface SchemaFormFieldProps {
  name: string;
  schema: {
    type?: string;
    description?: string;
    enum?: unknown[];
    default?: unknown;
    items?: Record<string, unknown>;
  };
  value: unknown;
  onChange: (value: unknown) => void;
  required?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

export interface SchemaFormProps {
  schema: Record<string, unknown>;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  style?: React.CSSProperties;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: v(tokens.colorText),
  marginBottom: '4px',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '12px',
  color: v(tokens.colorTextMuted),
  marginBottom: '4px',
  marginTop: 0,
};

export function SchemaFormField({
  name,
  schema,
  value,
  onChange,
  required = false,
  placeholder,
  style,
}: SchemaFormFieldProps) {
  injectBaseStyles();

  const [jsonError, setJsonError] = useState<string | null>(null);

  const type = schema.type || 'string';
  const description = schema.description;
  const enumValues = schema.enum;

  // Handle enum (select dropdown)
  if (enumValues && enumValues.length > 0) {
    return (
      <div style={{ marginBottom: '12px', ...style }}>
        <label style={labelStyle}>
          {name} {required && <span style={{ color: v(tokens.colorDanger) }}>*</span>}
        </label>
        {description && <p style={descriptionStyle}>{description}</p>}
        <Select
          options={enumValues.map((val) => ({ value: String(val), label: String(val) }))}
          value={value != null ? String(value) : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'true') onChange(true);
            else if (val === 'false') onChange(false);
            else if (!isNaN(Number(val)) && val !== '') onChange(Number(val));
            else onChange(val);
          }}
          placeholder="Select..."
        />
      </div>
    );
  }

  // Handle different types
  switch (type) {
    case 'boolean':
      return (
        <div style={{ marginBottom: '12px', ...style }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => onChange(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '13px', fontWeight: 500, color: v(tokens.colorText) }}>
              {name} {required && <span style={{ color: v(tokens.colorDanger) }}>*</span>}
            </span>
          </label>
          {description && <p style={{ ...descriptionStyle, marginLeft: '24px', marginTop: '4px' }}>{description}</p>}
        </div>
      );

    case 'integer':
    case 'number':
      return (
        <div style={{ marginBottom: '12px', ...style }}>
          <label style={labelStyle}>
            {name} {required && <span style={{ color: v(tokens.colorDanger) }}>*</span>}
          </label>
          {description && <p style={descriptionStyle}>{description}</p>}
          <Input
            type="number"
            value={value != null ? String(value) : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                onChange('');
              } else {
                const num = Number(val);
                onChange(type === 'integer' ? Math.floor(num) : num);
              }
            }}
            placeholder={placeholder || (schema.default != null ? String(schema.default) : '')}
            step={type === 'integer' ? '1' : 'any'}
          />
        </div>
      );

    case 'array':
      return (
        <div style={{ marginBottom: '12px', ...style }}>
          <label style={labelStyle}>
            {name} {required && <span style={{ color: v(tokens.colorDanger) }}>*</span>}
            <span style={{ fontSize: '12px', color: v(tokens.colorTextMuted), marginLeft: '8px', fontWeight: 400 }}>
              (JSON array)
            </span>
          </label>
          {description && <p style={descriptionStyle}>{description}</p>}
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value ?? [], null, 2)}
            onChange={(e) => {
              const val = e.target.value;
              try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) {
                  onChange(parsed);
                  setJsonError(null);
                } else {
                  setJsonError('Value must be an array');
                }
              } catch {
                setJsonError('Invalid JSON');
                onChange(val);
              }
            }}
            placeholder={placeholder || '["item1", "item2"]'}
            rows={3}
            error={jsonError || undefined}
            style={{ fontFamily: v(tokens.fontMono) }}
          />
        </div>
      );

    case 'object':
      return (
        <div style={{ marginBottom: '12px', ...style }}>
          <label style={labelStyle}>
            {name} {required && <span style={{ color: v(tokens.colorDanger) }}>*</span>}
            <span style={{ fontSize: '12px', color: v(tokens.colorTextMuted), marginLeft: '8px', fontWeight: 400 }}>
              (JSON object)
            </span>
          </label>
          {description && <p style={descriptionStyle}>{description}</p>}
          <Textarea
            value={typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2)}
            onChange={(e) => {
              const val = e.target.value;
              try {
                const parsed = JSON.parse(val);
                if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                  onChange(parsed);
                  setJsonError(null);
                } else {
                  setJsonError('Value must be an object');
                }
              } catch {
                setJsonError('Invalid JSON');
                onChange(val);
              }
            }}
            placeholder={placeholder || '{"key": "value"}'}
            rows={4}
            error={jsonError || undefined}
            style={{ fontFamily: v(tokens.fontMono) }}
          />
        </div>
      );

    case 'string':
    default:
      return (
        <div style={{ marginBottom: '12px', ...style }}>
          <label style={labelStyle}>
            {name} {required && <span style={{ color: v(tokens.colorDanger) }}>*</span>}
          </label>
          {description && <p style={descriptionStyle}>{description}</p>}
          <Input
            type="text"
            value={value != null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || (schema.default != null ? String(schema.default) : '')}
          />
        </div>
      );
  }
}

export function SchemaForm({ schema, values, onChange, style }: SchemaFormProps) {
  injectBaseStyles();

  const properties = (schema.properties || {}) as Record<string, SchemaFormFieldProps['schema']>;
  const required = (schema.required || []) as string[];

  return (
    <div style={style}>
      {Object.entries(properties).map(([key, propSchema]) => (
        <SchemaFormField
          key={key}
          name={key}
          schema={propSchema}
          value={values[key]}
          onChange={(val) => onChange({ ...values, [key]: val })}
          required={required.includes(key)}
        />
      ))}
    </div>
  );
}
