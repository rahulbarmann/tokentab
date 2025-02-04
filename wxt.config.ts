/* eslint-disable antfu/if-newline */
/* eslint-disable @stylistic/arrow-parens */
/* eslint-disable antfu/consistent-list-newline */
/* eslint-disable @stylistic/comma-dangle */
/* eslint-disable simple-import-sort/imports */
import { resolve } from 'node:path'
import type { Manifest } from 'webextension-polyfill'

import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'
import Pages from 'vite-plugin-pages'
import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  vite: () => ({
    plugins: [
      react(),
      UnoCSS(),
      nodePolyfills(),
      AutoImport({
        imports: ['react'],
        dts: './auto-imports.d.ts',
        dirs: ['./src/components/ui'],
      }),
      Pages({
        dirs: [{ dir: 'src/entrypoints/sidepanel/pages', baseRoute: '' }],
        exclude: ['**/[A-Z]*.tsx'],
        importMode: 'sync',
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
    permissions: ['storage', 'sidePanel'],
    action: {
      default_title: 'Click to open oracle panel',
    },
    web_accessible_resources: [
      {
        resources: ['fonts/*.ttf'],
        matches: ['*://*/*'],
      },
    ],
    // @ts-expect-error chrome_url_overrides is valid for Chrome extensions
    chrome_url_overrides: {
      newtab: 'src/entrypoints/newtab/index.html',
    },
  } satisfies Partial<Manifest.WebExtensionManifest>,
})
