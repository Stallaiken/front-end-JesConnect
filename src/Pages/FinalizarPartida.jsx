import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/AdicionarJogo.css";

function FinalizarPartida() {
  const navigate = useNavigate();
  const [confrontos, setConfrontos] = useState([]);
  const [confrontoId, setConfrontoId] = useState("");
  const [gols1, setGols1] = useState(0);
  const [gols2, setGols2] = useState(0);
  const [cartoesAmarelos1, setCartoesAmarelos1] = useState(0);
  const [cartoesAmarelos2, setCartoesAmarelos2] = useState(0);
  const [cartoesVermelhos1, setCartoesVermelhos1] = useState(0);
  const [cartoesVermelhos2, setCartoesVermelhos2] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarConfrontos = async () => {
      const { data } = await supabase
        .from("confronto")
        .select(`id, horario, time1:id_time1(Nome), time2:id_time2(Nome)`)
        .eq("finalizado", false);
      if (data) setConfrontos(data);
    };
    carregarConfrontos();
  }, []);

  const handleFinalizar = async (e) => {
    e.preventDefault();
    if (!confrontoId) return alert("Selecione um confronto.");

    setLoading(true);
    const { error } = await supabase
      .from("confronto")
      .update({
        finalizado: true,
        gols_time1: Number(gols1),
        gols_time2: Number(gols2),
        cartoes_amarelos_t1: Number(cartoesAmarelos1),
        cartoes_amarelos_t2: Number(cartoesAmarelos2),
        cartoes_vermelhos_t1: Number(cartoesVermelhos1),
        cartoes_vermelhos_t2: Number(cartoesVermelhos2),
      })
      .eq("id", confrontoId);

    setLoading(false);
    if (!error) {
      alert("Partida finalizada e enviada ao histórico!");
      navigate("/historico");
    } else {
      alert("Erro ao finalizar partida.");
    }
  };

  return (
    <div className="add-jogo-page">
      <div className="add-jogo-container" style={{ maxWidth: "480px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Finalizar Partida</h2>
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

        <div
          className="input-card config-card"
          style={{ marginBottom: "16px" }}
        >
          <label>CONFRONTO PENDENTE</label>
          <select
            value={confrontoId}
            onChange={(e) => setConfrontoId(e.target.value)}
          >
            <option value="">Selecione o jogo...</option>
            {confrontos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.time1?.Nome} vs {c.time2?.Nome} (
                {new Date(c.horario).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {confrontoId && (
          <>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div className="input-card config-card" style={{ flex: 1 }}>
                <label>Gols Time 1</label>
                <input
                  type="number"
                  min="0"
                  value={gols1}
                  onChange={(e) => setGols1(e.target.value)}
                />
              </div>
              <div className="input-card config-card" style={{ flex: 1 }}>
                <label>Gols Time 2</label>
                <input
                  type="number"
                  min="0"
                  value={gols2}
                  onChange={(e) => setGols2(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div className="input-card config-card" style={{ flex: 1 }}>
                <label>Cartões Amarelos (T1 / T2)</label>
                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <input
                    type="number"
                    min="0"
                    value={cartoesAmarelos1}
                    onChange={(e) => setCartoesAmarelos1(e.target.value)}
                    placeholder="T1"
                  />
                  <input
                    type="number"
                    min="0"
                    value={cartoesAmarelos2}
                    onChange={(e) => setCartoesAmarelos2(e.target.value)}
                    placeholder="T2"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <div className="input-card config-card" style={{ flex: 1 }}>
                <label>Cartões Vermelhos (T1 / T2)</label>
                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <input
                    type="number"
                    min="0"
                    value={cartoesVermelhos1}
                    onChange={(e) => setCartoesVermelhos1(e.target.value)}
                    placeholder="T1"
                  />
                  <input
                    type="number"
                    min="0"
                    value={cartoesVermelhos2}
                    onChange={(e) => setCartoesVermelhos2(e.target.value)}
                    placeholder="T2"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalizar}
              disabled={loading}
              className="btn-salvar-principal"
              style={{ width: "100%" }}
            >
              {loading ? "Salvando..." : "Confirmar e Enviar ao Histórico"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FinalizarPartida;
