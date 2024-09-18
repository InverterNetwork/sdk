// @ts-check

import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'

export default tseslint.config({
  files: ['**/*.{mjs,cjs,js,ts}'],
  ignores: ['**/*.{config,test}.{mjs,cjs,js,ts}', '.*.mjs'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    prettier,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
    },
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': 'error',
  },
})
