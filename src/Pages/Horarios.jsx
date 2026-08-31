import { useState, useEffect } from "react";
import "../css/Horarios.css";
import { MOCK_JOGOS } from "../utils/mockJogos.js";

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