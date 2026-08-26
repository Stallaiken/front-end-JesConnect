import { useState, useEffect } from "react";
import "../css/Horarios.css";

export const MOCK_JOGOS = [
  {
    id: 1,
    modalidade: "FUTSETE",
    horario: "13:30",
    timeA: { nome: "6A SESI", bandeira: "🇧🇷" },
    timeB: { nome: "6B SESI", bandeira: "🇧🇷" }
  },
  {
    id: 2,
    modalidade: "FUTSETE",
    horario: "14:00",
    timeA: { nome: "8C Brasil", bandeira: "🇧🇷" },
    timeB: { nome: "8A SESI", bandeira: "🇧🇷" }
  },
  {
    id: 3,
    modalidade: "FUTSAL",
    horario: "14:30",
    timeA: { nome: "9A SESI", bandeira: "🇧🇷" },
    timeB: { nome: "9C SESI", bandeira: "🇧🇷" }
  },
  {
    id: 4,
    modalidade: "FUTSAL",
    horario: "15:00",
    timeA: { nome: "9B SESI", bandeira: "🇧🇷" },
    timeB: { nome: "1A Médio", bandeira: "🇧🇷" }
  },
  {
    id: 5,
    modalidade: "QUEIMADO",
    horario: "15:30",
    timeA: { nome: "6B SESI", bandeira: "🇧🇷" },
    timeB: { nome: "7A SESI", bandeira: "🇧🇷" }
  },
  {
    id: 6,
    modalidade: "QUEIMADO",
    horario: "16:00",
    timeA: { nome: "7B SESI", bandeira: "🇧🇷" },
    timeB: { nome: "8B SESI", bandeira: "🇧🇷" }
  },
  {
    id: 7,
    modalidade: "VOLLEI",
    horario: "16:30",
    timeA: { nome: "1B Médio", bandeira: "🇧🇷" },
    timeB: { nome: "2A Médio", bandeira: "🇧🇷" }
  },
  {
    id: 8,
    modalidade: "VOLLEI",
    horario: "17:00",
    timeA: { nome: "3A SESI", bandeira: "🇧🇷" },
    timeB: { nome: "2B SESI", bandeira: "🇧🇷" }
  },
  {
    id: 9,
    modalidade: "FUTSAL",
    horario: "17:30",
    timeA: { nome: "2C Médio", bandeira: "🇧🇷" },
    timeB: { nome: "3B Médio", bandeira: "🇧🇷" }
  },
  {
    id: 10,
    modalidade: "FUTSETE",
    horario: "18:00",
    timeA: { nome: "3A SESI", bandeira: "🇧🇷" },
    timeB: { nome: "3C Médio", bandeira: "🇧🇷" }
  }
];

function Horarios() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    setJogos(MOCK_JOGOS);
  }, []);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horarios de Inicio</h1>
      </div>

      <div className="lista-confrontos">
        {jogos.map((jogo) => (
          <div key={jogo.id} className="card-confronto">
            <span className="modalidade-titulo">{jogo.modalidade}</span>

            <div className="conteudo-confronto">
              <div className="time-box">
                <span className="bandeira">{jogo.timeA.bandeira}</span>
                <span className="nome-time">{jogo.timeA.nome}</span>
              </div>

              <div className="horario-pill">
                {jogo.horario}
              </div>

              <div className="time-box">
                <span className="bandeira">{jogo.timeB.bandeira}</span>
                <span className="nome-time">{jogo.timeB.nome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Horarios;