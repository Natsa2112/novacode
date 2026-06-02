// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.wrangler/**',
      'node_modules/**',
      'worker-configuration.d.ts',
      'public/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'log'] }],
    },
  },
  ...astro.configs.recommended,
  {
    files: ['*.astro'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['src/pages/api/**'],
    rules: {
      'no-console': 'off',
    },
  },
];
