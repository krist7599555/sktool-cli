// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: [
    'eslint:recommended', // https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js
    'plugin:@typescript-eslint/recommended', // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended.ts
    'plugin:prettier/recommended', // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'plugin:svelte/recommended', // https://sveltejs.github.io/eslint-plugin-svelte/user-guide/
    'plugin:svelte/prettier', // https://github.com/sveltejs/eslint-plugin-svelte/blob/main/src/configs/prettier.ts
    'plugin:tailwindcss/recommended', // https://github.com/francoismassart/eslint-plugin-tailwindcss/blob/master/lib/index.js#L24
    'plugin:unicorn/recommended' // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/configs/recommended.js
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'json-format', 'html'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  rules: {
    'svelte/prefer-style-directive': ['warn'],
    'svelte/require-stores-init': 'error',
    'svelte/no-useless-mustaches': ['warn'],
    'svelte/prefer-destructured-store-props': ['warn'],
    'svelte/button-has-type': ['error'],
    'svelte/sort-attributes': ['error'],
    'svelte/no-at-html-tags': 'off',
    'svelte/no-target-blank': ['warn'],
    'one-var': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^svelte', '^\\.\\/\\$types', '^\\$app', '^@sveltejs'],
          ['^[a-z@]'],
          ['^\\$'],
          ['^\\.']
        ]
      }
    ]
  },
  settings: {}
});
