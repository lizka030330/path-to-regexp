/**
 * НОВА ПОВЕДІНКА, НЕ ХАРАКТЕРИЗАЦІЯ. Лаб. 4, крок 02.
 * Цей файл — вимога: на коміті перед зміною він ЧЕРВОНИЙ, після зміни — ЗЕЛЕНИЙ,
 * після відкоту (git revert коміта зміни) — знову ЧЕРВОНИЙ.
 *
 * Вимога: на битому %-кодуванні match() і далі кидає URIError (тип не змінюється,
 * публічний API той самий), але повідомлення називає параметр і сире значення,
 * яке не вдалося декодувати, і зберігає початковий текст "URI malformed".
 * Входи — ті самі, що в src/characterization.spec.ts (тести 7–8).
 */
import { describe, expect, it } from "vitest";
import { match } from "./index.js";

describe("match() — зрозуміла помилка декодування (крок 02)", () => {
  it("називає :параметр і сире значення", () => {
    const fn = match("/:test");
    expect(() => fn("/caf%C3")).toThrowError(URIError);
    expect(() => fn("/caf%C3")).toThrowError(
      'Failed to decode param "test" ("caf%C3"): URI malformed',
    );
  });

  it("для wildcard називає параметр і саме той сегмент, що не декодувався", () => {
    const fn = match("/*splat");
    expect(() => fn("/bar/caf%C3")).toThrowError(URIError);
    expect(() => fn("/bar/caf%C3")).toThrowError(
      'Failed to decode param "splat" ("caf%C3"): URI malformed',
    );
  });

  it("коректне %-кодування й далі декодується без помилки", () => {
    expect(match("/:test")("/caf%C3%A9")).toEqual({
      path: "/caf%C3%A9",
      params: { test: "café" },
    });
  });
});
