import unocss from '@unocss/eslint-config/flat'
import { defineConfig } from 'eslint-config-hyoban'

export default defineConfig(
  {
    react: 'vite',
    restrictedSyntax: ['jsx', 'tsx'],
    strict: true,
  },
  {
    ...unocss,
  },
  {
    rules: {
      'simple-import-sort/exports': 'off',
      'unicorn/new-for-builtins': 'off',
      '@typescript-eslint/array-type': 'off',
      '@stylistic/multiline-ternary': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      'antfu/consistent-list-newline': 'off',
      '@stylistic/jsx-closing-bracket-location': 'off',
      '@stylistic/brace-style': 'off',
      'antfu/if-newline': 'off',
      '@stylistic/operator-linebreak': 'off',
      'arrow-body-style': 'off',
      'unicorn/prefer-number-properties': 'off',
      '@stylistic/member-delimiter-style': 'off',
      'antfu/top-level-function': 'off',
      'simple-import-sort/imports': 'off',
      '@stylistic/semi': 'off',
    },
  }
)
