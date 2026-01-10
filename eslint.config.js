import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroPlugin.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      ".netlify/**",
      "public/**",
      "*.cjs",
      "postcss.config.cjs",
      "tailwind.config.cjs",
      "env.d.ts",
    ],
  },
  {
    files: ["bin/**/*.js", "bin/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/triple-slash-reference": "off",

      // JSX A11y rules - adjusted for the codebase
      "jsx-a11y/no-redundant-roles": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/img-redundant-alt": "warn",

      // General rules
      "no-useless-escape": "warn",
    },
  },
];
