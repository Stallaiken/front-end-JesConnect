import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Finalizar.css";
import { MOCK_JOGOS } from "../utils/mockJogos";

function Finalizar() {
  const navigate = useNavigate();
  const location = useLocation();
  const jogo = location.state?.jogo;

  const [placarA, setPlacarA] = useState(jogo?.placar?.timeA ?? 0);
  const [placarB, setPlacarB] = useState(jogo?.placar?.timeB ?? 0);

  if (!jogo) {
    return (
      <div className="finalizar-page">
        <p>Nenhum jogo selecionado.</p>
        <button className="btn-editar-estatisticas" onClick={() => navigate("/horarios")}>
          Voltar para Horários
        </button>
      </div>
    );
  }

  const alterarPlacarA = (delta) => setPlacarA((prev) => Math.max(0, prev + delta));
  const alterarPlacarB = (delta) => setPlacarB((prev) => Math.max(0, prev + delta));

  const handleFinalizarJogo = () => {
    const index = MOCK_JOGOS.findIndex((j) => j.id === jogo.id);
    if (index !== -1) {
      MOCK_JOGOS[index] = {
        ...MOCK_JOGOS[index],
        status: "finalizado", // Altera o status para "finalizado"
        placar: {
          timeA: placarA,
          timeB: placarB
        }
      };
    }

    // Redireciona para o Histórico após salvar
    navigate("/historico");
  };

  return (
    <div className="finalizar-page">
      <div className="finalizar-container">
        <button className="btn-fechar-finalizar" onClick={() => navigate("/horarios")}>
          ✕
        </button>

        <h2 className="titulo-finalizar">VISUALIZAÇÃO FINAL</h2>

        <div className="card-finalizar">
          <div className="card-finalizar-header">
            <span className="modalidade-finalizar">{jogo.modalidade}</span>
            <div className="status-pill-finalizar">FINALIZADO</div>
          </div>

          <div className="times-finalizar-wrapper">
            <div className="time-finalizar-item">
              <div className="bandeira-box-finalizar">{jogo.timeA.bandeira}</div>
              <span className="label-time-finalizar">{jogo.timeA.nome}</span>
            </div>

            <div className="time-finalizar-item">
              <div className="bandeira-box-finalizar">{jogo.timeB.bandeira}</div>
              <span className="label-time-finalizar">{jogo.timeB.nome}</span>
            </div>
          </div>
        </div>

        <div className="placar-box">
          {placarA} X {placarB}
        </div>

        <div className="controles-placar-container">
          <div className="grupo-botoes-placar">
            <button className="btn-placar" onClick={() => alterarPlacarA(1)}>+</button>
            <button className="btn-placar" onClick={() => alterarPlacarA(-1)}>-</button>
          </div>

          <div className="grupo-botoes-placar">
            <button className="btn-placar" onClick={() => alterarPlacarB(1)}>+</button>
            <button className="btn-placar" onClick={() => alterarPlacarB(-1)}>-</button>
          </div>
        </div>

        <button className="btn-editar-estatisticas" onClick={handleFinalizarJogo}>
          FINALIZAR E SALVAR
        </button>
      </div>
    </div>
  );
}

export default Finalizar;