/**
 * ХАРАКТЕРИЗАЦІЯ, НЕ ВИМОГА. Лаб. 4, крок 01.
 * Ці тести фіксують поведінку match() на нульовій точці форка
 * c439054f178ae93a09e30f902c3976ee5a2434a5.
 * Якщо тест тут падає — спершу припускаємо, що зламали МИ.
 * Значення в expect отримані з фактичного прогону «наосліп» 2026-11-24 19:21
 * (усі expect були "?", лог: reports/lab4/characterization-blind-run.txt),
 * а не виведені з коду. Входи — з Readme.md і src/cases.spec.ts самого проєкту.
 */
import { describe, expect, it } from "vitest";
import { match } from "./index.js";

describe("match() — поточна поведінка (характеризація)", () => {
  // ПОВЕДІНКА: кожен :параметр повертається рядком під своїм іменем, path — уся збіжна адреса.
  // ЧОМУ: src/index.ts L426–428 — params[key.name] = decoder(m[i]) для кожної групи.
  // ВХІД: Readme.md L28–31
  it("два параметри з README", () => {
    expect(match("/:foo/:bar")("/test/route")).toEqual({
      path: "/test/route",
      params: { foo: "test", bar: "route" },
    });
  });

  // ПОВЕДІНКА: wildcard повертає МАСИВ сегментів, розбитий за роздільником "/".
  // ЧОМУ: src/index.ts L413 — для не-param ключа value.split(delimiter).map(decode).
  // ВХІД: Readme.md L39–42
  it("wildcard з README", () => {
    expect(match("/*splat")("/bar/baz")).toEqual({
      path: "/bar/baz",
      params: { splat: ["bar", "baz"] },
    });
  });

  // ПОВЕДІНКА: пропущена необовʼязкова група дає порожні params — ключа id немає зовсім (не undefined).
  // ЧОМУ: src/index.ts L424 — група, що не збіглася (m[i] === undefined), пропускається.
  // ВХІД: Readme.md L50–53
  it("необовʼязкова група без параметра", () => {
    expect(match("/users{/:id}/delete")("/users/delete")).toEqual({
      path: "/users/delete",
      params: {},
    });
  });

  // ПОВЕДІНКА: адреса, що не підходить під шаблон, дає false, а не помилку.
  // ЧОМУ: src/index.ts L418 — if (!m) return false.
  // ВХІД: Readme.md L28 (той самий шаблон), адреса з меншою кількістю сегментів
  it("адреса, що не підходить під шаблон", () => {
    expect(match("/:foo/:bar")("/test")).toEqual(false);
  });

  // ПОВЕДІНКА: параметр декодується рівно один раз (%25 → %), а path лишається сирим.
  // ЧОМУ: типовий decode — decodeURIComponent (src/index.ts L406), викликається один раз на значення.
  // ВХІД: src/cases.spec.ts L500–503
  it("коректне %-кодування декодується один раз", () => {
    expect(match("/:test")("/param%2523")).toEqual({
      path: "/param%2523",
      params: { test: "param%23" },
    });
  });

  // ПОВЕДІНКА: з decode: false параметр повертається сирим, без декодування.
  // ЧОМУ: src/index.ts L411 — if (decode === false) return NOOP_VALUE.
  // ВХІД: src/cases.spec.ts L486 (/caf%C3%A9) з опцією decode: false (Readme.md L65)
  it("decode: false лишає параметр сирим", () => {
    expect(match("/:test", { decode: false })("/caf%C3%A9")).toEqual({
      path: "/caf%C3%A9",
      params: { test: "caf%C3%A9" },
    });
  });

  // ПОВЕДІНКА: бите %-кодування в :параметрі кидає неперехоплену помилку "URI malformed".
  // СХОЖЕ НА БАГ — ФІКСУЮ НАВМИСНЕ: саме цю поведінку змінює крок 02.
  // ЧОМУ: src/index.ts L428 — decoder викликається без try/catch.
  // ВХІД: src/cases.spec.ts L486 (/caf%C3%A9) з обрізаним останнім байтом — битого %-кодування в проєкті немає
  it("бите %-кодування в параметрі", () => {
    expect(() => match("/:test")("/caf%C3")).toThrowError("URI malformed");
  });

  // ПОВЕДІНКА: бите %-кодування у wildcard кидає ту саму помилку "URI malformed".
  // СХОЖЕ НА БАГ — ФІКСУЮ НАВМИСНЕ: саме цю поведінку змінює крок 02.
  // ЧОМУ: src/index.ts L413 + L428 — кожен сегмент декодується тим самим decode без try/catch.
  // ВХІД: Readme.md L39 (wildcard) + той самий обрізаний байт
  it("бите %-кодування у wildcard", () => {
    expect(() => match("/*splat")("/bar/caf%C3")).toThrowError("URI malformed");
  });
});
