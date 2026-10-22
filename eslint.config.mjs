import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["src/**/*.ts"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    // Object shapes are declared as types, as in ts-core.
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    // It asks for `!`, which no-non-null-assertion of the strict preset
    // forbids: types are narrowed with `as`.
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    // Error messages include the invalid numbers.
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      { allowNumber: true },
    ],
  },
});
