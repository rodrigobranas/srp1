const js = require('@eslint/js')
const globals = require('globals')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')

module.exports = [
  { ignores: ['dist/**', 'coverage/**'] },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]
