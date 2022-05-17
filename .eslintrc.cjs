/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  env: {
    'vue/setup-compiler-macros': true
  },
  rules: {
    'quote-props': [2, 'as-needed'],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};
