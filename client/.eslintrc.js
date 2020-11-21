module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    sourceType: 'module',
    useJSXTextNode: true,
    project: 'tsconfig.json',
  },
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    browser: true,
    jest: true,
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],
  },
};
