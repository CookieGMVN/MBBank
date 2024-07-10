/*
 * MIT License
 *
 * Copyright (c) 2024 CookieGMVN and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ["dist", "docs"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: [
    "@typescript-eslint",
    "simple-header",
    "simple-import-sort",
    "unused-imports",
    "path-alias",
  ],
  rules: {
    "linebreak-style": "off",
    "simple-header/header": [
      "error",
      {
        files: ["./header.txt"],
        templates: { author: [".*", "CookieGMVN and contributors"] },
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": "error",
    "comma-style": "error",
    "dot-location": ["error", "property"],
    "handle-callback-err": "off",
    "max-nested-callbacks": ["error", { max: 4 }],
    "max-statements-per-line": ["error", { max: 2 }],
    "no-console": "off",
    "no-empty-function": "error",
    "no-floating-decimal": "error",
    "no-inline-comments": "error",
    "no-lonely-if": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }],
    "no-trailing-spaces": ["error"],
    "no-var": "error",
    "object-curly-spacing": ["error", "always"],
    "prefer-const": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "space-in-parens": "error",
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "spaced-comment": "error",
    yoda: "error",
    semi: "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "unused-imports/no-unused-imports": "error",
    "path-alias/no-relative": "error",
  },
};
