module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'standard',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
  },
  plugins: ['jest'],
}
