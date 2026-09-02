import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/AdicionarJogo.css";

function AdicionarConfronto() {
  const navigate = useNavigate();

  const [times, setTimes] = useState([]);

  const [time1, setTime1] = useState("");

  const [time2, setTime2] = useState("");

  const [horario, setHorario] = useState("");

  const [modalidadeId, setModalidadeId] = useState("");

  const [modalidades, setModalidades] = useState([]);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      const { data: modData, error: modError } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (modError) {
        console.error(modError);
        setErro("Erro ao carregar modalidades.");
        return;
      }

      setModalidades(modData || []);

      const { data: timeData, error: timeError } = await supabase
        .from("time")
        .select("id, Nome, id_modalidade")
        .order("Nome");

      if (timeError) {
        console.error(timeError);
        setErro("Erro ao carregar times.");
        return;
      }

      setTimes(timeData || []);
    };

    carregarDados();
  }, []);

  const handleSalvarConfronto = async (e) => {
    e.preventDefault();

    setErro("");

    if (!time1 || !time2 || !horario || !modalidadeId) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (time1 === time2) {
      setErro("O time 1 não pode ser igual ao time 2.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("confronto").insert({
        time1: time1,
        time2: time2,
        horario: horario,
        finalizado: false,
      });

      if (error) {
        throw error;
      }

      navigate("/horarios");
    } catch (err) {
      console.error(err);

      setErro("Erro ao salvar o confronto.");
    } finally {
      setLoading(false);
    }
  };

  const timesFiltrados = times.filter(
    (time) =>
      !modalidadeId || String(time.id_modalidade) === String(modalidadeId),
  );

  return (
    <div className="add-jogo-page">
      <div
        className="add-jogo-container"
        style={{
          maxWidth: "480px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.4rem",
            }}
          >
            Novo Confronto
          </h2>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* MODALIDADE */}
        <div
          className="input-card config-card"
          style={{
            marginBottom: "16px",
          }}
        >
          <label>MODALIDADE</label>

          <select
            value={modalidadeId}
            onChange={(e) => {
              setModalidadeId(e.target.value);

              setTime1("");
              setTime2("");
            }}
          >
            <option value="">Selecione...</option>

            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
                {m.genero && m.genero !== "Not" ? ` (${m.genero})` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* TIME 1 */}
        <div
          className="input-card config-card"
          style={{
            marginBottom: "16px",
          }}
        >
          <label>TIME 1</label>

          <select
            value={time1}
            onChange={(e) => setTime1(e.target.value)}
            disabled={!modalidadeId}
          >
            <option value="">Selecione o Time 1</option>

            {timesFiltrados.map((time) => (
              <option key={time.id} value={time.id}>
                {time.Nome}
              </option>
            ))}
          </select>
        </div>

        {/* TIME 2 */}
        <div
          className="input-card config-card"
          style={{
            marginBottom: "16px",
          }}
        >
          <label>TIME 2</label>

          <select
            value={time2}
            onChange={(e) => setTime2(e.target.value)}
            disabled={!modalidadeId}
          >
            <option value="">Selecione o Time 2</option>

            {timesFiltrados
              .filter((time) => String(time.id) !== String(time1))
              .map((time) => (
                <option key={time.id} value={time.id}>
                  {time.Nome}
                </option>
              ))}
          </select>
        </div>

        {/* HORÁRIO */}
        <div
          className="input-card config-card"
          style={{
            marginBottom: "24px",
          }}
        >
          <label>HORÁRIO DO JOGO</label>

          <input
            type="datetime-local"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
        </div>

        {erro && (
          <p
            style={{
              color: "#dc2626",
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            {erro}
          </p>
        )}

        <button
          type="button"
          onClick={handleSalvarConfronto}
          disabled={loading}
          className="btn-salvar-principal"
          style={{
            width: "100%",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Salvando..." : "Salvar Confronto"}
        </button>
      </div>
    </div>
  );
}

export default AdicionarConfronto;
