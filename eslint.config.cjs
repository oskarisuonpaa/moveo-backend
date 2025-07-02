// eslint.config.cjs
const { FlatCompat } = require('@eslint/eslintrc');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

// Tell FlatCompat how to load eslint:recommended **and** our TS bits
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {
    parser: tsParser,
    plugins: { '@typescript-eslint': tsPlugin },
  },
});

module.exports = [
  // 1) ignore artifacts
  { ignores: ['node_modules/**', 'dist/**', 'build/**'] },

  // 2) bring in TS recommended + prettier
  ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier'),

  // 3) apply to your .ts files
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    rules: {
      // any overrides go here
    },
  },
];
