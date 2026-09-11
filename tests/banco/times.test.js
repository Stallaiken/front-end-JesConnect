import { describe, test, expect } from "vitest";
import {
  buscarTimes,
  buscarTime,
  validarTime,
} from "../../src/utils/testsSupa/times.js";

describe("Testes de Banco - Times", () => {
  test("Test 1 - Busca dos times", async () => {
    const times = await buscarTimes();

    expect(times).toBeDefined();
    expect(Array.isArray(times)).toBe(true);
  });

  test("Test 2 - Busca de um time específico", async () => {
    const times = await buscarTimes();

    expect(times.length).toBeGreaterThan(0);

    const time = await buscarTime(times[0].id);

    expect(time).toBeDefined();
    expect(time).toHaveProperty("id");
    expect(time).toHaveProperty("Nome");
    expect(time).toHaveProperty("id_modalidade");
  });

  test("Test 3 - Validação de nome obrigatório", () => {
    const resultado = validarTime("", "modalidade");

    expect(resultado).toBe("O nome do time é obrigatório");
  });

  test("Test 4 - Validação de modalidade obrigatória", () => {
    const resultado = validarTime("Time Teste", "");

    expect(resultado).toBe("A modalidade é obrigatória");
  });
});

test("Test 5 - Rejeita nome contendo apenas espaços", () => {
  const resultado = validarTime("   ", "modalidade");

  expect(resultado).toBe("O nome do time é obrigatório");
});

test("Test 6 - Busca de time com ID inexistente", async () => {
  await expect(
    buscarTime("00000000-0000-0000-0000-000000000000"),
  ).rejects.toThrow();
});

test("Test 7 - Verifica estrutura dos dados dos times", async () => {
  const times = await buscarTimes();

  expect(times).toBeDefined();

  if (times.length > 0) {
    expect(times[0]).toHaveProperty("id");
    expect(times[0]).toHaveProperty("Nome");
    expect(times[0]).toHaveProperty("id_modalidade");
  }
});

test("Test 8 - Verifica limite de times retornados", async () => {
  const times = await buscarTimes();

  expect(times.length).toBeLessThanOrEqual(20);
});

test("Test 9 - Aceita um time com dados válidos", () => {
  const resultado = validarTime("Time Teste", "modalidade");

  expect(resultado).toBeNull();
});

test("Test 10 - Rejeita modalidade contendo apenas espaços", () => {
  const resultado = validarTime("Time Teste", "   ");

  expect(resultado).toBeNull();
});
