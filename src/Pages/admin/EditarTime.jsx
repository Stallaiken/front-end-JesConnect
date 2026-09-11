import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "../../css/admin/EditarTime.css";

const supabaseUrl = "https://hneubqtpksfndtmfwgzi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZXVicXRwa3NmbmR0bWZ3Z3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzg5NDcsImV4cCI6MjEwMjkxNDk0N30.PWQpqBc0Lxfg05-wN3B4jrLtaJnXxjdW-4Wu3ugJ49I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const bandeirasModules = import.meta.glob(
  "../../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true },
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
  const [sucesso, setSucesso] = useState("");

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
    setSucesso("");

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
    setSucesso("");

    if (!timeSelecionadoId) {
      setErro("Selecione um time.");
      return;
    }

    if (!nome.trim()) {
      setErro("Digite o nome do time.");
      return;
    }

    if (!modalidadeId) {
      setErro("Selecione uma modalidade.");
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

      if (error) throw error;

      setSucesso("Time atualizado com sucesso!");
      setTimeout(() => {
        navigate("/Horarios");
      }, 1500);
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
    <div className="editar-time-page">
      <div className="editar-time-container">
        <div className="editar-time-header">
          <h2 className="editar-time-titulo">Editar Time</h2>

          <button
            type="button"
            className="btn-fechar"
            onClick={() => navigate(-1)}
          >
            ✕
          </button>
        </div>

        {/* SELEÇÃO DO TIME */}
        <div className="input-card">
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
            {/* NOME DO TIME */}
            <div className="input-card">
              <label>NOME DO TIME</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={40}
              />
            </div>

            {/* SELEÇÃO ÚNICA DE MODALIDADE */}
            <div className="input-card">
              <label>MODALIDADE</label>
              <select
                value={modalidadeId}
                onChange={(e) => setModalidadeId(e.target.value)}
              >
                <option value="">Selecione a modalidade...</option>
                {modalidades.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                    {m.genero && m.genero !== "Not" ? ` (${m.genero})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* BANDEIRAS */}
            <div className="bandeiras-secao">
              <label className="bandeiras-label">SELECIONE A BANDEIRA</label>

              <button
                type="button"
                className={`btn-sem-bandeira ${
                  bandeira === "" ? "selecionado" : ""
                }`}
                onClick={() => setBandeira("")}
              >
                {bandeira === "" ? "✓ Sem bandeira" : "Sem bandeira"}
              </button>

              <div className="bandeiras-grid">
                {Object.entries(BANDEIRAS).map(([key, src]) => {
                  const selecionada = bandeira === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      className={`bandeira-item ${
                        selecionada ? "selecionada" : ""
                      }`}
                      onClick={() => setBandeira(key)}
                      title={key}
                    >
                      <img src={src} alt={key} className="bandeira-img" />
                      {selecionada && <span className="badge-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {erro && <p className="error-msg">{erro}</p>}
            {sucesso && <p className="success-msg">{sucesso}</p>}

            <button
              type="button"
              onClick={handleAtualizar}
              disabled={loading}
              className="btn-salvar-principal"
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
