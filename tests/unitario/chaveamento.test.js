import { describe, test, expect } from "vitest";

import {
  calcularQuantidadeJogos,
} from "../../src/utils/testsSupa/chaveamento.js";

describe("Testes unitários - Chaveamento", () => {
  test("Test 1 - 4 times devem gerar 7 confrontos", () => {
    const resultado = calcularQuantidadeJogos(4);

    expect(resultado).toBe(7);
  });

  test("Test 2 - 8 times devem gerar 15 confrontos", () => {
    const resultado = calcularQuantidadeJogos(8);

    expect(resultado).toBe(15);
  });

  test("Test 3 - 16 times devem gerar 31 confrontos", () => {
    const resultado = calcularQuantidadeJogos(16);

    expect(resultado).toBe(31);
  });

  test("Test 4 - 1 time não deve gerar confrontos", () => {
    const resultado = calcularQuantidadeJogos(1);

    expect(resultado).toBe(0);
  });
});