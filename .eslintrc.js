module.exports = {
  extends: 'noftalint',
  rules: {
    'capitalized-comments': 'off',
    // For some reason it cannot find this rule, so we disable it for now
    'unicorn/prefer-replace-all': 'off',
  },
  env: {
    browser: true,
    jquery: true,
  },
  globals: {},
};
