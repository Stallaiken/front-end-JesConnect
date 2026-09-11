import { describe, test, expect } from "vitest";

import {
  buscarModalidades,
  buscarModalidade,
  validarModalidade,
} from "../../src/utils/testsSupa/modalidades.js";

describe("Testes de API - Modalidades", () => {
  test("Test 5 - Busca das modalidades", async () => {
    const modalidades = await buscarModalidades();

    expect(modalidades).toBeDefined();
    expect(Array.isArray(modalidades)).toBe(true);
  });

  test("Test 6 - Busca de uma modalidade específica", async () => {
    const modalidades = await buscarModalidades();

    expect(modalidades.length).toBeGreaterThan(0);

    const modalidade = await buscarModalidade(modalidades[0].id);

    expect(modalidade).toBeDefined();
    expect(modalidade).toHaveProperty("id");
    expect(modalidade).toHaveProperty("nome");
    expect(modalidade).toHaveProperty("genero");
  });

  test("Test 7 - Validação de nome obrigatório", () => {
    const resultado = validarModalidade("", "M");

    expect(resultado).toBe("O nome da modalidade é obrigatório");
  });

  test("Test 8 - Validação de gênero obrigatório", () => {
    const resultado = validarModalidade("Futebol", "");

    expect(resultado).toBe("O gênero é obrigatório");
  });
});
