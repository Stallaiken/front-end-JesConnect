import { useLocation, useNavigate } from "react-router-dom";
import "../css/AdicionarJogo.css";
import { MOCK_TIMES } from "../utils/mockTimes";
import { MOCK_JOGOS } from "../utils/mockJogos";

function SalvarJogo() {
  const navigate = useNavigate();
  const location = useLocation();
  const dados = location.state;

  if (!dados) {
    return (
      <div className="add-jogo-page">
        <p>Nenhum dado encontrado.</p>
        <button className="btn-salvar-principal" onClick={() => navigate("/horarios")}>
          Voltar
        </button>
      </div>
    );
  }

  const timeA = MOCK_TIMES[dados.timeAKey] || { nome: "TIME 1", bandeira: "🇧🇷" };
  const timeB = MOCK_TIMES[dados.timeBKey] || { nome: "TIME 2", bandeira: "🇦🇷" };

  const handleConfirmar = () => {
    const novoJogo = {
      id: Date.now(),
      modalidade: dados.modalidade,
      horario: dados.horario,
      status: "em espera",
      timeA: timeA,
      timeB: timeB
    };

    MOCK_JOGOS.push(novoJogo);
    navigate("/horarios");
  };

  return (
    <div className="add-jogo-page">
      <div className="salvar-container">
        <button className="btn-fechar" onClick={() => navigate("/horarios")}>
          ✕
        </button>

        <h2 className="titulo-confirmacao">VOCÊ REALMENTE DESEJA SALVAR?</h2>

        <div className="configs-divider">
          <span>PREVIA</span>
          <hr />
        </div>

 
        <div className="card-previa">
          <span className="modalidade-previa">{dados.modalidade}</span>
          <div className="conteudo-previa">
            <div className="time-previa">
              <div className="bandeira-box">{timeA.bandeira}</div>
              <span className="sub-label">{timeA.nome}</span>
            </div>

            <div className="horario-pill-previa">{dados.horario}</div>

            <div className="time-previa">
              <div className="bandeira-box">{timeB.bandeira}</div>
              <span className="sub-label">{timeB.nome}</span>
            </div>
          </div>
        </div>

        <button className="btn-salvar-principal" onClick={handleConfirmar}>
          salvar
        </button>
      </div>
    </div>
  );
}

export default SalvarJogo;