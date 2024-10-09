// @ts-check

import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import importX from 'eslint-plugin-import-x'

export default tseslint.config({
  files: ['**/*.{mjs,cjs,js,ts}'],
  ignores: ['**/*.{config,test}.{mjs,cjs,js,ts}', '.*.mjs'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    prettier,
    'import-x': importX,
  },

  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
    },
  },
  rules: {
    // ImportX rules
    ...importX.configs.recommended.rules,
    'import-x/no-unresolved': 'off',
    'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],

    // Prettier rules
    'prettier/prettier': 'error',

    // TypeScript rules
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
})
