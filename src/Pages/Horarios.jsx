import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../css/Horarios.css";

const bandeirasModules = import.meta.glob(
  "../assets/bandeiras/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const BANDEIRAS = {};

for (const path in bandeirasModules) {
  const fileName = path.split("/").pop().split(".")[0];
  BANDEIRAS[fileName] = bandeirasModules[path].default;
}

// Componente isolado para a Imagem da Bandeira
function BandeiraImg({ logoURL, nomeAlt }) {
  const [erroImg, setErroImg] = useState(false);
  const imgUrl = logoURL ? BANDEIRAS[logoURL] || logoURL : null;

  if (!imgUrl || erroImg) {
    return <span className="time-logo-x">X</span>;
  }

  return (
    <img
      src={imgUrl}
      alt={nomeAlt || "Bandeira"}
      className="bandeira-img"
      onError={() => setErroImg(true)}
    />
  );
}

function Horarios({ acaoSelecao = null, jogoSelecionado = null, onSelecionarJogo }) {
  const [generoFiltro, setGeneroFiltro] = useState("M");
  const [modalidadeId, setModalidadeId] = useState("");
  const [modalidades, setModalidades] = useState([]);
  const [confrontos, setConfrontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroSupabase, setErroSupabase] = useState("");
  const [mostrarSeta, setMostrarSeta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarSeta(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);

      const { data: mods, error: errMods } = await supabase
        .from("modalidade")
        .select("id, nome, genero")
        .order("nome");

      if (errMods) {
        console.error("Erro modalidades:", errMods);
      }
      setModalidades(mods || []);

      const { data: confs, error: errConfs } = await supabase
        .from("confronto")
        .select(`
          id,
          finalizado,
          ao_vivo,
          horario,

          time1:time1 (
            id,
            Nome,
            logo_URL,
            id_modalidade
          ),

            time2:time2 (
              id,
              Nome,
              logo_URL,
              id_modalidade
            )
          `);

      if (errConfs) {
        console.error("Erro confrontos:", errConfs);
        setErroSupabase(errConfs.message);
      } else {
        setConfrontos(confs || []);
      }
      setLoading(false);
    }

    carregarDados();
  }, []);

  const renderBandeira = (logoURL, nomeAlt) => {
    if (!logoURL) return null;
    const imgUrl = BANDEIRAS[logoURL] || logoURL;
    return (
      <img
        src={imgUrl}
        alt={nomeAlt || "Bandeira"}
        className="bandeira-img"
      />
    );
  };

  const subirParaTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filtragem dos confrontos mantendo a regra corrigida
  const confrontosFiltrados = confrontos.filter((jogo) => {
    if (jogo.finalizado === true) {
      return false;
    }

    const idModalidadeTime1 = jogo.time1?.id_modalidade;

    // FILTRO DE MODALIDADE
    if (modalidadeId) {
      const mesmaModalidade =
        String(idModalidadeTime1) === String(modalidadeId);

      if (!mesmaModalidade) {
        return false;
      }
    }

    // ENCONTRAR A MODALIDADE DO TIME
    const modalidadeDoTime = modalidades.find(
      (modalidade) =>
        String(modalidade.id) === String(idModalidadeTime1)
    );

    const modGenero = (
      modalidadeDoTime?.genero || ""
    ).toUpperCase();

    // FILTRO DE GÊNERO
    if (modGenero && modGenero !== "NOT" && modGenero !== "N") {
      if (modGenero !== generoFiltro) return false;
    }

    return true;
  });

  // Divisão entre Ao Vivo e Em Breve
  const aoVivoFiltrados = confrontosFiltrados.filter((j) => j.ao_vivo === true);
  const emBreveFiltrados = confrontosFiltrados.filter((j) => !j.ao_vivo);

  return (
    <div className="horarios-container">
      {/* FILTROS */}
      <div className="filtros-wrapper">

        <div className="genero-toggle">

          <button
            type="button"
            className={`btn-genero ${
              generoFiltro === "M" ? "active" : ""
            }`}
            onClick={() => setGeneroFiltro("M")}
          >
            MASC
          </button>

          <button
            type="button"
            className={`btn-genero ${
              generoFiltro === "F" ? "active" : ""
            }`}
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
            {modalidades.map((modalidade) => (
              <option key={modalidade.id} value={modalidade.id}>
                {modalidade.nome.toUpperCase()}
                {modalidade.genero && modalidade.genero !== "Not"
                  ? ` (${modalidade.genero})`
                  : ""}
              </option>
            ))}

          </select>
        </div>

      </div>

      {loading ? (
        <p className="loading-text">
          Carregando horários...
        </p>
      ) : erroSupabase ? (
        <p
          className="loading-text"
          style={{ color: "red" }}
        >
          {erroSupabase}
        </p>
      ) : (
        <>

          {/* CARDS AO VIVO */}
          <div className="lista-cards">

            {aoVivoFiltrados.length > 0 ? (
              aoVivoFiltrados.map((jogo) => (
                <div key={jogo.id} className="card-partida live">
                  <span className="badge-status-live">
                    AO VIVO <span className="dot">•</span>
                  </span>

                  <div className="conteudo-partida">
                    <div className="col-time">
                      <div className="box-logo">
                        {renderBandeira(
                          jogo.time1?.logo_URL,
                          jogo.time1?.Nome
                        )}
                      </div>
                      <span className="nome-turma">
                        {jogo.time1?.Nome || "Time 1"}
                      </span>
                    </div>

                    <div className="placar-box">VS</div>

                    <div className="col-time">
                      <div className="box-logo">
                        {renderBandeira(
                          jogo.time2?.logo_URL,
                          jogo.time2?.Nome
                        )}
                      </div>
                      <span className="nome-turma">
                        {jogo.time2?.Nome || "Time 2"}
                      </span>
                    </div>
                  </div>

                  <div className="badge-quadra">QUADRA</div>
                </div>
              ))
            ) : (
              <p className="loading-text">Nenhuma partida ao vivo no momento.</p>
            )}

          </div>

          {/* DIVISOR EM BREVE */}
          <div className="divisor-em-breve">

            <div className="linha-laranja" />

            <span className="badge-divisor">
              EM BREVE
            </span>

          </div>

          {/* CARDS EM BREVE */}
          <div className="lista-cards">

            {emBreveFiltrados.length > 0 ? (
              emBreveFiltrados.map((jogo) => (
                <div key={jogo.id} className="card-partida">
                  <span className="badge-status-upcoming">EM BREVE •</span>

                  <div className="conteudo-partida">
                    <div className="col-time">
                      <div className="box-logo">
                        {renderBandeira(
                          jogo.time1?.logo_URL,
                          jogo.time1?.Nome
                        )}
                      </div>
                      <span className="nome-turma">
                        {jogo.time1?.Nome || "Time 1"}
                      </span>
                    </div>

                    <div className="placar-box">VS</div>

                    <div className="col-time">
                      <div className="box-logo">
                        {renderBandeira(
                          jogo.time2?.logo_URL,
                          jogo.time2?.Nome
                        )}
                      </div>
                      <span className="nome-turma">
                        {jogo.time2?.Nome || "Time 2"}
                      </span>
                    </div>
                  </div>

                  <div className="badge-quadra">QUADRA</div>
                </div>
              ))
            ) : (
              <p className="loading-text">Nenhum confronto agendado em breve.</p>
            )}

          </div>

        </>
      )}

      {/* BOTÃO VOLTAR AO TOPO */}
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
