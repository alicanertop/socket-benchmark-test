/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'es5',
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: ['^[a-zA-Z]', '^@', '^..', '^.'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};

export default config;
