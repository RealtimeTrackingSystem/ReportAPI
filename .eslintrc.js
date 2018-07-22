module.exports = {
  'env': {
      'es6': true,
      'browser': true,
      'node': true,
      'mocha': true
  },
  'extends': [
      'eslint:recommended'
  ],
  'parserOptions': {
      'ecmaVersion': 7,
      'sourceType': 'module'
  },
  'plugins': [],
  'rules': {
      'indent': ['warn', 2, {
          'SwitchCase': 1
      }],
      'linebreak-style': ['warn', 'unix'],
      'quotes': ['warn', 'single'],
      'no-console': ['off'],
      'no-unused-vars': ['warn'],
      'no-undef':  ['warn'],
      'semi': ['warn', 'always'],
      'space-before-function-paren': 2,
      'func-call-spacing': [2, 'never'],
      'func-style': [1, 'declaration']
  }
}
