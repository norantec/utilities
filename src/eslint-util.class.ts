import * as tsParser from '@typescript-eslint/parser';
import * as tsPlugin from '@typescript-eslint/eslint-plugin';
import * as stylistic from '@stylistic/eslint-plugin';
import * as prettier from 'eslint-plugin-prettier';

export class ESLintUtil {
  public static create({ ignores = [], project = './tsconfig.json' }: { ignores?: string[]; project?: string }) {
    return [
      {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mts', '**/*.cts', '**/*.mjs', '**/*.cjs'],

        languageOptions: {
          parser: tsParser,
          parserOptions: {
            project,
            tsconfigRootDir: process.cwd(),
            sourceType: 'module',
          },
        },

        ignores,

        plugins: {
          '@typescript-eslint': tsPlugin,
          '@stylistic': stylistic,
          prettier,
        },

        rules: {
          // 等价于 plugin:@typescript-eslint/recommended
          ...tsPlugin?.configs?.recommended?.rules,

          // 等价于 plugin:prettier/recommended
          ...(prettier?.configs?.recommended as { rules?: Record<string, any> })?.rules,

          'prettier/prettier': [
            'error',
            {
              singleQuote: true,
              trailingComma: 'all',
              tabWidth: 2,
              printWidth: 120,
            },
            {
              usePrettierrc: false,
            },
          ],

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
    ];
  }
}
