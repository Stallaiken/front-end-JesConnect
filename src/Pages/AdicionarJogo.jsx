import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdicionarJogo.css";
import { MOCK_TIMES } from "../utils/mockTimes";
import { MOCK_MODALIDADES } from "../utils/mockModalidades";

function AdicionarJogo() {
  const navigate = useNavigate();
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [horario, setHorario] = useState("");
  const [modalidade, setModalidade] = useState("");

  const handleAvancar = (e) => {
    e.preventDefault();
    if (!timeA || !timeB || !horario || !modalidade) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    navigate("/salvar-jogo", {
      state: { timeAKey: timeA, timeBKey: timeB, horario, modalidade }
    });
  };

  return (
    <div className="add-jogo-page">
      <form onSubmit={handleAvancar} className="add-jogo-container">
        {/* TIME 1 */}
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

        {/* TIME 2 */}
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

        {/* CONFIGS */}
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

        <button type="submit" className="btn-salvar-principal">salvar</button>
      </form>
    </div>
  );
}

export default AdicionarJogo;