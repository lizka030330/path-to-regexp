import tsParser from "@typescript-eslint/parser";
export default [
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tsParser },
    rules: {
      complexity: ["warn", { max: 1 }],
      "max-lines-per-function": ["warn", { max: 50 }],
    },
  },
];
