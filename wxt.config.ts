/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prefer-module */
import { resolve } from 'node:path'
import type { Manifest } from 'webextension-polyfill'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  vite: () => ({
    plugins: [
      react(),
      tailwindcss(),
      nodePolyfills(),
      AutoImport({
        imports: ['react'],
        dts: './auto-imports.d.ts',
        dirs: ['./src/components/ui'],
      }),
      Icons({
        compiler: 'jsx',
        jsx: 'react',
        customCollections: {
          'op-icons': FileSystemIconLoader(`${resolve(__dirname, 'src/assets/icons')}/`, (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ),
        },
      }),
    ],
    build: {
      rollupOptions: {
        onLog(level, log, handler) {
          // ignore rollup warning about 'use client'
          if (log.message.includes('Module level directives cause errors when bundled')) return

          // ignore sourcemap warning about 'Can't resolve original location of error.'
          if (log.cause && (log.cause as any).message === `Can't resolve original location of error.`) {
            return
          }

          handler(level, log)
        },
      },
    },
  }),
  manifest: {
    name: 'TokenTab',
    version: '1.0.4',
    host_permissions: ['https://us.i.posthog.com/*', 'https://api.tokentab.io/*'],
    web_accessible_resources: [
      {
        resources: ['fonts/*.ttf', 'assets/external-scripts/*'],
        matches: ['*://*/*'],
      },
    ],
    // @ts-expect-error chrome_url_overrides is valid for Chrome extensions
    chrome_url_overrides: {
      newtab: 'src/entrypoints/newtab/index.html',
    },
  } satisfies Partial<Manifest.WebExtensionManifest>,
})
