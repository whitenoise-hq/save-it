/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
    env: {
        browser: true,
        es2020: true,
    },
    root: true,
    extends: ['plugin:react/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        // "project": "./tsconfig.json"
        tsconfigRootDir: __dirname,
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        'react/jsx-no-useless-fragment': ['error', {allowExpressions: true}],
        'react/no-array-index-key': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/no-children-prop': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        '.*.js',
        'node_modules/',
        'dist/',
    ],
    overrides: [{files: ['*.js?(x)', '*.ts?(x)']}],
};
