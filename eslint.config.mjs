import { defineConfig } from 'eslint-define-config'
import globals from 'globals'
import prettierPlugin from 'eslint-plugin-prettier'
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default defineConfig([
    {
        ignores: ['build/**/*', 'node_modules/**/*'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.eslint.json',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            prettier: prettierPlugin,
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn'],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-unused-vars': 'off',
            'prettier/prettier': [
                'error',
                { singleQuote: true, trailingComma: 'es5' },
            ],
        },
    },
])
