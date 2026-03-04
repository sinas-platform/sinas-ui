import React from 'react';
import { v, tokens } from '../theme/tokens';

export interface ToolCallCardProps {
  type: 'call' | 'response';
  name: string;
  content: string;
  /** Show a running/in-progress indicator with optional status description */
  running?: boolean;
  /** Status description to show while running (from status_templates) */
  statusText?: string;
}

const WrenchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: 'transform 150ms ease',
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function formatContent(content: string): string {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return content;
  }
}

export function ToolCallCard({ type, name, content, running, statusText }: ToolCallCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const isCall = type === 'call';

  const tint = isCall
    ? { bg: 'rgba(249, 115, 22, 0.06)', border: 'rgba(249, 115, 22, 0.15)', text: '#fb923c' }
    : { bg: 'rgba(168, 34, 50, 0.06)', border: 'rgba(168, 34, 50, 0.15)', text: '#d4556a' };

  return (
    <div
      style={{
        borderRadius: v(tokens.radiusMd),
        border: `1px solid ${tint.border}`,
        backgroundColor: tint.bg,
        fontSize: '13px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
          padding: '8px 12px',
          background: 'none',
          border: 'none',
          color: tint.text,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '13px',
          textAlign: 'left',
        }}
      >
        <WrenchIcon />
        <span style={{ fontWeight: 500 }}>
          {isCall ? 'Called' : 'Response from'} {name}
        </span>
        {running && (
          <span
            style={{
              marginLeft: '4px',
              color: v(tokens.colorTextMuted),
              fontWeight: 400,
              animation: 'sinas-pulse 1.5s ease-in-out infinite',
            }}
          >
            {statusText ? `— ${statusText}` : '— running...'}
          </span>
        )}
        <span style={{ marginLeft: 'auto' }}>
          <ChevronIcon expanded={expanded} />
        </span>
      </button>
      {expanded && content && (
        <pre
          style={{
            margin: 0,
            padding: '10px 12px',
            borderTop: `1px solid ${tint.border}`,
            background: 'rgba(0, 0, 0, 0.2)',
            color: v(tokens.colorTextMuted),
            fontFamily: v(tokens.fontMono),
            fontSize: '12px',
            lineHeight: '1.5',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {formatContent(content)}
        </pre>
      )}
    </div>
  );
}
