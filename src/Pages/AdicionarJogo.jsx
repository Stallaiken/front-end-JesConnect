import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/AdicionarJogo.css";
import { MOCK_TIMES } from "../utils/mockTimes";
import { MOCK_MODALIDADES } from "../utils/mockModalidades";
import { MOCK_JOGOS } from "../utils/mockJogos";

function AdicionarJogo() {
  const navigate = useNavigate();
  const location = useLocation();

  const jogoParaEditar = location.state?.jogoParaEditar;
  const isEditing = location.state?.isEditing || false;

  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [horario, setHorario] = useState("");
  const [modalidade, setModalidade] = useState("");

  useEffect(() => {
    if (isEditing && jogoParaEditar) {
      const chaveA = Object.keys(MOCK_TIMES).find(
        (k) => MOCK_TIMES[k].nome === jogoParaEditar.timeA.nome
      );
      const chaveB = Object.keys(MOCK_TIMES).find(
        (k) => MOCK_TIMES[k].nome === jogoParaEditar.timeB.nome
      );

      setTimeA(chaveA || "");
      setTimeB(chaveB || "");
      setHorario(jogoParaEditar.horario || "");
      setModalidade(jogoParaEditar.modalidade || "");
    }
  }, [isEditing, jogoParaEditar]);

  const handleSalvar = (e) => {
    e.preventDefault();
    if (!timeA || !timeB || !horario || !modalidade) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    if (isEditing && jogoParaEditar) {
      const index = MOCK_JOGOS.findIndex((j) => j.id === jogoParaEditar.id);
      if (index !== -1) {
        MOCK_JOGOS[index] = {
          ...MOCK_JOGOS[index],
          modalidade,
          horario,
          timeA: MOCK_TIMES[timeA],
          timeB: MOCK_TIMES[timeB]
        };
      }
      navigate("/horarios");
    } else {
      navigate("/salvar-jogo", {
        state: { timeAKey: timeA, timeBKey: timeB, horario, modalidade }
      });
    }
  };

  return (
    <div className="add-jogo-page">
      <form onSubmit={handleSalvar} className="add-jogo-container">
        <span className="section-label">TIME 1</span>
        <div className="input-card">
          <div className="icon-box">✏️</div>
          <div className="input-field-wrapper">
            <label>NOME DA EQUIPE:</label>
            <select value={timeA} onChange={(e) => setTimeA(e.target.value)} required>
              <option value="">Selecione...</option>
              {Object.entries(MOCK_TIMES).map(([chave, time]) => (
                <option key={chave} value={chave}>{time.nome}</option>
              ))}
            </select>
          </div>
          <span className="pencil-icon">✏️</span>
        </div>

        <div className="vs-divider">VS</div>

        <span className="section-label">TIME 2</span>
        <div className="input-card">
          <div className="icon-box">✏️</div>
          <div className="input-field-wrapper">
            <label>NOME DA EQUIPE:</label>
            <select value={timeB} onChange={(e) => setTimeB(e.target.value)} required>
              <option value="">Selecione...</option>
              {Object.entries(MOCK_TIMES).map(([chave, time]) => (
                <option key={chave} value={chave}>{time.nome}</option>
              ))}
            </select>
          </div>
          <span className="pencil-icon">✏️</span>
        </div>

        <div className="configs-divider">
          <span>CONFIGS</span>
          <hr />
        </div>

        <div className="input-card config-card">
          <label>HORARIO:</label>
          <input
            type="text"
            placeholder="XX:XX"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
          />
          <span className="pencil-icon">✏️</span>
        </div>

        <div className="input-card config-card">
          <label>MODALIDADE:</label>
          <select value={modalidade} onChange={(e) => setModalidade(e.target.value)} required>
            <option value="">Selecione...</option>
            {Object.values(MOCK_MODALIDADES).map((mod) => (
              <option key={mod.id} value={mod.nome}>
                {mod.nome} ({mod.genero})
              </option>
            ))}
          </select>
          <span className="pencil-icon">✏️</span>
        </div>

        <button type="submit" className="btn-salvar-principal">
          salvar
        </button>
      </form>
    </div>
  );
}

export default AdicionarJogo;