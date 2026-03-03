import React, { useState, useEffect } from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';
import { Button } from '../forms/Button';
import { Textarea } from '../forms/Textarea';

// Inline SVG icons
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const LayoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);

type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array';

interface SchemaProperty {
  type: JSONSchemaType | JSONSchemaType[];
  description?: string;
  default?: unknown;
  enum?: unknown[];
  items?: Record<string, unknown>;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface SchemaEditorProps {
  value: Record<string, unknown>;
  onChange: (schema: Record<string, unknown>) => void;
  label?: string;
  description?: string;
  style?: React.CSSProperties;
}

// Shared inline styles
const inlineInputStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '13px',
  border: `1px solid ${v(tokens.colorBorder)}`,
  borderRadius: v(tokens.radiusSm),
  backgroundColor: v(tokens.colorBgSubtle),
  color: v(tokens.colorText),
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const inlineSelectStyle: React.CSSProperties = {
  ...inlineInputStyle,
  appearance: 'auto' as const,
  width: '120px',
};

export function SchemaEditor({ value, onChange, label, description, style }: SchemaEditorProps) {
  injectBaseStyles();

  const [mode, setMode] = useState<'guided' | 'raw'>('guided');
  const [rawValue, setRawValue] = useState(JSON.stringify(value || {}, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));

  const handleModeSwitch = (newMode: 'guided' | 'raw') => {
    if (newMode === 'raw') {
      setRawValue(JSON.stringify(value || {}, null, 2));
      setJsonError(null);
    }
    setMode(newMode);
  };

  const handleRawChange = (newRaw: string) => {
    setRawValue(newRaw);
    try {
      const parsed = JSON.parse(newRaw);
      setJsonError(null);
      onChange(parsed);
    } catch (e) {
      setJsonError((e as Error).message);
    }
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const updateSchema = (updates: Record<string, unknown>) => {
    onChange({ ...(value || {}), ...updates });
  };

  const addProperty = () => {
    const properties = (value?.properties || {}) as Record<string, SchemaProperty>;
    const newKey = `property_${Object.keys(properties).length + 1}`;
    updateSchema({
      type: 'object',
      properties: {
        ...properties,
        [newKey]: { type: 'string' },
      },
    });
    setExpandedPaths(new Set([...expandedPaths, 'root']));
  };

  const removeProperty = (key: string) => {
    const properties = { ...((value?.properties || {}) as Record<string, SchemaProperty>) };
    delete properties[key];
    const required = ((value?.required || []) as string[]).filter((r) => r !== key);
    updateSchema({
      properties,
      required: required.length > 0 ? required : undefined,
    });
  };

  const updateProperty = (key: string, updates: Partial<SchemaProperty>) => {
    const properties = (value?.properties || {}) as Record<string, SchemaProperty>;
    updateSchema({
      properties: {
        ...properties,
        [key]: { ...properties[key], ...updates },
      },
    });
  };

  const renameProperty = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || !newKey) return;
    const properties = { ...((value?.properties || {}) as Record<string, SchemaProperty>) };
    const propValue = properties[oldKey];
    delete properties[oldKey];
    properties[newKey] = propValue;

    const required = ((value?.required || []) as string[]).map((r) => (r === oldKey ? newKey : r));
    updateSchema({
      properties,
      required: required.length > 0 ? required : undefined,
    });
  };

  const toggleRequired = (key: string) => {
    const required = (value?.required || []) as string[];
    const newRequired = required.includes(key)
      ? required.filter((r) => r !== key)
      : [...required, key];
    updateSchema({
      required: newRequired.length > 0 ? newRequired : undefined,
    });
  };

