import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import "../css/Times.css";

// Mapeamento dinâmico das bandeiras/logos locais
const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Times() {
  const [times, setTimes] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: modalidadesData } = await supabase
        .from("modalidade")
        .select("id, nome")
        .order("nome", { ascending: true });

      if (modalidadesData) setModalidades(modalidadesData);

      const { data: timesData, error } = await supabase
        .from("time")
        .select("id, Nome, logo_URL, id_modalidade")
        .order("Nome", { ascending: true });

      if (!error && timesData) {
        setTimes(timesData);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Renderiza a imagem ou o 'X' caso não exista ou falhe
  const renderLogo = (logoURL, nomeAlt) => {
    if (!logoURL) return <span className="time-logo-x">X</span>;

    const imgUrl = BANDEIRAS[logoURL] || logoURL;

    return (
      <img
        src={imgUrl}
        alt={nomeAlt || "Logo do time"}
        onError={(e) => {
          // Se a imagem falhar ao carregar, substitui pelo 'X'
          e.target.onerror = null;
          e.target.style.display = "none";
          if (e.target.parentElement) {
            e.target.parentElement.innerHTML = '<span class="time-logo-x">X</span>';
          }
        }}
      />
    );
  };

  const timesFiltrados = times.filter((t) => {
    const bateNome = t.Nome?.toLowerCase().includes(filtroNome.toLowerCase());
    const bateModalidade = filtroModalidade
      ? String(t.id_modalidade) === String(filtroModalidade)
      : true;
    return bateNome && bateModalidade;
  });

  return (
    <div className="times-container">
      {/* FILTROS */}
      <div className="times-filtros">
        <div className="select-wrapper">
          <select
            className="btn-filtro-modalidade"
            value={filtroModalidade}
            onChange={(e) => setFiltroModalidade(e.target.value)}
          >
            <option value="">MODALIDADE ↓</option>
            {modalidades.map((mod) => (
              <option key={mod.id} value={mod.id}>
                {mod.nome.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          className="input-busca-nome"
          placeholder="BUSCAR POR NOME"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />
      </div>

      {/* LISTAGEM DE TIMES */}
      <div className="times-lista">
        {loading ? (
          <p className="times-status-texto">Carregando times...</p>
        ) : timesFiltrados.length > 0 ? (
          timesFiltrados.map((timeItem) => (
            <div key={timeItem.id} className="time-card">
              <div className="time-logo-box">
                {renderLogo(timeItem.logo_URL, timeItem.Nome)}
              </div>
              <h3 className="time-nome">{timeItem.Nome}</h3>
            </div>
          ))
        ) : (
          <p className="times-status-texto">Nenhum time encontrado.</p>
        )}
      </div>

      {/* BOTÃO ROLAR AO TOPO */}
      {showScrollTop && (
        <button
          type="button"
          className="btn-scroll-top"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Times;