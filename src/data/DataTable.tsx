import React from 'react';
import { v, tokens } from '../theme/tokens';
import type { ColumnDef } from '../types';

export interface DataTableProps {
  data: Record<string, unknown>[];
  columns?: ColumnDef[];
  sortable?: boolean;
  onRowClick?: (row: Record<string, unknown>, index: number) => void;
  style?: React.CSSProperties;
}

export function DataTable({
  data = [],
  columns,
  sortable = false,
  onRowClick,
  style,
  ...props
}: DataTableProps & React.HTMLAttributes<HTMLTableElement>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  if (!data.length) {
    return (
      <p style={{ color: v(tokens.colorTextMuted), padding: '16px' }}>No data</p>
    );
  }

  const cols: ColumnDef[] =
    columns || Object.keys(data[0]).map(key => ({ key, label: key }));

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  let rows = data;
  if (sortable && sortKey) {
    rows = [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        ...style,
      }}
      {...props}
    >
      <thead>
        <tr>
          {cols.map(col => (
            <th
              key={col.key}
              onClick={() => handleSort(col.key)}
              style={{
                textAlign: 'left',
                padding: '8px 12px',
                borderBottom: `2px solid ${v(tokens.colorBorder)}`,
                fontWeight: 600,
                color: v(tokens.colorTextMuted),
                cursor: sortable ? 'pointer' : 'default',
                userSelect: sortable ? 'none' : undefined,
              }}
            >
              {col.label}
              {sortable && sortKey === col.key && (sortDir === 'asc' ? ' \u2191' : ' \u2193')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            onClick={onRowClick ? () => onRowClick(row, i) : undefined}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {cols.map(col => (
              <td
                key={col.key}
                style={{
                  padding: '8px 12px',
                  borderBottom: `1px solid ${v(tokens.colorBgSubtle)}`,
                  color: v(tokens.colorText),
                }}
              >
                {col.render
                  ? col.render(row[col.key], row)
                  : String(row[col.key] ?? '')}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
