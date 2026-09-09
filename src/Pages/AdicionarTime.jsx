import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../css/AdicionarTime.css";

// Carregamento dinâmico das bandeiras da pasta assets
const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const LISTA_BANDEIRAS = Object.keys(bandeirasModules).map((path) => {
  const fileName = path.split("/").pop();
  return {
    nome: fileName.split(".")[0],
    url: bandeirasModules[path].default,
  };
});

function AdicionarTime() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [modalidadesSelecionadas, setModalidadesSelecionadas] = useState([]);
  const [bandeiraSelecionada, setBandeiraSelecionada] = useState(null);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarModalidades = async () => {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (!error) setModalidades(data || []);
    };

    carregarModalidades();
  }, []);

  const toggleModalidade = (id) => {
    setModalidadesSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSalvarTime = async (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) {
      setErro("Preencha o nome do time.");
      return;
    }

    if (modalidadesSelecionadas.length === 0) {
      setErro("Selecione pelo menos uma modalidade.");
      return;
    }

    setLoading(true);

    try {
      // Insere um registro para cada modalidade selecionada
      const registros = modalidadesSelecionadas.map((modId) => ({
        Nome: nome.trim(),
        logo_URL: bandeiraSelecionada,
        id_modalidade: Number(modId),
      }));

      const { error } = await supabase.from("time").insert(registros);

      if (error) throw error;

      navigate("/Horarios");
    } catch (err) {
      console.error(err);
      setErro("Erro ao cadastrar o time. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-time-screen">
      {/* CAMEÇALHO SESI */}
      <header className="sesi-app-header">
        <button type="button" className="menu-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="sesi-brand-badge">
          <span className="sesi-title">SESI</span>
          <span className="sesi-sub">JES CONNECT</span>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="add-time-container">
        <form onSubmit={handleSalvarTime} className="add-time-form">
          
          {/* NOME DO TIME */}
          <div className="black-card-input">
            <span className="field-caption">NOME DO TIME</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome..."
              required
            />
          </div>

          {/* SELEÇÃO MÚLTIPLA DE MODALIDADES */}
          <div className="black-card-input multi-card">
            <span className="field-caption">MODALIDADE(S)</span>
            <div className="modalidades-grid">
              {modalidades.map((m) => {
                const selected = modalidadesSelecionadas.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    className={`chip-modalidade ${selected ? "active" : ""}`}
                    onClick={() => toggleModalidade(m.id)}
                  >
                    {m.nome} {m.genero && m.genero !== "Not" ? `(${m.genero})` : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELEÇÃO DE BANDEIRA */}
          <div className="bandeira-section">
            <span className="bandeira-title">SELECIONE A BANDEIRA</span>

            <button
              type="button"
              className={`btn-sem-bandeira ${bandeiraSelecionada === null ? "active" : ""}`}
              onClick={() => setBandeiraSelecionada(null)}
            >
              Sem bandeira
            </button>

            <div className="bandeiras-grid">
              {LISTA_BANDEIRAS.map((b) => (
                <button
                  type="button"
                  key={b.nome}
                  className={`bandeira-item ${bandeiraSelecionada === b.url ? "active" : ""}`}
                  onClick={() => setBandeiraSelecionada(b.url)}
                >
                  <img src={b.url} alt={b.nome} />
                </button>
              ))}
            </div>
          </div>

          {erro && <p className="error-text-msg">{erro}</p>}

          {/* BOTÃO SALVAR */}
          <div className="submit-wrapper">
            <button type="submit" className="btn-salvar-figma" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}

export default AdicionarTime;