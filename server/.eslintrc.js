module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
  },
  env: {
    node: true,
    es6: true,
    'jest/globals': true,
  },
};
