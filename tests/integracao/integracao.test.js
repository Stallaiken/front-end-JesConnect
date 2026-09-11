import { describe, test, expect } from "vitest";

import { buscarModalidades } from "../../src/utils/testsSupa/modalidades.js";
import {
  buscarTimesDaModalidade,
  buscarModalidadeDoTime,
} from "../../src/utils/testsSupa/integracao.js";

describe("Testes de integração - Modalidades e Times", () => {
  test("Test 9 - Busca uma modalidade e depois seus times", async () => {
    const modalidades = await buscarModalidades();

    expect(modalidades.length).toBeGreaterThan(0);

    const modalidade = modalidades[0];

    const times = await buscarTimesDaModalidade(modalidade.id);

    expect(times).toBeDefined();
    expect(Array.isArray(times)).toBe(true);

    times.forEach((time) => {
      expect(time.id_modalidade).toBe(modalidade.id);
    });
  });

  test("Test 10 - Busca um time e depois sua modalidade", async () => {
    const modalidades = await buscarModalidades();

    expect(modalidades.length).toBeGreaterThan(0);

    const times = await buscarTimesDaModalidade(modalidades[0].id);

    expect(times.length).toBeGreaterThan(0);

    const modalidade = await buscarModalidadeDoTime(times[0].id);

    expect(modalidade).toBeDefined();
    expect(modalidade.id).toBe(times[0].id_modalidade);
  });

  test("Test 11 - Modalidades possuem nome", async () => {
    const modalidades = await buscarModalidades();

    expect(modalidades.length).toBeGreaterThan(0);

    modalidades.forEach((modalidade) => {
      expect(modalidade).toHaveProperty("id");
      expect(modalidade).toHaveProperty("nome");
      expect(modalidade.nome).not.toBe("");
    });
  });

  test("Test 12 - Times possuem uma modalidade relacionada", async () => {
    const modalidades = await buscarModalidades();

    expect(modalidades.length).toBeGreaterThan(0);

    const times = await buscarTimesDaModalidade(modalidades[0].id);

    times.forEach((time) => {
      expect(time.id_modalidade).toBe(modalidades[0].id);
    });
  });
});
