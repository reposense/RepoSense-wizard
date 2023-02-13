/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'plugin:vue-pug/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
  ],
  overrides: [
    {
      // Cypress-specific configuration
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended',
        'airbnb-base',
        'airbnb-typescript/base'
      ],
      'parserOptions': {
        project: [
          './cypress/e2e/tsconfig.json',
        ]
      },
      rules: {
        'linebreak-style': 0,
      },
    },
    {
      // TypeScript-specific configuration
      files: [
        'src/**/*.ts'
      ],
      'extends': [
        'airbnb-base',
        'airbnb-typescript/base'
      ],
      'parserOptions': {
        project: [
          './tsconfig.app.json',
        ]
      },
      rules: {
        'linebreak-style': 0,
        'max-len': [
          'error',
          {
            'code': 120,
            'ignoreComments': true,
          }
        ]
      },
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  }
}
