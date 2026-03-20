import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      '@stylistic': stylistic,
      prettier,
    },

    rules: {
      // 等价于 plugin:@typescript-eslint/recommended
      ...tsPlugin.configs.recommended.rules,

      // 等价于 plugin:prettier/recommended
      ...prettier.configs.recommended.rules,

      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-namespace': 'off',

      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],

      'multiline-ternary': ['error', 'always-multiline'],
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];