  const PropertyEditor = ({
    propKey,
    prop,
    path,
  }: {
    propKey: string;
    prop: SchemaProperty;
    path: string;
  }) => {
    const [localKey, setLocalKey] = useState(propKey);
    const [localDescription, setLocalDescription] = useState(prop.description || '');
    const [localDefault, setLocalDefault] = useState(String(prop.default ?? ''));

    useEffect(() => { setLocalKey(propKey); }, [propKey]);
    useEffect(() => { setLocalDescription(prop.description || ''); }, [prop.description]);
    useEffect(() => { setLocalDefault(String(prop.default ?? '')); }, [prop.default]);

    const isExpanded = expandedPaths.has(path);
    const isRequired = ((value?.required || []) as string[]).includes(propKey);
    const propType = (Array.isArray(prop.type) ? prop.type[0] : prop.type || 'string') as JSONSchemaType;
    const isComplex = propType === 'object' || propType === 'array';

    return (
      <div
        style={{
          border: `1px solid ${v(tokens.colorGlassBorder)}`,
          borderRadius: v(tokens.radiusMd),
          padding: '12px',
          backgroundColor: v(tokens.colorBgElevated),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          {isComplex && (
            <button
              type="button"
              onClick={() => toggleExpanded(path)}
              style={{
                marginTop: '4px',
                color: v(tokens.colorTextMuted),
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
              }}
            >
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </button>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Property Name, Type, Required, Delete */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                onBlur={() => {
                  if (localKey && localKey !== propKey) {
                    renameProperty(propKey, localKey);
                  }
                }}
                placeholder="property_name"
                style={{ ...inlineInputStyle, width: '160px', fontWeight: 500 }}
              />

              <select
                value={propType}
                onChange={(e) => {
                  const newType = e.target.value as JSONSchemaType;
                  const updates: Partial<SchemaProperty> = { type: newType };
                  if (newType === 'object') {
                    updates.properties = prop.properties || {};
                  } else if (newType === 'array') {
                    updates.items = prop.items || { type: 'string' };
                  }
                  updateProperty(propKey, updates);
                }}
                style={inlineSelectStyle}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="integer">Integer</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '13px',
                  color: v(tokens.colorTextMuted),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={() => toggleRequired(propKey)}
                  style={{ marginRight: '4px' }}
                />
                Required
              </label>

              <button
                type="button"
                onClick={() => removeProperty(propKey)}
                style={{
                  marginLeft: 'auto',
                  color: v(tokens.colorDanger),
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                <TrashIcon />
              </button>
            </div>

            {/* Description */}
            <input
              type="text"
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              onBlur={() => {
                updateProperty(propKey, { description: localDescription || undefined });
              }}
              placeholder="Description (optional)"
              style={{ ...inlineInputStyle, width: '100%' }}
            />

            {/* Array items type */}
            {propType === 'array' && isExpanded && (
              <div
                style={{
                  marginLeft: '16px',
                  paddingLeft: '16px',
                  borderLeft: `2px solid ${v(tokens.colorGlassBorder)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: v(tokens.colorTextMuted),
                  }}
                >
                  Array Item Type
                </label>
                <select
                  value={((prop.items as Record<string, unknown>)?.type as string) || 'string'}
                  onChange={(e) =>
                    updateProperty(propKey, {
                      items: {
                        ...((prop.items as Record<string, unknown>) || {}),
                        type: e.target.value,
                      },
                    })
                  }
                  style={inlineSelectStyle}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="integer">Integer</option>
                  <option value="boolean">Boolean</option>
                  <option value="object">Object</option>
                </select>
              </div>
            )}

            {/* Nested object properties */}
            {propType === 'object' && isExpanded && (
              <div
                style={{
                  marginLeft: '16px',
                  paddingLeft: '16px',
                  borderLeft: `2px solid ${v(tokens.colorGlassBorder)}`,
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: v(tokens.colorTextMuted),
                    marginBottom: '8px',
                  }}
                >
                  Nested Properties
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(prop.properties || {}).map(([nestedKey, nestedProp], nestedIndex) => (
                    <PropertyEditor
                      key={`${path}.${nestedKey}-${nestedIndex}`}
                      propKey={nestedKey}
                      prop={nestedProp as SchemaProperty}
                      path={`${path}.${nestedKey}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const nested = { ...(prop.properties || {}) };
                      const newKey = `nested_${Object.keys(nested).length + 1}`;
                      nested[newKey] = { type: 'string' };
                      updateProperty(propKey, { properties: nested });
                    }}
                    style={{
                      fontSize: '13px',
                      color: v(tokens.colorPrimary),
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <PlusIcon />
                    Add Nested Property
                  </button>
                </div>
              </div>
            )}

            {/* Default value for simple types */}
            {(propType === 'string' || propType === 'number' || propType === 'integer') && (
              <input
                type={propType === 'string' ? 'text' : 'number'}
                value={localDefault}
                onChange={(e) => setLocalDefault(e.target.value)}
                onBlur={() => {
                  const val = propType === 'string' ? localDefault : Number(localDefault);
                  updateProperty(propKey, { default: val || undefined });
                }}
                placeholder="Default value (optional)"
                style={{ ...inlineInputStyle, width: '100%' }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const modeButtonBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    borderRadius: v(tokens.radiusSm),
    border: 'none',
    cursor: 'pointer',
    transition: 'background 150ms ease',
  };

  return (
    <div style={style}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 500,
            color: v(tokens.colorTextMuted),
            marginBottom: '8px',
          }}
        >
          {label}
        </label>
      )}
      {description && (
        <p style={{ fontSize: '13px', color: v(tokens.colorTextMuted), marginTop: 0, marginBottom: '8px' }}>
          {description}
        </p>
      )}

      {/* Mode Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <button
          type="button"
          onClick={() => handleModeSwitch('guided')}
          style={{
            ...modeButtonBase,
            backgroundColor: mode === 'guided' ? v(tokens.colorPrimaryMuted) : v(tokens.colorBgElevated),
            color: mode === 'guided' ? v(tokens.colorPrimary) : v(tokens.colorTextMuted),
            fontWeight: mode === 'guided' ? 500 : 400,
          }}
        >
          <LayoutIcon />
          Guided
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('raw')}
          style={{
            ...modeButtonBase,
            backgroundColor: mode === 'raw' ? v(tokens.colorPrimaryMuted) : v(tokens.colorBgElevated),
            color: mode === 'raw' ? v(tokens.colorPrimary) : v(tokens.colorTextMuted),
            fontWeight: mode === 'raw' ? 500 : 400,
          }}
        >
          <CodeIcon />
          Raw JSON
        </button>
      </div>

      {/* Editor Content */}
      {mode === 'guided' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries((value?.properties || {}) as Record<string, SchemaProperty>).map(
              ([key, prop], index) => (
                <PropertyEditor
                  key={`root.${key}-${index}`}
                  propKey={key}
                  prop={prop}
                  path={`root.${key}`}
                />
              )
            )}
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={addProperty} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PlusIcon />
            Add Property
          </Button>

          {Object.keys((value?.properties || {}) as Record<string, unknown>).length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '32px 16px',
                color: v(tokens.colorTextMuted),
                fontSize: '13px',
                border: `2px dashed ${v(tokens.colorBorder)}`,
                borderRadius: v(tokens.radiusMd),
              }}
            >
              No properties defined. Click "Add Property" to get started.
            </div>
          )}
        </div>
      ) : (
        <div>
          <Textarea
            value={rawValue}
            onChange={(e) => handleRawChange(e.target.value)}
            rows={12}
            placeholder='{"type": "object", "properties": {...}}'
            error={jsonError || undefined}
            style={{ fontFamily: v(tokens.fontMono) }}
          />
        </div>
      )}
    </div>
  );
}
