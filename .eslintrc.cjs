module.exports = {
  env: {
    es2021: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:n/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'standard',

    // Make sure to put "prettier" last, so it gets the chance to override other configs
    'prettier',
  ],
  overrides: [
    {
      files: ['test/**'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        'jest/prefer-expect-assertions': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }],
    'prefer-const': 'off',

    'import/no-unresolved': 'off',

    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',

    '@typescript-eslint/no-unused-vars': 'off',
  },
}
