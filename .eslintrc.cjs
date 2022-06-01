module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:n/recommended',
    'plugin:promise/recommended',
    'standard',

    // Make sure to put "prettier" last, so it gets the chance to override other configs
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'prefer-const': 'off',

    'import/no-unresolved': 'off',

    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
  },
}
