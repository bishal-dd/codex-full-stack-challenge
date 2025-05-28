import pluginJs from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import json from 'eslint-plugin-json';
import playwright from 'eslint-plugin-playwright';
import vue from 'eslint-plugin-vue';
import yml from 'eslint-plugin-yml';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const config = [
  { ignores: ['**/lib/', '**/dist/', '**/node_modules/', '**/components/ui/', '**/.terraform/', 'vitest.workspace.ts'] },
  { files: ['**/*.{js,mjs,cjs,ts}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ['**/*.test.{js,mjs,cjs,ts}'],
    ...vitest.configs.recommended,
  },
  { files: ['**/*.{js,mjs,cjs,ts}'], rules: pluginJs.configs.recommended.rules },
  ...tseslint.configs.strictTypeChecked.map(c => ({ ...c, files: ['**/*.ts'] })),
  // overrides for ts eslint
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': [0],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  ...yml.configs['flat/recommended'].map(c => ({ ...c, files: ['**/*.{yaml,yml}'] })),
  ...vue.configs['flat/recommended'].map(c => ({ ...c, files: ['**/*.vue'] })),
  {
    files: ['**/e2e/*.ts'],
    ...playwright.configs['flat/recommended'],
  },
  {
    files: ['**/*.json'],
    ...json.configs['recommended'],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/block-order': [
        'error',
        {
          order: [['script', 'template'], 'style'],
        },
      ],
    },
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
];

export default config;
