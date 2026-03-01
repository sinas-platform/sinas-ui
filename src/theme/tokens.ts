/**
 * CSS custom property tokens for theming.
 * Components read these at runtime via var().
 * Override by setting CSS custom properties on a parent element or via css_overrides.
 */

export const tokens = {
  // Colors
  colorPrimary: '--sinas-color-primary',
  colorDanger: '--sinas-color-danger',
  colorSuccess: '--sinas-color-success',
  colorText: '--sinas-color-text',
  colorTextMuted: '--sinas-color-text-muted',
  colorBorder: '--sinas-color-border',
  colorBg: '--sinas-color-bg',
  colorBgSubtle: '--sinas-color-bg-subtle',

  // Radii
  radiusSm: '--sinas-radius-sm',
  radiusMd: '--sinas-radius-md',
  radiusLg: '--sinas-radius-lg',

  // Typography
  fontSans: '--sinas-font-sans',
  fontMono: '--sinas-font-mono',
} as const;

export const defaults: Record<string, string> = {
  [tokens.colorPrimary]: '#3b82f6',
  [tokens.colorDanger]: '#ef4444',
  [tokens.colorSuccess]: '#22c55e',
  [tokens.colorText]: '#1e293b',
  [tokens.colorTextMuted]: '#64748b',
  [tokens.colorBorder]: '#e2e8f0',
  [tokens.colorBg]: '#ffffff',
  [tokens.colorBgSubtle]: '#f8fafc',
  [tokens.radiusSm]: '4px',
  [tokens.radiusMd]: '6px',
  [tokens.radiusLg]: '8px',
  [tokens.fontSans]: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  [tokens.fontMono]: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
};

/** Helper: read a CSS var with fallback to default */
export function v(token: string): string {
  return `var(${token}, ${defaults[token] || ''})`;
}
