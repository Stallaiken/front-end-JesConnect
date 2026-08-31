import { MOCK_MODALIDADES } from "./mockModalidades";
import { MOCK_TIMES } from "./mockTimes";

export const MOCK_JOGOS = [
  {
    id: 1,
    modalidade: MOCK_MODALIDADES.FUTSETE_MASCULINO.nome,
    genero: MOCK_MODALIDADES.FUTSETE_MASCULINO.genero,
    horario: "13:30",
    horarioFim: "14:10",
    status: "finalizado",
    timeA: MOCK_TIMES["6A_SESI"],
    timeB: MOCK_TIMES["6B_SESI"]
  },
  {
    id: 2,
    modalidade: MOCK_MODALIDADES.FUTSAL_FEMININO.nome,
    genero: MOCK_MODALIDADES.FUTSAL_FEMININO.genero,
    horario: "14:15",
    horarioFim: "14:55",
    status: "finalizado",
    timeA: MOCK_TIMES["7A_SESI"],
    timeB: MOCK_TIMES["7B_SESI"]
  },
  {
    id: 3,
    modalidade: MOCK_MODALIDADES.QUEIMADO_FEMININO.nome,
    genero: MOCK_MODALIDADES.QUEIMADO_FEMININO.genero,
    horario: "15:00",
    horarioFim: "15:30",
    status: "em espera",
    timeA: MOCK_TIMES["6A_SESI"],
    timeB: MOCK_TIMES["6B_SESI"]
  },
  {
    id: 4,
    modalidade: MOCK_MODALIDADES.VOLLEI_MASCULINO.nome,
    genero: MOCK_MODALIDADES.VOLLEI_MASCULINO.genero,
    horario: "15:35",
    horarioFim: "16:20",
    status: "em espera",
    timeA: MOCK_TIMES["8A_SESI"],
    timeB: MOCK_TIMES["9B_SESI"]
  },
  {
    id: 5,
    modalidade: MOCK_MODALIDADES.VOLLEI_FEMININO.nome,
    genero: MOCK_MODALIDADES.VOLLEI_FEMININO.genero,
    horario: "16:25",
    horarioFim: "17:10",
    status: "em espera",
    timeA: MOCK_TIMES["8B_SESI"],
    timeB: MOCK_TIMES["9C_SESI"]
  },
  {
    id: 6,
    modalidade: MOCK_MODALIDADES.QUEIMADO_MASCULINO.nome,
    genero: MOCK_MODALIDADES.QUEIMADO_MASCULINO.genero,
    horario: "17:15",
    horarioFim: "17:45",
    status: "em espera",
    timeA: MOCK_TIMES["7B_SESI"],
    timeB: MOCK_TIMES["8B_SESI"]
  },
  {
    id: 7,
    modalidade: MOCK_MODALIDADES.FUTSAL_MASCULINO.nome,
    genero: MOCK_MODALIDADES.FUTSAL_MASCULINO.genero,
    horario: "17:50",
    horarioFim: "18:30",
    status: "em espera",
    timeA: MOCK_TIMES["9A_SESI"],
    timeB: MOCK_TIMES["9B_SESI"]
  }
];