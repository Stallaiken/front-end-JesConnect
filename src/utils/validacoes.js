export function validarTime(nome, modalidade) {
  if (!nome || !nome.trim()) {
    return "O nome do time é obrigatório";
  }

  if (!modalidade) {
    return "A modalidade é obrigatória";
  }

  return null;
}

export function validarConfronto(time1, time2) {
  if (!time1) {
    return "O primeiro time é obrigatório";
  }

  if (!time2) {
    return "O segundo time é obrigatório";
  }

  if (time1 === time2) {
    return "Os times não podem ser iguais";
  }

  return null;
}

export function determinarVencedor(time1, time2, pontos1, pontos2) {
  if (pontos1 > pontos2) {
    return time1;
  }

  if (pontos2 > pontos1) {
    return time2;
  }

  return null;
}

export function validarPlacar(pontos1, pontos2) {
  if (pontos1 < 0 || pontos2 < 0) {
    return "O placar não pode ser negativo";
  }

  return null;
}