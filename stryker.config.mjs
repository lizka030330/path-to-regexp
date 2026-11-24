// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: "npm",
  // Лаб. 4 крок 01: додано "json" — числа для characterization.md беруться зі звіту, а не з екрана
  reporters: ["html", "clear-text", "progress", "json"],
  testRunner: "vitest",
  testRunner_comment:
    "Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.",
  coverageAnalysis: "perTest",

  // ---- Лаб. 4 крок 01: дописано після генератора (рядки вище — як записав генератор) ----
  // область: один модуль, а не весь проєкт
  mutate: ["src/index.ts"],
  // повторні прогони перевикористовують попередній результат (reports/stryker-incremental.json)
  incremental: true,
  // 8 логічних ядер (sysctl -n hw.ncpu); типово було б 7 — беремо 4, щоб ноутбук не перегрівався
  concurrency: 4,
  // TypeScript 7.0.2 проєкту — нативна збірка без компіляторного API, і TSConfigPreprocessor Stryker 10.1.1
  // падає на ts.parseConfigFileTextToJson (прогін 2026-11-24 19:30, reports/lab4/stryker-run-1.txt).
  // Препроцесор лише переписує ВІДНОСНІ шляхи extends/references; у tsconfig.json проєкту extends — пакет
  // з node_modules, переписувати нічого. Назва навмисно не існує → препроцесор пропускає файл
  // (node_modules/@stryker-mutator/core/dist/src/sandbox/ts-config-preprocessor.js L41–44).
  tsconfigFile: "tsconfig.stryker-skip-rewrite.json",
};
export default config;
