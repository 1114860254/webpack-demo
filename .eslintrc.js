module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    "no-var":2
  },
  env: {
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
}