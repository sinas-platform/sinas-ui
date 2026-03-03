import React, { useState } from 'react';
import { v, tokens, injectBaseStyles } from '../theme/tokens';
import { Select } from '../forms/Select';

export interface FilePickerProps {
  mode: 'file';
  collections: Array<{ namespace: string; name: string }>;
  loadFiles: (ns: string, coll: string) => Promise<Array<{ id: string; name: string; content_type: string }>>;
  value?: string;
  onChange: (ref: string | null) => void;
  contentTypeFilter?: string;
  label?: string;
  fileBaseUrl?: string;
  style?: React.CSSProperties;
}

export interface CollectionSelectorProps {
  mode: 'collections';
  collections: Array<{ namespace: string; name: string }>;
  value?: string[];
  onChange: (refs: string[]) => void;
  label?: string;
  style?: React.CSSProperties;
}

export type CollectionBrowserProps = FilePickerProps | CollectionSelectorProps;

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: v(tokens.colorTextMuted),
  marginBottom: '6px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase' as const,
};

export function CollectionBrowser(props: CollectionBrowserProps) {
  injectBaseStyles();

  if (props.mode === 'collections') {
    return <CollectionSelector {...props} />;
  }
  return <FilePicker {...props} />;
}

function CollectionSelector({ collections, value = [], onChange, label, style }: CollectionSelectorProps) {
  return (
    <div style={style}>
      {label && <label style={labelStyle}>{label}</label>}
      {collections.length > 0 ? (
        <div
          style={{
            border: `1px solid ${v(tokens.colorGlassBorder)}`,
            borderRadius: v(tokens.radiusMd),
            padding: '12px',
            maxHeight: '256px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {collections.map((coll) => {
            const ref = `${coll.namespace}/${coll.name}`;
            const checked = value.includes(ref);
            return (
              <label
                key={ref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: v(tokens.radiusSm),
                  cursor: 'pointer',
                  transition: 'background 100ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = v(tokens.colorGlassHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...value, ref]
                      : value.filter((r) => r !== ref);
                    onChange(updated);
                  }}
                  style={{ width: '16px', height: '16px', marginRight: '12px' }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: v(tokens.colorText),
                    fontFamily: v(tokens.fontMono),
                  }}
                >
                  {ref}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            backgroundColor: v(tokens.colorBgSubtle),
            borderRadius: v(tokens.radiusMd),
            padding: '12px',
            border: `1px solid ${v(tokens.colorGlassBorder)}`,
          }}
        >
          <p style={{ fontSize: '13px', color: v(tokens.colorTextMuted), margin: 0 }}>
            No collections available. Create collections first.
          </p>
        </div>
      )}
    </div>
  );
}

function FilePicker({
  collections,
  loadFiles,
  value,
  onChange,
  contentTypeFilter,
  label,
  fileBaseUrl = '',
  style,
}: FilePickerProps) {
  const [files, setFiles] = useState<Array<{ id: string; name: string; content_type: string }>>([]);
  const [selectedNs, setSelectedNs] = useState('');
  const [selectedColl, setSelectedColl] = useState('');

  const handleCollectionChange = async (collRef: string) => {
    if (!collRef) {
      setSelectedNs('');
      setSelectedColl('');
      setFiles([]);
      return;
    }
    const [ns, coll] = collRef.split('/');
    setSelectedNs(ns);
    setSelectedColl(coll);
    try {
      let loaded = await loadFiles(ns, coll);
      if (contentTypeFilter) {
        loaded = loaded.filter((f) => f.content_type?.startsWith(contentTypeFilter));
      }
      setFiles(loaded);
    } catch {
      setFiles([]);
    }
  };

  const selectedRef = selectedNs && selectedColl ? `${selectedNs}/${selectedColl}` : '';

  return (
    <div style={style}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Select
          options={collections.map((c) => ({
            value: `${c.namespace}/${c.name}`,
            label: `${c.namespace}/${c.name}`,
          }))}
          value={selectedRef}
          onChange={(e) => handleCollectionChange(e.target.value)}
          placeholder="Select collection..."
        />

        {files.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '8px',
              maxHeight: '128px',
              overflowY: 'auto',
            }}
          >
            {files.map((f) => {
              const ref = `collection:${selectedNs}/${selectedColl}/${f.name}`;
              const isSelected = value === ref;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange(isSelected ? null : ref)}
                  title={f.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: v(tokens.radiusSm),
                    border: `2px solid ${isSelected ? v(tokens.colorPrimary) : 'transparent'}`,
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    background: v(tokens.colorBgSubtle),
                    transition: 'border-color 100ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = v(tokens.colorTextMuted);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <img
                    src={`${fileBaseUrl}/files/public/${selectedNs}/${selectedColl}/${f.name}`}
                    alt={f.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Current value display */}
        {value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                color: v(tokens.colorTextMuted),
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {value}
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              style={{
                fontSize: '12px',
                color: v(tokens.colorDanger),
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
