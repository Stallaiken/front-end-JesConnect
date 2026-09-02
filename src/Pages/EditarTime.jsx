import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/AdicionarJogo.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  {
    eager: true,
  },
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];

  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function EditarTime() {
  const navigate = useNavigate();

  const [times, setTimes] = useState([]);
  const [timeSelecionadoId, setTimeSelecionadoId] = useState("");

  const [nome, setNome] = useState("");
  const [modalidadeId, setModalidadeId] = useState("");
  const [bandeira, setBandeira] = useState("");

  const [modalidades, setModalidades] = useState([]);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      const { data: modData } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      const { data: timeData } = await supabase
        .from("time")
        .select("id, Nome, id_modalidade, logo_URL")
        .order("Nome");

      setModalidades(modData || []);
      setTimes(timeData || []);
    };

    carregarDados();
  }, []);

  const handleSelecionarTime = (e) => {
    const id = e.target.value;

    setTimeSelecionadoId(id);
    setErro("");

    const timeEncontrado = times.find((t) => String(t.id) === String(id));

    if (timeEncontrado) {
      setNome(timeEncontrado.Nome || "");
      setModalidadeId(timeEncontrado.id_modalidade || "");
      setBandeira(timeEncontrado.logo_URL || "");
    } else {
      setNome("");
      setModalidadeId("");
      setBandeira("");
    }
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();

    setErro("");

    if (!timeSelecionadoId) {
      setErro("Selecione um time.");
      return;
    }

    if (!nome.trim()) {
      setErro("Digite o nome do time.");
      return;
    }

    if (!modalidadeId) {
      setErro("Selecione a modalidade.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("time")
        .update({
          Nome: nome.trim(),
          id_modalidade: modalidadeId,
          logo_URL: bandeira || null,
        })
        .eq("id", timeSelecionadoId);

      if (error) {
        throw error;
      }

      alert("Time atualizado com sucesso!");

      navigate("/Horarios");
    } catch (err) {
      console.error(err);

      if (err.code === "23505") {
        setErro("Esse nome de time já existe.");
      } else {
        setErro("Erro ao atualizar o time.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-jogo-page">
      <div className="add-jogo-container" style={{ maxWidth: "520px" }}>
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
            Editar Time
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

        {/* TIME */}

        <div
          className="input-card config-card"
          style={{ marginBottom: "16px" }}
        >
          <label>ESCOLHER TIME</label>

          <select value={timeSelecionadoId} onChange={handleSelecionarTime}>
            <option value="">Selecione o time...</option>

            {times.map((time) => (
              <option key={time.id} value={time.id}>
                {time.Nome}
              </option>
            ))}
          </select>
        </div>

        {timeSelecionadoId && (
          <>
            {/* NOME */}

            <div
              className="input-card config-card"
              style={{ marginBottom: "16px" }}
            >
              <label>NOME DO TIME</label>

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={40}
              />
            </div>

            {/* MODALIDADE */}

            <div
              className="input-card config-card"
              style={{ marginBottom: "24px" }}
            >
              <label>MODALIDADE</label>

              <select
                value={modalidadeId}
                onChange={(e) => setModalidadeId(e.target.value)}
              >
                {modalidades.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}

                    {m.genero && m.genero !== "Not" ? ` (${m.genero})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* BANDEIRAS */}

            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "12px",
                  fontSize: "0.9rem",
                }}
              >
                SELECIONE A BANDEIRA
              </label>

              <button
                type="button"
                onClick={() => setBandeira("")}
                style={{
                  width: "100%",
                  marginBottom: "12px",
                  padding: "10px",
                  borderRadius: "10px",
                  border:
                    bandeira === "" ? "2px solid #2563eb" : "2px solid #e2e8f0",
                  background: bandeira === "" ? "#eff6ff" : "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sem bandeira
              </button>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
                  gap: "10px",
                  maxHeight: "260px",
                  overflowY: "auto",
                  padding: "4px",
                }}
              >
                {Object.entries(BANDEIRAS).map(([key, src]) => {
                  const selecionada = bandeira === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBandeira(key)}
                      title={key}
                      style={{
                        border: selecionada
                          ? "3px solid #2563eb"
                          : "2px solid #e2e8f0",
                        borderRadius: "12px",
                        padding: "8px",
                        background: selecionada ? "#eff6ff" : "white",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={src}
                        alt={key}
                        style={{
                          width: "52px",
                          height: "34px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {erro && (
              <p
                style={{
                  color: "#dc2626",
                  textAlign: "center",
                  marginBottom: "12px",
                }}
              >
                {erro}
              </p>
            )}

            <button
              type="button"
              onClick={handleAtualizar}
              disabled={loading}
              className="btn-salvar-principal"
              style={{
                width: "100%",
              }}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EditarTime;
