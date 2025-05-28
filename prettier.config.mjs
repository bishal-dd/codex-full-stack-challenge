
/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const prettierConfig = {
  printWidth: 120,
  trailingComma: 'all',
  singleAttributePerLine: true,
  singleQuote: true,
  arrowParens: 'avoid',
  semi: true,
  bracketSpacing: true,
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'lf',
  quoteProps: 'consistent',
  plugins: [
    'prettier-plugin-embed',
    'prettier-plugin-organize-imports',
    'prettier-plugin-packagejson',
  ],
};

const config = {
  ...prettierConfig,
};

export default config;
