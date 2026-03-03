import React from 'react';
import { v, tokens } from '../theme/tokens';
import type { MessageContent, ContentPart } from '@sinas/sdk';

export interface ChatInputProps {
  onSend: (content: MessageContent) => void;
  onStop?: () => void;
  streaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

type AttachmentType = 'image' | 'audio' | 'file';

interface Attachment {
  id: string;
  file: File;
  preview?: string;
  type: AttachmentType;
}

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MusicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function ChatInput({
  onSend,
  onStop,
  streaming = false,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [value, setValue] = React.useState('');
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || disabled) return;

    if (attachments.length > 0) {
      const parts: ContentPart[] = [];

      if (trimmed) {
        parts.push({ type: 'text', text: trimmed });
      }

      for (const attachment of attachments) {
        const base64 = await fileToBase64(attachment.file);

        if (attachment.type === 'image') {
          parts.push({ type: 'image', image: base64 });
        } else if (attachment.type === 'audio') {
          const format = attachment.file.name.split('.').pop() || 'mp3';
          parts.push({
            type: 'audio',
            data: base64.split(',')[1],
            format,
          });
        } else {
          parts.push({
            type: 'file',
            file_data: base64.split(',')[1],
            filename: attachment.file.name,
            mime_type: attachment.file.type,
          });
        }
      }

      onSend(parts);
    } else {
      onSend(trimmed);
    }

    setValue('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (streaming) return;
      handleSubmit();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const id = Math.random().toString(36).slice(2);
      let type: AttachmentType = 'file';
      let preview: string | undefined;

      if (file.type.startsWith('image/')) {
        type = 'image';
        preview = await fileToBase64(file);
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      }

      setAttachments((prev) => [...prev, { id, file, preview, type }]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const hasContent = value.trim() || attachments.length > 0;

  return (
    <div
      style={{
        borderTop: `1px solid ${v(tokens.colorBorder)}`,
        backgroundColor: v(tokens.colorBgSubtle),
      }}
    >
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '10px 16px 0',
          }}
        >
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 10px',
                borderRadius: v(tokens.radiusMd),
                backgroundColor: v(tokens.colorBgElevated),
                border: `1px solid ${v(tokens.colorBorder)}`,
                fontSize: '13px',
                color: v(tokens.colorTextMuted),
              }}
            >
              {attachment.type === 'image' && attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  style={{
                    width: '36px',
                    height: '36px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ) : attachment.type === 'audio' ? (
                <MusicIcon />
              ) : (
                <FileIcon />
              )}
              <span
                style={{
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {attachment.file.name}
              </span>
              <button
                onClick={() => removeAttachment(attachment.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: v(tokens.colorTextMuted),
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  opacity: 0.7,
                }}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          padding: '12px 16px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          multiple
          accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.csv,.json,.xml,.yaml,.yml"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || streaming}
          style={{
            width: '40px',
            height: '42px',
            borderRadius: v(tokens.radiusMd),
            border: `1px solid ${v(tokens.colorBorder)}`,
            backgroundColor: 'transparent',
            color: v(tokens.colorTextMuted),
            cursor: disabled || streaming ? 'not-allowed' : 'pointer',
            opacity: disabled || streaming ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PaperclipIcon />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            padding: '10px 14px',
            borderRadius: v(tokens.radiusMd),
            border: `1px solid ${v(tokens.colorBorder)}`,
            backgroundColor: v(tokens.colorBg),
            color: v(tokens.colorText),
            fontFamily: v(tokens.fontSans),
            fontSize: '14px',
            lineHeight: '1.5',
            outline: 'none',
            minHeight: '42px',
            maxHeight: '150px',
          }}
        />
        {streaming ? (
          <button
            onClick={onStop}
            style={{
              width: '40px',
              height: '42px',
              borderRadius: v(tokens.radiusMd),
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <StopIcon />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={disabled || !hasContent}
            style={{
              width: '40px',
              height: '42px',
              borderRadius: v(tokens.radiusMd),
              border: 'none',
              backgroundColor: v(tokens.colorPrimary),
              color: '#fff',
              cursor: disabled || !hasContent ? 'not-allowed' : 'pointer',
              opacity: disabled || !hasContent ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'opacity 150ms ease',
            }}
          >
            <SendIcon />
          </button>
        )}
      </div>
    </div>
  );
}
