// Import necessary modules
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default [
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/.expo/*'],
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'prettier/prettier': [
        'error',
        {
          quoteProps: 'consistent',
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
    },
    settings: {
      prettier: {
        quoteProps: 'consistent',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
    },
  },
];
