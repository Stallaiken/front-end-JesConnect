import { useState, useEffect } from "react";
import "../../css/Horarios.css";
import { MOCK_JOGOS } from "../../utils/mockJogos.js"; 

function Futsal() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    const jogosFutsal = MOCK_JOGOS.filter((jogo) => jogo.modalidade === "FUTSAL");
    setJogos(jogosFutsal);
  }, []);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horarios de Inicio</h1>
        <h2 className="horarios-subtitulo">FUTSAL</h2>
      </div>

      <div className="lista-confrontos">
        {jogos.length > 0 ? (
          jogos.map((jogo) => (
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
          ))
        ) : (
          <p className="horarios-mensagem-vazia">Nenhum jogo de Futsal programado.</p>
        )}
      </div>
    </div>
  );
}

export default Futsal;