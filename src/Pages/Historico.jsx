import { useState, useEffect } from "react";
import "../css/Horarios.css";
import { MOCK_JOGOS } from "../utils/mockJogos";

function Historico() {
  const [jogosFinalizados, setJogosFinalizados] = useState([]);

  useEffect(() => {
    // Exibe somente confrontos com status "finalizado"
    const finalizados = MOCK_JOGOS.filter((jogo) => jogo.status === "finalizado");
    setJogosFinalizados(finalizados);
  }, []);

  return (
    <div className="horarios-page">
      <div className="horarios-titulo-container">
        <h1 className="horarios-titulo">HISTÓRICO DE JOGOS</h1>
      </div>

      <div className="lista-confrontos">
        {jogosFinalizados.length === 0 ? (
          <p className="horarios-mensagem-vazia">Nenhum jogo finalizado até o momento.</p>
        ) : (
          jogosFinalizados.map((jogo) => (
            <div key={jogo.id} className="card-confronto">
              <span className="modalidade-titulo">{jogo.modalidade}</span>

              <div className="conteudo-confronto">
                <div className="time-box">
                  <span className="bandeira">{jogo.timeA.bandeira}</span>
                  <span className="nome-time">{jogo.timeA.nome}</span>
                </div>

                <div className="horario-pill placar-pill">
                  {jogo.placar?.timeA ?? 0} - {jogo.placar?.timeB ?? 0}
                </div>

                <div className="time-box">
                  <span className="bandeira">{jogo.timeB.bandeira}</span>
                  <span className="nome-time">{jogo.timeB.nome}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Historico;