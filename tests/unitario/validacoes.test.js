import { describe, test, expect } from "vitest";

import {
  determinarVencedor,
  validarConfronto,
  validarPlacar,
} from "../../src/utils/testsSupa/validacoes";

describe("Testes unitários - Validacoes", () => {
  test("Test 5 - Deve identificar o vencedor pelo maior placar", () => {
    const vencedor = determinarVencedor("Time A", "Time B", 3, 1);

    expect(vencedor).toBe("Time A");
  });

  test("Teste - Não permite placar negativo", () => {
    const resultado = validarPlacar(-1, 2);

    expect(resultado).toBe("O placar não pode ser negativo");
  });

  test("Test - Primeiro time é obrigatório", () => {
    const resultado = validarConfronto("", "Time B");

    expect(resultado).toBe("O primeiro time é obrigatório");
  });

  test("Test - Segundo time é obrigatório", () => {
    const resultado = validarConfronto("Time A", "");

    expect(resultado).toBe("O segundo time é obrigatório");
  });

  test("Test - Não permite os dois times iguais", () => {
    const resultado = validarConfronto("Time A", "Time A");

    expect(resultado).toBe("Os times não podem ser iguais");
  });
});
