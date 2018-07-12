module.exports = {
    parserOptions: {
      ecmaVersion: 2017,
      sourceType: 'module',
    },
    extends: ['eslint:recommended', 'airbnb-base'],
    env: {
      node: true,
    },
    rules: {
      'class-methods-use-this': 'off',
      'no-magic-numbers': ['error', { ignoreArrayIndexes: true, ignore: [0, 1, -1]}],
    },
    globals: {
      jest: false,
      expect: false,
      describe: false,
      test: false,
      beforeAll: false,
      beforeEach: false,
      afterAll: false,
      afterEach: false,
    },
  };
  