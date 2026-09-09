import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

// Mapeamento dinâmico das bandeiras
const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};
for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

function Horarios() {
  const [generoFiltro, setGeneroFiltro] = useState("M"); // "M" ou "F"
  const [modalidadeId, setModalidadeId] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [confrontos, setConfrontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroSupabase, setErroSupabase] = useState("");
  const [mostrarSeta, setMostrarSeta] = useState(false);

  useEffect(() => {
    const handleScroll = () => setMostrarSeta(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carrega lista de modalidades
  useEffect(() => {
    async function carregarModalidades() {
      const { data, error } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (!error && data) setModalidades(data);
    }
    carregarModalidades();
  }, []);

  // Carrega os confrontos do Supabase sem colunas inexistentes
  useEffect(() => {
    async function buscarConfrontos() {
      setLoading(true);
      setErroSupabase("");

      try {
        const { data, error } = await supabase
          .from("confronto")
          .select(`
            id,
            horario,
            finalizado,
            time1:time1 (
              id,
              Nome,
              logo_URL,
              modalidade:id_modalidade (
                id,
                nome,
                genero
              )
            ),
            time2:time2 (
              id,
              Nome,
              logo_URL
            )
          `);

        if (error) {
          console.error("Erro no Supabase:", error);
          setErroSupabase(error.message);
        } else {
          setConfrontos(data || []);
        }
      } catch (err) {
        console.error("Erro de requisição:", err);
        setErroSupabase("Erro ao conectar ao banco de dados.");
      } finally {
        setLoading(false);
      }
    }

    buscarConfrontos();
  }, []);

  const renderBandeira = (logoURL, nomeAlt) => {
    if (!logoURL) return null;
    const imgUrl = BANDEIRAS[logoURL] || logoURL;
    return <img src={imgUrl} alt={nomeAlt || "Bandeira"} className="bandeira-img" />;
  };

  const subirParaTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtragem dos confrontos por gênero e modalidade
  const confrontosFiltrados = confrontos.filter((jogo) => {
    if (jogo.finalizado === true) return false;

    const modObj = jogo.time1?.modalidade;
    const modGenero = (modObj?.genero || "").toUpperCase();

    let confereGenero = true;
    if (modGenero && modGenero !== "NOT" && modGenero !== "N") {
      confereGenero = modGenero.startsWith(generoFiltro);
    }

    const confereModalidade = modalidadeId
      ? Number(modObj?.id) === Number(modalidadeId)
      : true;

    return confereGenero && confereModalidade;
  });

  return (
    <div className="horarios-container">
      {/* FILTROS */}
      <div className="filtros-wrapper">
        <div className="genero-toggle">
          <button
            type="button"
            className={`btn-genero ${generoFiltro === "M" ? "active" : ""}`}
            onClick={() => setGeneroFiltro("M")}
          >
            MASC
          </button>
          <button
            type="button"
            className={`btn-genero ${generoFiltro === "F" ? "active" : ""}`}
            onClick={() => setGeneroFiltro("F")}
          >
            FEM
          </button>
        </div>

        <div className="select-modalidade-wrapper">
          <select
            value={modalidadeId}
            onChange={(e) => setModalidadeId(e.target.value)}
            className="select-modalidade"
          >
            <option value="">MODALIDADE ↓</option>
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome.toUpperCase()} {m.genero && m.genero !== "Not" ? `(${m.genero})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DUMMY CARD AO VIVO */}
      <div className="lista-cards">
        <div className="card-partida live">
          <span className="badge-status-live">
            AO VIVO <span className="dot">•</span>
          </span>
          <div className="conteudo-partida">
            <div className="col-time">
              <div className="box-logo" />
              <span className="nome-turma">nome da turma</span>
            </div>
            <div className="placar-box">0 : 0</div>
            <div className="col-time">
              <div className="box-logo" />
              <span className="nome-turma">nome da turma</span>
            </div>
          </div>
          <div className="badge-quadra">QUADRA 4</div>
        </div>
      </div>

      {/* LINHA DIVISÓRIA EM BREVE */}
      <div className="divisor-em-breve">
        <div className="linha-laranja" />
        <span className="badge-divisor">EM BREVE</span>
      </div>

      {/* CARDS VINDOS DO BANCO */}
      <div className="lista-cards">
        {loading ? (
          <p className="loading-text">Carregando horários...</p>
        ) : erroSupabase ? (
          <p className="loading-text" style={{ color: "red" }}>
            {erroSupabase}
          </p>
        ) : confrontosFiltrados.length > 0 ? (
          confrontosFiltrados.map((jogo) => (
            <div key={jogo.id} className="card-partida">
              <span className="badge-status-upcoming">EM BREVE •</span>

              <div className="conteudo-partida">
                <div className="col-time">
                  <div className="box-logo">
                    {renderBandeira(jogo.time1?.logo_URL, jogo.time1?.Nome)}
                  </div>
                  <span className="nome-turma">
                    {jogo.time1?.Nome || "Time 1"}
                  </span>
                </div>

                <div className="placar-box">0 : 0</div>

                <div className="col-time">
                  <div className="box-logo">
                    {renderBandeira(jogo.time2?.logo_URL, jogo.time2?.Nome)}
                  </div>
                  <span className="nome-turma">
                    {jogo.time2?.Nome || "Time 2"}
                  </span>
                </div>
              </div>

              <div className="badge-quadra">QUADRA 2</div>
            </div>
          ))
        ) : (
          <p className="loading-text">Nenhum confronto encontrado.</p>
        )}
      </div>

      {mostrarSeta && (
        <button
          type="button"
          className="btn-scroll-top"
          onClick={subirParaTopo}
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Horarios;