export function calcularQuantidadeJogos(quantidadeTimes) {
  if (quantidadeTimes <= 1) {
    return 0;
  }

  let total = 1;

  while (total < quantidadeTimes) {
    total *= 2;
  }

  return total * 2 - 1;
}