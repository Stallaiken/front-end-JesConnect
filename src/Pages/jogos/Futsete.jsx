import { useState, useEffect } from "react";
import "../../css/Horarios.css";
import { MOCK_JOGOS } from "../Horarios.jsx"; 

function Futsete() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    const jogosFutsete = MOCK_JOGOS.filter((jogo) => jogo.modalidade === "FUTSETE");
    setJogos(jogosFutsete);
  }, []);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Horarios de Inicio</h1>
        <h2 className="horarios-subtitulo">FUTSETE</h2>
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
          <p className="horarios-mensagem-vazia">Nenhum jogo de Futsete programado.</p>
        )}
      </div>
    </div>
  );
}

export default Futsete;