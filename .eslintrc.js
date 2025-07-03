module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2020,
  },

  plugins: ['@typescript-eslint', 'prettier', 'import'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],

  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

  env: {
    node: true,
    es6: true,
  },

  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.eslintrc.js'],

  rules: {
    'import/no-unresolved': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
  },

  overrides: [
    {
      files: ['src/**/*.ts'],
    },
  ],
};
