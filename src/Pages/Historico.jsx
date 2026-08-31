import { useState, useEffect } from "react";
import "../css/Horarios.css";
import { MOCK_JOGOS } from "../utils/mockJogos";

function Historico() {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    const jogosFinalizados = MOCK_JOGOS.filter(
      (jogo) => jogo.status === "finalizado"
    );

    setJogos(jogosFinalizados);
  }, []);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">Histórico de Jogos</h1>
      </div>

      <div className="lista-confrontos">
        {jogos.length > 0 ? (
          jogos.map((jogo) => (
            <div key={jogo.id} className="card-confronto">
              <span className="modalidade-titulo">
                {jogo.modalidade} {jogo.genero ? `(${jogo.genero})` : ""}
              </span>

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
          <p className="horarios-mensagem-vazia">Nenhum jogo finalizado até o momento.</p>
        )}
      </div>
    </div>
  );
}

export default Historico;