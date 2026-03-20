import { ESLintUtil } from './dist/eslint-util.class.js';

export default ESLintUtil.create({
  ignores: ['dist*'],
  project: './tsconfig.eslint.json',
});
