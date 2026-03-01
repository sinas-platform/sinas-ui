import { defineConfig } from 'tsup';

export default defineConfig([
  // npm (ESM + CJS + types)
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['react', '@sinas/sdk'],
    clean: true,
    sourcemap: true,
  },
  // iframe runtime (IIFE → window.SinasUI)
  {
    entry: { 'sinas-ui.umd': 'src/index.ts' },
    format: ['iife'],
    globalName: 'SinasUI',
    outExtension: () => ({ js: '.js' }),
    external: ['react', '@sinas/sdk'],
    sourcemap: true,
  },
]);
