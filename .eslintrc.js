module.exports = {
    'extends': 'airbnb-base',
    "parserOptions": {
        "ecmaVersion": 8
    },
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-trailing-spaces': 0,
        'no-multiple-empty-lines': 0,
        'one-var': 0,
        'padded-blocks': 0,
        'linebreak-style': 0,
        'comma-dangle': ['error', 'never'],
        'func-names': 0,
        'prefer-arrow-callback': 0,
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-unused-vars': 0,
        'consistent-return': 0,
        'prefer-template': 0,
        'object-curly-newline': 0,
        'no-underscore-dangle': 0,
        'no-shadow': 0,
        'camelcase': 0,
        'no-prototype-builtins': 0,
        'no-restricted-syntax': 0,
        'no-param-reassign': 0,
        'no-plusplus': 0,
        'no-await-in-loop': 0,
        'no-loop-func': 0
      }
};